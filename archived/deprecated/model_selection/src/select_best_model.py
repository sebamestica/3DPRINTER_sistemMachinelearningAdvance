from src.utils import write_md
import pandas as pd

def pick_best(df_eval, status_label, logger):
    logger.info("Verificando criterios y determinando ganador...")
    
    if df_eval.empty:
        logger.error("No hay modelos validos para elegir.")
        return None
        
    best_row = df_eval.iloc[0]
    best_name = best_row["Model"]
    best_r2 = best_row["Test_R2"]
    
    if df_eval.shape[0] > 1:
        second_row = df_eval.iloc[1]
        
        diff = best_r2 - second_row["Test_R2"]
        complex_models = ["RandomForestRegressor", "GradientBoostingRegressor", "XGBoost"]
        if best_name in complex_models and diff < 0.05 and second_row["Model"] not in complex_models:
            best_name = second_row["Model"]
            best_r2 = second_row["Test_R2"]
            logger.info(f"Se prefirio el modelo mas simple ({best_name}) porque el avance logico no es significativo.")
            
    logger.info(f"Ganador Determinado: {best_name} (R2={best_r2:.3f})")
    
    rep = "# Decision Final de Modelo\n\n"
    rep += f"## Ganador: **{best_name}**\n\n"
    rep += f"- **Etiqueta Oficial**: `{status_label}`\n"
    rep += f"- **Test R2**: {best_r2:.3f}\n\n"
    rep += "### Fundamento Tecnico\n"
    if status_label == "best_current_option":
        rep += "El modelo ha sido elegido simplemente por proveer el residuo mas bajo. No obstante, por las limitaciones muestrales ya notificadas, no debe generalizarse sin precaucion. Es un modelo representativo a nivel exploratorio.\n"
    else:
        rep += "El modelo paso los test exitosamente, ofreciendo generalizacion robusta frente a los datos invisibles.\n"
        
    write_md("reports/final_model_decision.md", rep)
    
    return best_name
