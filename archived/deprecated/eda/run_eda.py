import sys
from pathlib import Path

sys.path.append(str(Path(__file__).parent))

from src.utils import setup_logger
from src.load_cleaned_data import load_all_datasets
from src.dataset_overview import compute_overview
from src.missing_analysis import analyze_missing_values
from src.numeric_analysis import analyze_numeric_variables
from src.categorical_analysis import analyze_categorical_variables
from src.target_analysis import identify_targets
from src.relationship_analysis import analyze_relationships
from src.dataset_comparison import compare_datasets
from src.modeling_readiness import evaluate_readiness
from src.export_outputs import export_markdown_reports

def main():
    logger = setup_logger("logs/eda.log")
    logger.info("=== INICIANDO PIPELINE DE EDA ===")
    
    registry_path = "../normalization/config/file_registry.json"
    tables_dir = "tables"
    figures_dir = "figures"
    reports_dir = "reports"
    
    Path(tables_dir).mkdir(exist_ok=True)
    Path(figures_dir).mkdir(exist_ok=True)
    Path(reports_dir).mkdir(exist_ok=True)
    
    try:
        datasets = load_all_datasets(registry_path, logger)
        overview = compute_overview(datasets, logger)
        missing = analyze_missing_values(datasets, tables_dir, logger)
        numeric = analyze_numeric_variables(datasets, tables_dir, figures_dir, logger)
        cat = analyze_categorical_variables(datasets, tables_dir, logger)
        targets = identify_targets(datasets, logger)
        analyze_relationships(datasets, targets, figures_dir, logger)
        comparison = compare_datasets(datasets, logger)
        readiness = evaluate_readiness(overview, targets, logger)
        
        export_markdown_reports(overview, missing, targets, readiness, comparison, reports_dir, logger)
        
        logger.info("=== PIPELINE COMPLETADO EXITOSAMENTE ===")
    except Exception as e:
        logger.error(f"FALLO CRÍTICO EN PIPELINE EDA: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()
