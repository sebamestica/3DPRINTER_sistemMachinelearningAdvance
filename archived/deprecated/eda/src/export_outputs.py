from pathlib import Path

def export_markdown_reports(overview, missing, targets, readiness, comparison, reports_dir, logger):
    logger.info("Exportando reportes Markdown...")
    
    Path(reports_dir).mkdir(exist_ok=True)
    
    exec_path = Path(reports_dir) / "executive_summary.md"
    with open(exec_path, "w", encoding="utf-8") as f:
        f.write("# Resumen Ejecutivo de Análisis Exploratorio (EDA)\n\n")
        f.write("Se han analizado todos los datasets provenientes del pipeline de normalización.\n\n")
        f.write("## Hallazgos Principales\n")
        ready_count = sum(1 for v in readiness.values() if v['status'] == 'ready_for_basic_modeling')
        f.write(f"- Datasets listos para modelar: {ready_count}\n")
        f.write("- Las figuras de correlación se encuentran en `figures/` y las estadísticas descriptivas en `tables/`.\n\n")
        f.write("## Siguientes Pasos Recomendados\n")
        f.write("Utilizar los datasets clasificados como `ready_for_basic_modeling` para iteraciones iniciales con algoritmos de regresión (Random Forest, XGBoost) focalizados en la principal variable objetivo detectada por dataset.\n")

    qual_path = Path(reports_dir) / "dataset_quality_report.md"
    with open(qual_path, "w", encoding="utf-8") as f:
        f.write("# Reporte de Calidad por Dataset\n\n")
        for name, info in overview.items():
            f.write(f"## {name}\n")
            f.write(f"- Filas: {info['rows']}\n")
            f.write(f"- Columnas Numéricas: {info['num_cols']}\n")
            f.write(f"- Columnas Categóricas: {info['cat_cols']}\n")
            f.write(f"- Nulos Globales: {info['missing_pct']}%\n\n")

    var_path = Path(reports_dir) / "variable_inventory.md"
    with open(var_path, "w", encoding="utf-8") as f:
        f.write("# Inventario de Variables\n\n")
        for comp in comparison:
            f.write(f"- {comp}\n")
            
    tgt_path = Path(reports_dir) / "target_feasibility.md"
    with open(tgt_path, "w", encoding="utf-8") as f:
        f.write("# Viabilidad de Variables Objetivo\n\n")
        for name, t_list in targets.items():
            f.write(f"## {name}\n")
            if t_list:
                f.write("Variables detectadas:\n")
                for t in t_list:
                    f.write(f"- `{t}`\n")
            else:
                f.write("No se detectaron objetivos claros.\n")
            f.write("\n")

    ready_path = Path(reports_dir) / "modeling_readiness.md"
    with open(ready_path, "w", encoding="utf-8") as f:
        f.write("# Preparación para Modelado\n\n")
        for name, r in readiness.items():
            f.write(f"## {name}\n")
            f.write(f"- **Clasificación**: `{r['status']}`\n")
            f.write(f"- **Justificación**: {r['reason']}\n\n")
