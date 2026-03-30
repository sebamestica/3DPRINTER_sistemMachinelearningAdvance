def compare_datasets(datasets, logger):
    logger.info("Comparando schemas...")
    comparison = []
    
    for n1, d1 in datasets.items():
        for n2, d2 in datasets.items():
            if n1 >= n2:
                continue
            cols1 = set(d1['df'].columns)
            cols2 = set(d2['df'].columns)
            overlap = cols1.intersection(cols2)
            
            jaccard = len(overlap) / len(cols1.union(cols2)) if len(cols1.union(cols2)) > 0 else 0
            
            if jaccard > 0.5:
                comparison.append(f"{n1} y {n2} comparten {len(overlap)} columnas (Similitud: {jaccard:.2f})")
                
    return comparison
