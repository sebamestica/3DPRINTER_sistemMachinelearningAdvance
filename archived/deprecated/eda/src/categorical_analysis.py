import pandas as pd
from pathlib import Path

def analyze_categorical_variables(datasets, tables_dir, logger):
    logger.info("Analizando categóricas...")
    cat_reports = {}
    for name, data in datasets.items():
        df = data['df']
        cat_cols = df.select_dtypes(exclude=['number']).columns.tolist()
        if not cat_cols:
            continue
        
        summary = []
        for col in cat_cols:
            unique_count = df[col].nunique()
            top_val = df[col].mode()[0] if not df[col].mode().empty else None
            summary.append({"Column": col, "Unique_Count": unique_count, "Top_Value": top_val})
        
        summ_df = pd.DataFrame(summary)
        out_file = Path(tables_dir) / f"{Path(name).stem}_categorical.csv"
        summ_df.to_csv(out_file, index=False)
        cat_reports[name] = summ_df
    return cat_reports
