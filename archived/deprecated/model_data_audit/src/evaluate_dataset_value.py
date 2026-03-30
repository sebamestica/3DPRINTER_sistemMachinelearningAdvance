import pandas as pd
import numpy as np
from src.utils import write_json


KNOWN_COMPRESSIVE_DATASETS = {"Compressivedata.csv"}
KNOWN_TENSION_DATASETS = {"TensiondataA.csv", "TensiondataB.csv"}
KNOWN_PROCESS_PARAM_DATASETS = {"FDM_Dataset.csv", "data.csv"}
KNOWN_SUMMARY_DATASETS = {"Propiedades_Extraidas.csv"}

HIGH_FREQUENCY_THRESHOLD = 5000

LATTICE_CODES = {
    "G": "Gyroid",
    "H": "Honeycomb",
    "T": "Triply-Periodic",
    "Sol": "Solid",
    "X": "Unknown_Lattice",
    "W": "Unknown_Lattice",
    "Y": "Unknown_Lattice",
    "Z": "Unknown_Lattice",
}


def _count_nulls_pct(df):
    total = df.shape[0] * df.shape[1]
    if total == 0:
        return 0.0
    return round(float(df.isnull().sum().sum()) / total * 100, 2)


def _has_unit_consistency(df):
    num_df = df.select_dtypes(include="number")
    if num_df.empty:
        return True
    ranges = num_df.max() - num_df.min()
    extreme = (ranges > 1e6).sum()
    return int(extreme) == 0


def _is_high_frequency_timeseries(df, rows):
    time_cols = [c for c in df.columns if "time" in c.lower()]
    if time_cols and rows > HIGH_FREQUENCY_THRESHOLD:
        return True
    return False


def evaluate_dataset_value(candidates, target_results, logger, artifacts_dir):
    logger.info("=== FASE 4: Evaluación de compatibilidad experimental real ===")

    profiles = {}
    compatibility = {}

    for name, info in candidates.items():
        path = info["cleaned_path"]
        rows = info["rows_approx"]
        cols = info["columns"]
        test_type = info["test_type"]
        target_verdict = target_results.get(name, {}).get("verdict", "no_valid_target")

        try:
            df = pd.read_csv(path, nrows=500, low_memory=False)
        except Exception as e:
            logger.error(f"  Cannot profile {name}: {e}")
            continue

        null_pct = _count_nulls_pct(df)
        unit_ok = _has_unit_consistency(df)
        is_timeseries = _is_high_frequency_timeseries(df, rows)
        n_numeric = df.select_dtypes(include="number").shape[1]
        n_categorical = df.select_dtypes(exclude="number").shape[1]

        profile = {
            "name": name,
            "rows_approx": rows,
            "n_columns": len(cols),
            "n_numeric_cols": n_numeric,
            "n_categorical_cols": n_categorical,
            "null_pct": null_pct,
            "unit_consistency_ok": unit_ok,
            "is_high_frequency_timeseries": is_timeseries,
            "test_type": test_type,
            "target_verdict": target_verdict,
        }

        compat_verdict = None
        compat_reasons = []

        if name in KNOWN_COMPRESSIVE_DATASETS:
            if is_timeseries:
                compat_verdict = "incompatible"
                compat_reasons.append(
                    "High-frequency compressive time-series: each row is a sensor reading, not a specimen. "
                    "Cannot use as-is for regression without per-specimen aggregation."
                )
            else:
                compat_verdict = "compatible"
                compat_reasons.append("Compressive test dataset with tabular structure.")

        elif name in KNOWN_TENSION_DATASETS:
            if is_timeseries:
                compat_verdict = "incompatible"
                compat_reasons.append(
                    "Tension time-series: measures tension, not compression. "
                    "Including as compressive_strength would confuse ensayo type."
                )
            else:
                compat_verdict = "incompatible"
                compat_reasons.append("Tension test: ensayo incompatible with compressive_strength target.")

        elif name in KNOWN_PROCESS_PARAM_DATASETS:
            if target_verdict == "no_valid_target":
                compat_verdict = "incompatible"
                compat_reasons.append("No valid compressive target in process parameter dataset.")
            elif name == "data.csv":
                compat_verdict = "compatible_with_caution"
                compat_reasons.append(
                    "data.csv contains tension_strenght, not compressive_strength. "
                    "The variable measures tensile resistance of FDM specimens. "
                    "Using it as compressive_strength proxy is mechanically debatable: "
                    "for isotropic FDM PLA under similar conditions tension and compression "
                    "results can correlate, but the datasets are not directly exchangeable. "
                    "Suitable only as a process-response model, not as a compressive strength predictor."
                )
            else:
                compat_verdict = "compatible_with_caution"
                compat_reasons.append("Process parameter dataset with indirect mechanical target.")

        elif name in KNOWN_SUMMARY_DATASETS:
            null_critical = null_pct > 50
            has_compressive_entries = False
            try:
                df_full = pd.read_csv(path, low_memory=False, nrows=200)
                if "file" in df_full.columns:
                    has_compressive_entries = df_full["file"].str.contains("Compressive", case=False, na=False).any()
            except Exception:
                pass

            if null_critical:
                compat_verdict = "incompatible"
                compat_reasons.append(
                    f"Propiedades_Extraidas: {null_pct:.1f}% null values. "
                    "Compressivedata entries (majority of rows) have ALL property columns empty — "
                    "properties were never extracted from the compressive data. "
                    "Only TensiondataA entries have numeric values, and those are tensile properties."
                )
            else:
                compat_verdict = "compatible_with_caution"
                compat_reasons.append("Summary dataset with partial data.")
        else:
            compat_verdict = "incompatible"
            compat_reasons.append("Dataset type not classifiable for compressive regression.")

        profile["compatibility_verdict"] = compat_verdict
        profile["compatibility_reasons"] = compat_reasons
        profiles[name] = profile
        compatibility[name] = {"verdict": compat_verdict, "reasons": compat_reasons}

        logger.info(f"  {name}: compat={compat_verdict}")

    write_json(f"{artifacts_dir}/dataset_profiles/full_profiles.json", profiles)
    write_json(f"{artifacts_dir}/compatibility_tables/compatibility_matrix.json", compatibility)
    return profiles, compatibility
