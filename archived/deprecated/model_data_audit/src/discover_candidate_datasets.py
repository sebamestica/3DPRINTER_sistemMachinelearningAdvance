import pandas as pd
from pathlib import Path
from src.utils import get_cleaned_dir, load_registry, write_json


CLEANED_NAME_MAP = {
    "FDM_Dataset.csv":           "FDM_Dataset_cleaned.csv",
    "Compressivedata.csv":       "Compressivedata_cleaned.csv",
    "TensiondataB.csv":          "TensiondataB_cleaned.csv",
    "Propiedades_Extraidas.csv": "Propiedades_Extraidas_cleaned.csv",
    "TensiondataA.csv":          "TensiondataA_cleaned.csv",
    "data.csv":                  "data_cleaned.csv",
}


def _infer_test_type(name, columns):
    name_l = name.lower()
    col_set = set(c.lower() for c in columns)
    if "compressive" in name_l:
        return "compressive"
    if "tension" in name_l:
        return "tension"
    if any("stress" in c or "strain" in c for c in col_set):
        if any("compres" in c for c in col_set):
            return "compressive"
        return "tension_or_both"
    if "tension_strenght" in col_set or "elongation" in col_set:
        return "tension_summary"
    if "infill" in " ".join(col_set):
        return "process_parameters"
    return "unknown"


def discover_candidate_datasets(logger, artifacts_dir):
    logger.info("=== FASE 1: Descubrimiento de datasets candidatos ===")
    cleaned_dir = get_cleaned_dir()
    registry = load_registry()

    candidates = {}
    registry_seen = set()

    for reg_key, entry in registry.items():
        name = entry.get("name", "")
        if name in CLEANED_NAME_MAP:
            registry_seen.add(name)
        cleaned_name = CLEANED_NAME_MAP.get(name)
        if not cleaned_name:
            continue

        cleaned_path = cleaned_dir / cleaned_name
        if not cleaned_path.exists():
            logger.warning(f"  Cleaned file not found on disk: {cleaned_path}")
            continue

        if entry.get("is_duplicate_candidate"):
            logger.info(f"  Skipping duplicate candidate: {name}")
            continue

        if entry.get("status") != "cleaned":
            logger.info(f"  Skipping non-cleaned entry: {name} (status={entry.get('status')})")
            continue

        try:
            sample = pd.read_csv(cleaned_path, nrows=5, low_memory=False)
            full_info = pd.read_csv(cleaned_path, nrows=0, low_memory=False)
            n_rows_est = sum(1 for _ in open(cleaned_path, encoding="utf-8")) - 1
            columns = list(full_info.columns)
        except Exception as e:
            logger.error(f"  Cannot read {cleaned_name}: {e}")
            continue

        test_type = _infer_test_type(name, columns)

        candidates[name] = {
            "cleaned_path": str(cleaned_path),
            "registry_key": reg_key,
            "rows_approx": n_rows_est,
            "n_columns": len(columns),
            "columns": columns,
            "test_type": test_type,
            "value_score": entry.get("value_score", "unknown"),
            "reliability_score": entry.get("reliability_score", "unknown"),
            "is_tabular": entry.get("is_tabular", False),
            "registry_notes": entry.get("notes", ""),
        }
        logger.info(f"  Found: {name} | rows~{n_rows_est} | cols={len(columns)} | type={test_type}")

    write_json(f"{artifacts_dir}/dataset_profiles/discovery_index.json", candidates)
    logger.info(f"Descubrimiento completo: {len(candidates)} datasets válidos en disco.")
    return candidates
