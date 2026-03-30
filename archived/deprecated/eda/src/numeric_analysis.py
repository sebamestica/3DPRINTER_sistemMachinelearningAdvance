import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from pathlib import Path

def analyze_numeric_variables(datasets, tables_dir, figures_dir, logger):
    logger.info("Analizando numéricas y generando figuras clave...")
    numeric_reports = {}
    for name, data in datasets.items():
        df = data['df']
        num_cols = df.select_dtypes(include=['number']).columns.tolist()
        if not num_cols:
            continue
        stats = df[num_cols].describe().T
        out_table = Path(tables_dir) / f"{Path(name).stem}_numeric_stats.csv"
        stats.to_csv(out_table)
        numeric_reports[name] = stats
        
        target_candidates = [c for c in num_cols if any(word in c.lower() for word in ['max_force', 'strength', 'stress', 'strain', 'elongation', 'force', 'modulo_young', 'tension_strenght'])]
        
        for tgt in target_candidates:
            if df[tgt].nunique() > 1:
                plt.figure(figsize=(8, 5))
                sns.histplot(df[tgt].dropna(), kde=True)
                plt.title(f"Distribución de {tgt} - {name}")
                safe_tgt = tgt.replace('/', '_').replace('\\', '_')
                out_fig = Path(figures_dir) / f"{Path(name).stem}_{safe_tgt}_dist.png"
                plt.savefig(out_fig, bbox_inches='tight')
                plt.close()
                
    return numeric_reports
