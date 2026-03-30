import pandas as pd
import numpy as np
from src.utils import write_json


COMPRESSIVE_TARGET_COL = "stress[mpa]"
COMPRESSIVE_FORCE_COL_HINTS = ["axial_force", "raw_data"]
COMPRESSIVE_DISPLACEMENT_COL_HINTS = ["axial_displacement", "unnamed:_1"]
COMPRESSIVE_SPECIMEN_COL = "probeta"

TIMESERIES_AGGREGATIONS = ["max", "mean", "min", "std", "range"]


def _find_col(df, hints):
    for h in hints:
        for c in df.columns:
            if h.lower() in c.lower():
                return c
    return None


def evaluate_target_derivation(candidates, compatibility, logger, artifacts_dir):
    logger.info("=== Evaluación de derivación de target desde Compressivedata ===")

    results = {}

    for name, info in candidates.items():
        compat = compatibility.get(name, {}).get("verdict", "incompatible")
        if compat == "incompatible":
            results[name] = {
                "derivation_possible": False,
                "note": "Dataset marked incompatible — derivation not evaluated.",
            }
            continue

        path = info["cleaned_path"]
        test_type = info.get("test_type", "")

        if name == "Compressivedata.csv":
            try:
                df = pd.read_csv(path, nrows=1000, low_memory=False)
            except Exception as e:
                results[name] = {"derivation_possible": False, "note": str(e)}
                continue

            stress_col = _find_col(df, ["stress[mpa]", "stress_mpa", "stress"])
            force_col = _find_col(df, COMPRESSIVE_FORCE_COL_HINTS)
            specimen_col = _find_col(df, [COMPRESSIVE_SPECIMEN_COL, "sheet", "probeta"])

            agg_possible = specimen_col is not None and (stress_col is not None or force_col is not None)

            results[name] = {
                "derivation_possible": agg_possible,
                "stress_col_found": stress_col,
                "force_col_found": force_col,
                "specimen_col_found": specimen_col,
                "aggregation_strategy": (
                    f"Group by '{specimen_col}', compute max({stress_col or force_col}) per specimen"
                    if agg_possible else "N/A"
                ),
                "note": (
                    "Compressivedata is a per-reading time-series. To produce one row per specimen "
                    "suitable for regression, must aggregate by specimen identifier. "
                    "This is valid: peak compressive stress per specimen is the standard mechanical property."
                    if agg_possible else
                    "Cannot aggregate: specimen column or stress/force column not found."
                ),
            }
            logger.info(f"  Compressivedata aggregation possible: {agg_possible}")

        else:
            results[name] = {
                "derivation_possible": False,
                "note": f"Derivation from {name} not applicable — not a compressive time-series.",
            }

    write_json(f"{artifacts_dir}/candidate_targets/derivation_assessment.json", results)
    return results
