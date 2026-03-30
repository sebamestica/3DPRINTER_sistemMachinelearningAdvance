import joblib
from src.utils import write_md
import pandas as pd

def export_all(best_model_name, models_dict, df_eval, test, target, logger):
    logger.info("Exportando artefactos del modelo ganador...")
    
    winner_pipe = models_dict[best_model_name]
    joblib.dump(winner_pipe, f"artifacts/best_model/{best_model_name}_final.pkl")
    
    df_eval.to_csv("artifacts/comparison_metrics/model_ranking.csv", index=False)
    
    X_test = test.drop(columns=[target])
    y_test = test[target]
    
    preds = winner_pipe.predict(X_test)
    df_pred = X_test.copy()
    df_pred["True_Target"] = y_test
    df_pred["Prediction"] = preds
    df_pred.to_csv("artifacts/predictions/best_model_test_predictions.csv", index=False)
    
    rep = "# Ranking de Modelos\n\n"
    rep += df_eval.to_markdown(index=False)
    
    write_md("reports/model_ranking.md", rep)
