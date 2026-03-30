import sys
import os
from pathlib import Path
os.chdir(Path(__file__).parent)
sys.path.append(str(Path(__file__).parent))

from src.utils import setup_logger, load_json, write_md
from src.load_model_data import load_data
from src.validate_current_dataset import validate_dataset
from src.run_model_comparison import run_baseline_comparison
from src.tune_candidates import tune_models
from src.evaluate_candidates import evaluate_models_test
from src.select_best_model import pick_best
from src.export_results import export_all

def main():
    logger = setup_logger("logs/selection.log")
    config = load_json("config/selection_config.json")
    grid_config = load_json("config/model_grid.json")
    
    target = config.get("target", "compressive_strength")
    cv_folds = config.get("cv_folds", 5)
    
    try:
        full, train, val, test = load_data(config, logger)
        status_label = validate_dataset(full, target, "reports", logger)
        
        cv_scores_baselines, untuned_pipes, preproc, num_c, cat_c = run_baseline_comparison(train, target, cv_folds, logger)
        
        tuned_pipes = tune_models(train, target, preproc, grid_config, cv_folds, logger)
        
        all_models = {**untuned_pipes, **tuned_pipes}
        df_eval = evaluate_models_test(all_models, test, target, logger)
        
        best = pick_best(df_eval, status_label, logger)
        export_all(best, all_models, df_eval, test, target, logger)
        
        # Stability Check write
        stab = f"# Estabilidad de {best}\n\n"
        base_match = cv_scores_baselines[cv_scores_baselines["Model"] == best]
        if not base_match.empty:
            stab += f"R2 CV: {base_match.iloc[0]['R2_Mean_CV']:.3f} (Std +/- {base_match.iloc[0]['R2_Std_CV']:.3f})\n"
            
        test_r2 = df_eval[df_eval["Model"] == best].iloc[0]["Test_R2"]
        stab += f"R2 Test Set: {test_r2:.3f}\n\n"
        
        if test_r2 < 0.3:
            stab += "**Diagnostico**: MUY INESTABLE. El modelo colapsa o no captura senal contra los datos nuevos. "
        else:
            stab += "**Diagnostico**: Aceptable dados los datos."
            
        write_md("reports/stability_check.md", stab)
        logger.info("=== SELECCION DE MODELO COMPLETADA EXITOSAMENTE ===")
    except Exception as e:
        logger.error(f"Fallo critico seleccion: {str(e)}")
        sys.exit(1)

if __name__ == '__main__':
    main()
