import pandas as pd

def compute_overview(datasets, logger):
    logger.info("Computando overview de los datasets...")
    overview = {}
    for name, data in datasets.items():
        df = data['df']
        info = data['info']
        num_cols = df.select_dtypes(include=['number']).columns.tolist()
        cat_cols = df.select_dtypes(exclude=['number']).columns.tolist()
        missing_total = df.isnull().sum().sum()
        total_cells = df.shape[0] * df.shape[1]
        overview[name] = {
            "rows": df.shape[0],
            "cols": df.shape[1],
            "num_cols": len(num_cols),
            "cat_cols": len(cat_cols),
            "missing_pct": round((missing_total / total_cells * 100), 2) if total_cells > 0 else 0,
            "reliability": info.get('reliability_score', 'unknown'),
            "value": info.get('value_score', 'unknown')
        }
    return overview
