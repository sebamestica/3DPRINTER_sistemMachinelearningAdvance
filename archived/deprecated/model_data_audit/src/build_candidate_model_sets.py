import pandas as pd
import numpy as np
import re
from pathlib import Path
from src.utils import write_json


SPECIMEN_HINTS = ["probeta", "sheet", "specimen"]
STRESS_HINTS = ["stress[mpa]", "stress_mpa", "stress", "unnamed:_6"]
FORCE_HINTS = ["axial_force", "unnamed:_1", "raw_data"]
DISPLACEMENT_HINTS = ["axial_displacement", "unnamed:_2", "raw_data.1"]

PROCESS_FEATURE_COLS_COMPRESSIVE = [
    "layer_height",
    "infill_density",
    "infill_pattern",
    "nozzle_temperature",
    "bed_temperature",
    "print_speed",
    "fan_speed",
    "wall_thickness",
]

LATTICE_PATTERN = re.compile(r"^([A-Z]{1,3})\d{2}", re.IGNORECASE)


def _find_col(df, hints):
    for h in hints:
        for c in df.columns:
            norm_c = c.lower().replace("[", "").replace("]", "").replace("/", "_").replace(" ", "_")
            norm_h = h.lower().replace("[", "").replace("]", "").replace("/", "_").replace(" ", "_")
            if norm_h in norm_c:
                return c
    return None


def _infer_structure_type(specimen_id):
    s = str(specimen_id).upper().strip()
    if s.startswith("SOL"):
        return "solid"
    if s.startswith("G"):
        return "gyroid"
    if s.startswith("H"):
        return "honeycomb"
    if s.startswith("T"):
        return "triply_periodic"
    return "unknown"


def _aggregate_compressive_data(path, logger):
    logger.info("  Reading Compressivedata for per-specimen aggregation...")
    try:
        df_raw = pd.read_csv(path, header=None, nrows=5)
        first_col_values = df_raw.iloc[:, 0].tolist()
        probeta_col_idx = None
        for idx, val in enumerate(first_col_values[1:], 1):
            if isinstance(val, str) and re.match(r"^[A-Z]\d{2}", str(val), re.IGNORECASE):
                probeta_col_idx = idx
                break
    except Exception:
        pass

    try:
        df = pd.read_csv(path, low_memory=False)
    except Exception as e:
        logger.error(f"  Cannot read Compressivedata: {e}")
        return None

    specimen_col = _find_col(df, SPECIMEN_HINTS)
    stress_col = _find_col(df, STRESS_HINTS)
    force_col = _find_col(df, FORCE_HINTS)

    if specimen_col is None:
        logger.warning("  No specimen column found in Compressivedata — cannot aggregate per specimen.")
        return None

    use_col = stress_col if stress_col else force_col
    if use_col is None:
        logger.warning("  No stress/force column found in Compressivedata.")
        return None

    df[specimen_col] = df[specimen_col].astype(str).str.strip()
    df[use_col] = pd.to_numeric(df[use_col], errors="coerce")

    valid = df[df[specimen_col].notna() & (df[specimen_col] != "") & (df[specimen_col] != "nan")]
    valid = valid[valid[use_col].notna()]

    if valid.empty:
        logger.warning("  No valid rows after filtering Compressivedata.")
        return None

    agg = valid.groupby(specimen_col)[use_col].agg(
        compressive_strength_max="max",
        compressive_strength_mean="mean",
        compressive_strength_std="std",
        n_readings="count",
    ).reset_index()

    agg.rename(columns={specimen_col: "specimen_id"}, inplace=True)
    agg["structure_type"] = agg["specimen_id"].apply(_infer_structure_type)
    agg["source_dataset"] = "Compressivedata.csv"

    logger.info(f"  Compressivedata aggregated: {len(agg)} specimens, col='{use_col}'")
    return agg


def build_candidate_model_sets(candidates, profiles, target_results, derivation, logger, artifacts_dir):
    logger.info("=== FASE 5: Construcción de datasets candidatos para modelado ===")

    datasets_out = {}
    row_registry = []

    data_path = candidates.get("data.csv", {}).get("cleaned_path")
    df_data = None
    if data_path and Path(data_path).exists():
        df_data = pd.read_csv(data_path, low_memory=False)
        df_data["source_dataset"] = "data.csv"
        df_data["target_col_origin"] = "tension_strenght"
        df_data["compressive_strength"] = pd.to_numeric(df_data.get("tension_strenght"), errors="coerce")
        for _, row in df_data.iterrows():
            row_registry.append({"source": "data.csv", "specimen_id": "N/A", "target_origin": "tension_strenght"})

    comp_path = candidates.get("Compressivedata.csv", {}).get("cleaned_path")
    df_comp_agg = None
    if comp_path and Path(comp_path).exists():
        if derivation.get("Compressivedata.csv", {}).get("derivation_possible"):
            df_comp_agg = _aggregate_compressive_data(comp_path, logger)
            if df_comp_agg is not None:
                df_comp_agg["compressive_strength"] = df_comp_agg["compressive_strength_max"]
                for _, row in df_comp_agg.iterrows():
                    row_registry.append({
                        "source": "Compressivedata.csv",
                        "specimen_id": row.get("specimen_id", "N/A"),
                        "target_origin": "max(stress[mpa]) per specimen",
                    })

    candidate_A = None
    if df_comp_agg is not None:
        candidate_A = df_comp_agg[["specimen_id", "structure_type", "compressive_strength",
                                    "compressive_strength_mean", "compressive_strength_std",
                                    "n_readings", "source_dataset"]].copy()
        candidate_A = candidate_A[candidate_A["compressive_strength"].notna()]
        datasets_out["candidate_A_compressive_only"] = {
            "rows": len(candidate_A),
            "features": ["structure_type"],
            "target": "compressive_strength (max stress per specimen)",
            "target_origin": "Aggregated from Compressivedata.csv per-specimen readings",
            "source_datasets": ["Compressivedata.csv"],
            "warnings": [
                "No process parameters (infill, layer height, etc.) — only structural type is available as feature.",
                "Without process parameter linkage this dataset cannot explain manufacturing decisions.",
                "Specimen IDs not linked to FDM_Dataset or data.csv — external join needed.",
            ],
            "viability": "LOW for predictive modeling — insufficient features. Useful as descriptive analysis only.",
        }
        out_path = Path(artifacts_dir) / "candidate_targets" / "candidate_A_compressive_only.csv"
        out_path.parent.mkdir(parents=True, exist_ok=True)
        candidate_A.to_csv(out_path, index=False)
        logger.info(f"  Candidate A: {len(candidate_A)} specimens (Compressivedata aggregated)")

    candidate_B = None
    if df_data is not None:
        keep_cols = [c for c in df_data.columns if c not in ["source_dataset", "target_col_origin"]]
        candidate_B = df_data[keep_cols + ["source_dataset"]].copy()
        candidate_B = candidate_B[candidate_B["compressive_strength"].notna()]
        process_features = [c for c in candidate_B.columns
                            if c not in ("compressive_strength", "source_dataset", "tension_strenght")]
        datasets_out["candidate_B_data_only"] = {
            "rows": len(candidate_B),
            "features": process_features,
            "target": "compressive_strength (renamed from tension_strenght)",
            "target_origin": "tension_strenght from data.csv — tensile, not compressive",
            "source_datasets": ["data.csv"],
            "warnings": [
                "tension_strenght measures TENSILE resistance, not compressive strength.",
                "Renaming this column to compressive_strength is mechanically incorrect.",
                "This is the exact base the previous pipeline used — 50 rows of tensile data labeled as compressive.",
                "Valid as a tensile resistance predictor, NOT as a compressive strength predictor.",
            ],
            "viability": "INVALID as compressive model. Valid as tensile resistance model if renamed correctly.",
        }
        out_path = Path(artifacts_dir) / "candidate_targets" / "candidate_B_data_only.csv"
        candidate_B.to_csv(out_path, index=False)
        logger.info(f"  Candidate B: {len(candidate_B)} rows (data.csv — tensile)")

    write_json(f"{artifacts_dir}/row_origin_registry/row_registry.json", row_registry)
    write_json(f"{artifacts_dir}/candidate_targets/candidate_summaries.json", datasets_out)
    return datasets_out, candidate_A, candidate_B
