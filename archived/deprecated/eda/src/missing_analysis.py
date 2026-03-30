import pandas as pd
from pathlib import Path

def analyze_missing_values(datasets, tables_dir, logger):
    logger.info("Analizando nulos...")
    missing_reports = {}
    for name, data in datasets.items():
        df = data['df']
        if df.shape[0] == 0:
            continue
        missing_count = df.isnull().sum()
        missing_pct = (missing_count / df.shape[0]) * 100
        missing_df = pd.DataFrame({'Missing': missing_count, 'Pct': missing_pct})
        missing_df = missing_df[missing_df['Missing'] > 0].sort_values(by='Pct', ascending=False)
        missing_reports[name] = missing_df
        if not missing_df.empty:
            out_file = Path(tables_dir) / f"{Path(name).stem}_missing.csv"
            missing_df.to_csv(out_file)
    return missing_reports
