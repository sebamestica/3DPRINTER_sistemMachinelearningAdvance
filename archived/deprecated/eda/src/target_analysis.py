import pandas as pd

def identify_targets(datasets, logger):
    logger.info("Identificando variables objetivo...")
    targets = {}
    keywords = ['max_force', 'strength', 'stress', 'strain', 'elongation', 'force', 'modulo_young', 'yield', 'tension_strenght']
    for name, data in datasets.items():
        df = data['df']
        cols = df.columns
        found = []
        for col in cols:
            if any(k in col.lower() for k in keywords):
                if df[col].dtype in ['float64', 'int64'] and df[col].nunique() > 1:
                    found.append(col)
        targets[name] = found
    return targets
