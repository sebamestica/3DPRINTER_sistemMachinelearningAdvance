def validate_dataset(full_df, target, reports_dir, logger):
    logger.info("Validando dataset antes de seleccion...")
    
    rows, cols = full_df.shape
    features = cols - 1
    
    warnings = []
    if target not in full_df.columns:
        warnings.append(f"CRITICO: Target '{target}' no se encuentra en el dataset final.")
        
    dataset_issue = False
    status_label = "validated_final_model"
    
    if rows < 100:
        dataset_issue = True
        status_label = "best_current_option"
        warnings.append("Dataset MUY PEQUENO (menos de 100 filas). La eleccion tiene alta probabilidad de inestabilidad o bajo poder de generalizacion.")
    if features < 3:
        dataset_issue = True
        warnings.append("Muy pocas features descriptivas (menos de 3). Riesgo de underfitting severo.")
        
    report = "# Resumen de Validacion del Dataset\n\n"
    report += f"- **Filas**: {rows}\n- **Features**: {features}\n- **Target**: `{target}`\n\n"
    
    if dataset_issue:
        report += "### ADVERTENCIAS DE CALIDAD\n"
        for w in warnings:
            report += f"- {w}\n"
        report += "\nDebido a las limitaciones comprobadas, el modelo resultante debe considerarse como un **prototipo** orientado a EDA o inferencia basica, y se etiquetara como `best_current_option` en vez de un modelo productivo.\n"
    else:
        report += "El dataset cuenta con solidez estadistica estructural basica. El modelo elegido puede ser candidato a evaluacion de produccion o simulacion mecanica avanzada.\n"
        
    from src.utils import write_md
    write_md(f"{reports_dir}/selection_summary.md", report)
    
    return status_label
