from src.utils import write_json


COMPARISON_CRITERIA = [
    "rows",
    "n_useful_features",
    "target_mechanical_validity",
    "source_correctness",
    "model_viability",
]


def _score_candidate(key, summary):
    score = {}

    rows = summary.get("rows", 0)
    score["rows"] = rows
    score["rows_rating"] = "sufficient" if rows >= 30 else "insufficient"

    features = summary.get("features", [])
    n_feat = len(features) if isinstance(features, list) else 0
    score["n_useful_features"] = n_feat
    score["features_rating"] = "rich" if n_feat >= 5 else ("minimal" if n_feat >= 2 else "insufficient")

    warnings = summary.get("warnings", [])
    mechanical_flags = [w for w in warnings if "tension" in w.lower() or "incorrect" in w.lower()]
    score["has_mechanical_validity_issues"] = len(mechanical_flags) > 0
    score["mechanical_validity"] = "INVALID" if mechanical_flags else "VALID"

    viability = summary.get("viability", "")
    score["viability_raw"] = viability
    score["viability_rating"] = (
        "HIGH" if "HIGH" in viability else
        "MEDIUM" if "MEDIUM" in viability else
        "LOW" if "LOW" in viability else
        "INVALID" if "INVALID" in viability else
        "UNKNOWN"
    )

    target_origin = summary.get("target_origin", "")
    score["target_correctness"] = (
        "CORRECT" if "compressive" in target_origin.lower() and "tensile" not in target_origin.lower() else
        "INCORRECT" if "tensile" in target_origin.lower() or "tension" in target_origin.lower() else
        "UNCERTAIN"
    )

    return score


def compare_candidate_model_sets(candidate_summaries, logger, artifacts_dir):
    logger.info("=== FASE 6: Comparación de datasets candidatos ===")

    comparison = {}
    for key, summary in candidate_summaries.items():
        score = _score_candidate(key, summary)
        comparison[key] = {
            "summary": summary,
            "scoring": score,
        }
        logger.info(
            f"  {key}: rows={score['rows']} | features={score['n_useful_features']} "
            f"| target={score['target_correctness']} | viability={score['viability_rating']}"
        )

    write_json(f"{artifacts_dir}/compatibility_tables/candidate_comparison.json", comparison)
    return comparison
