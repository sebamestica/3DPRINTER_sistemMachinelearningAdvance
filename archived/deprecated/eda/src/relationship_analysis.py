import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from pathlib import Path

def analyze_relationships(datasets, targets, figures_dir, logger):
    logger.info("Calculando correlaciones...")
    for name, data in datasets.items():
        df = data['df']
        num_cols = df.select_dtypes(include=['number']).columns.tolist()
        if len(num_cols) < 2:
            continue
            
        corr = df[num_cols].corr(method='spearman')
        plt.figure(figsize=(10, 8))
        sns.heatmap(corr, annot=False, cmap='coolwarm', vmin=-1, vmax=1)
        plt.title(f"Matriz de Correlación (Spearman) - {name}")
        plt.xticks(rotation=45, ha='right')
        plt.tight_layout()
        plt.savefig(Path(figures_dir) / f"{Path(name).stem}_corr.png")
        plt.close()
