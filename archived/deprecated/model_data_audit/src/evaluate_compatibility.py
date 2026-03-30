from src.utils import write_json


def emit_final_decision(comparison, candidate_summaries, logger, artifacts_dir):
    logger.info("=== FASE 7: Decisión final sobre el dataset de modelado ===")

    all_invalid = all(
        s["scoring"]["target_correctness"] == "INCORRECT" or
        s["scoring"]["viability_rating"] in ("INVALID", "LOW")
        for s in comparison.values()
    )

    decision = {
        "recommended_dataset": None,
        "recommended_target": None,
        "recommended_modeling_task": None,
        "datasets_rejected": [],
        "open_limitations": [],
        "next_step": None,
        "block_modeling": False,
        "block_reason": None,
    }

    has_valid_compressive = any(
        k for k, v in comparison.items()
        if v["scoring"]["target_correctness"] == "CORRECT"
        and v["scoring"]["viability_rating"] not in ("INVALID", "LOW", "UNKNOWN")
    )

    has_low_but_correct_compressive = any(
        k for k, v in comparison.items()
        if v["scoring"]["target_correctness"] == "CORRECT"
    )

    if has_low_but_correct_compressive:
        chosen = next(
            k for k, v in comparison.items()
            if v["scoring"]["target_correctness"] == "CORRECT"
        )
        decision["recommended_dataset"] = chosen
        decision["recommended_target"] = "compressive_strength (aggregated max stress per specimen)"
        decision["recommended_modeling_task"] = "Descriptive regression: structure_type → compressive_strength"
        decision["next_step"] = (
            "Link Compressivedata specimen IDs to process parameters (FDM_Dataset or data.csv). "
            "Without this linkage the only available feature is structure_type, which limits predictive value. "
            "Once linked, this becomes a valid regression dataset."
        )
        decision["open_limitations"] = [
            "Specimen IDs in Compressivedata (G29A, H44B, etc.) are not yet linked to print parameters.",
            "Without process parameters (infill, layer height) the model has no manufacturing levers.",
            "Compressivedata.csv has multi-row CSV headers that broke the pipeline's target detection.",
            "n_specimens depends on how many unique probeta values have valid stress readings.",
        ]
        decision["block_modeling"] = True
        decision["block_reason"] = (
            "The only mechanically correct compressive dataset (Compressivedata) lacks process parameter features. "
            "Modeling only on structure_type is technically valid but produces an impoverished model. "
            "The critical missing step is linking specimen IDs to their print parameters. "
            "This audit recommends building that linkage before training."
        )
    else:
        decision["block_modeling"] = True
        decision["block_reason"] = "No mechanically valid compressive dataset found. All targets are tensile."

    for k, v in comparison.items():
        if k != decision.get("recommended_dataset"):
            score = v["scoring"]
            reasons = []
            if score["target_correctness"] == "INCORRECT":
                reasons.append("Target column is tensile resistance, not compressive strength")
            if score["viability_rating"] == "INVALID":
                reasons.append("Viability explicitly marked INVALID")
            if score["viability_rating"] == "LOW":
                reasons.append("Dataset has insufficient features for predictive modeling")
            decision["datasets_rejected"].append({"dataset": k, "reasons": reasons})

    write_json(f"{artifacts_dir}/candidate_targets/final_decision.json", decision)
    logger.info(f"  Decision: recommended={decision['recommended_dataset']} | block={decision['block_modeling']}")
    return decision
