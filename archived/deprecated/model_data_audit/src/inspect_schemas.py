import pandas as pd
import json
from pathlib import Path
from src.utils import write_json, get_project_root, load_registry


PIPELINE_TARGET_CONFIG = {
    "canonical_target": "compressive_strength",
    "synonyms": ["max_force", "tension_strenght", "stress[mpa]", "strength", "yield_strength"],
}

PIPELINE_QUALITY_RULES = {
    "low_value_exclusion": True,
    "low_reliability_exclusion": True,
}

PIPELINE_COMPAT_RULES = {
    "tension_exclusion_if_named": True,
    "compressive_inclusion_if_named": True,
    "generic_included_with_caution": True,
}


def _simulate_select_model_data(candidates, registry):
    decisions = {}
    for name, info in candidates.items():
        reg_entry = registry.get(info.get("registry_key"), {})
        value_score = info.get("value_score", "")
        reliability = info.get("reliability_score", "")

        df = pd.read_csv(info["cleaned_path"], nrows=100, low_memory=False)
        cols = [c.lower() for c in df.columns]

        valid_targets = [PIPELINE_TARGET_CONFIG["canonical_target"]] + PIPELINE_TARGET_CONFIG["synonyms"]
        found = [c for c in cols if any(t in c for t in valid_targets)]

        reasons = []

        if not found:
            decisions[name] = {
                "stage": "select_model_data",
                "outcome": "EXCLUDED",
                "reasons": ["No column matching canonical target or synonyms found in first 100 rows of CSV"],
                "found_targets": [],
                "value_score": value_score,
                "reliability_score": reliability,
            }
            continue

        if value_score == "low_value":
            reasons.append(f"value_score=low_value triggered exclusion rule")

        if reliability == "low_reliability":
            reasons.append(f"reliability_score=low_reliability triggered exclusion rule")

        if reasons:
            decisions[name] = {
                "stage": "select_model_data",
                "outcome": "EXCLUDED",
                "reasons": reasons,
                "found_targets": found,
                "value_score": value_score,
                "reliability_score": reliability,
            }
            continue

        decisions[name] = {
            "stage": "select_model_data",
            "outcome": "PASSED",
            "reasons": [],
            "found_targets": found,
            "value_score": value_score,
            "reliability_score": reliability,
        }

    return decisions


def _simulate_validate_compatibility(decisions, candidates):
    final = {}
    for name, dec in decisions.items():
        if dec["outcome"] != "PASSED":
            final[name] = dec
            continue

        if "Tension" in name:
            final[name] = {
                **dec,
                "stage": "validate_experimental_compatibility",
                "outcome": "EXCLUDED",
                "reasons": dec["reasons"] + [
                    "validate_experimental_compatibility: name contains 'Tension' → excluded as tension test"
                ],
            }
        elif "Compressive" in name:
            final[name] = {
                **dec,
                "stage": "validate_experimental_compatibility",
                "outcome": "PASSED",
                "reasons": dec["reasons"] + [
                    "validate_experimental_compatibility: name contains 'Compressive' → included"
                ],
            }
        else:
            final[name] = {
                **dec,
                "stage": "validate_experimental_compatibility",
                "outcome": "PASSED_WITH_CAUTION",
                "reasons": dec["reasons"] + [
                    "validate_experimental_compatibility: generic tabular dataset → included with caution"
                ],
            }
    return final


def _detect_csv_header_issue(path):
    with open(path, encoding="utf-8", errors="replace") as f:
        line1 = f.readline().strip()
        line2 = f.readline().strip()
    first_row_numeric = sum(1 for v in line2.split(",") if v.strip().replace(".", "").replace("-", "").isdigit())
    return first_row_numeric < 2


def trace_pipeline_exclusions(candidates, logger, artifacts_dir):
    logger.info("=== FASE 3: Trazabilidad de exclusiones en la pipeline previa ===")

    registry = load_registry()
    reg_by_name = {}
    for k, v in registry.items():
        reg_by_name[v["name"]] = v

    stage1 = _simulate_select_model_data(candidates, registry)
    stage2 = _simulate_validate_compatibility(stage1, candidates)

    header_issues = {}
    for name, info in candidates.items():
        has_issue = _detect_csv_header_issue(info["cleaned_path"])
        header_issues[name] = has_issue
        if has_issue:
            logger.warning(f"  CSV header structure issue detected in {name} (possible multi-row header)")

    trace = {}
    for name in candidates:
        trace[name] = {
            "pipeline_stage1_decision": stage1.get(name, {}),
            "pipeline_stage2_decision": stage2.get(name, {}),
            "csv_header_issue_detected": header_issues.get(name, False),
            "final_pipeline_outcome": stage2.get(name, {}).get("outcome", "UNKNOWN"),
        }
        logger.info(
            f"  {name}: final={trace[name]['final_pipeline_outcome']} | "
            f"header_issue={trace[name]['csv_header_issue_detected']}"
        )

    included = [n for n, t in trace.items() if t["final_pipeline_outcome"] in ("PASSED", "PASSED_WITH_CAUTION")]
    excluded = [n for n, t in trace.items() if t["final_pipeline_outcome"] == "EXCLUDED"]

    logger.info(f"  Datasets que habrían pasado la pipeline: {included}")
    logger.info(f"  Datasets excluidos por la pipeline: {excluded}")

    write_json(f"{artifacts_dir}/compatibility_tables/pipeline_trace.json", trace)
    return trace
