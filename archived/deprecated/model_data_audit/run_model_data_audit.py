import sys
import os
from pathlib import Path

os.chdir(Path(__file__).parent)
sys.path.insert(0, str(Path(__file__).parent))

from src.utils import setup_logger, write_json
from src.discover_candidate_datasets import discover_candidate_datasets
from src.inspect_targets import inspect_targets
from src.inspect_schemas import trace_pipeline_exclusions
from src.evaluate_dataset_value import evaluate_dataset_value
from src.evaluate_target_derivation import evaluate_target_derivation
from src.build_candidate_model_sets import build_candidate_model_sets
from src.compare_candidate_model_sets import compare_candidate_model_sets
from src.evaluate_compatibility import emit_final_decision
from src.export_audit_results import export_audit_results

REPORTS_DIR = "reports"
ARTIFACTS_DIR = "artifacts"
LOGS_DIR = "logs"


def run_audit():
    for d in [REPORTS_DIR, LOGS_DIR,
              f"{ARTIFACTS_DIR}/dataset_profiles",
              f"{ARTIFACTS_DIR}/candidate_targets",
              f"{ARTIFACTS_DIR}/compatibility_tables",
              f"{ARTIFACTS_DIR}/row_origin_registry"]:
        Path(d).mkdir(parents=True, exist_ok=True)

    logger = setup_logger(f"{LOGS_DIR}/audit.log")
    logger.info("=" * 60)
    logger.info("  MODEL DATA AUDIT — PLA_3dPrinter_RESISTENCE")
    logger.info("=" * 60)

    logger.info("\n[1/7] Descubrimiento de datasets candidatos")
    candidates = discover_candidate_datasets(logger, ARTIFACTS_DIR)

    logger.info("\n[2/7] Auditoría del target compressive_strength")
    target_results = inspect_targets(candidates, logger, ARTIFACTS_DIR)

    logger.info("\n[3/7] Trazabilidad de exclusiones en pipeline previa")
    pipeline_trace = trace_pipeline_exclusions(candidates, logger, ARTIFACTS_DIR)

    logger.info("\n[4/7] Evaluación de compatibilidad experimental")
    profiles, compatibility = evaluate_dataset_value(candidates, target_results, logger, ARTIFACTS_DIR)

    logger.info("\n[5/7] Evaluación de derivación de target")
    derivation = evaluate_target_derivation(candidates, compatibility, logger, ARTIFACTS_DIR)

    logger.info("\n[6/7] Construcción de datasets candidatos")
    candidate_summaries, candidate_A, candidate_B = build_candidate_model_sets(
        candidates, profiles, target_results, derivation, logger, ARTIFACTS_DIR
    )

    logger.info("\n[7/7a] Comparación de candidatos")
    comparison = compare_candidate_model_sets(candidate_summaries, logger, ARTIFACTS_DIR)

    logger.info("\n[7/7b] Decisión final")
    decision = emit_final_decision(comparison, candidate_summaries, logger, ARTIFACTS_DIR)

    logger.info("\n[Export] Generando reportes y artefactos")
    export_audit_results(
        candidates, target_results, pipeline_trace, profiles,
        compatibility, candidate_summaries, comparison,
        decision, REPORTS_DIR, ARTIFACTS_DIR, logger
    )

    logger.info("\n" + "=" * 60)
    logger.info("  AUDITORÍA COMPLETADA")
    logger.info(f"  Datasets descubiertos: {len(candidates)}")
    logger.info(f"  Datasets con target válido: {sum(1 for r in target_results.values() if r['verdict'] != 'no_valid_target')}")
    logger.info(f"  Candidatos de modelado construidos: {len(candidate_summaries)}")
    logger.info(f"  Bloqueo de modelado: {decision.get('block_modeling')}")
    logger.info(f"  Dataset recomendado: {decision.get('recommended_dataset')}")
    logger.info("=" * 60)

    if decision.get("block_modeling"):
        logger.warning(f"\n  >> BLOQUEO ACTIVO: {decision.get('block_reason')}")

    return decision


if __name__ == "__main__":
    run_audit()
