def evaluate_readiness(overview, targets, logger):
    logger.info("Evaluando preparacion para modelado...")
    readiness = {}
    
    for name, info in overview.items():
        target_list = targets.get(name, [])
        
        if info['rows'] < 100:
            status = 'not_recommended'
            reason = 'Muy pocas filas para un modelo estadisticamente significativo.'
        elif info['missing_pct'] > 30 and len(target_list) == 0:
            status = 'useful_as_reference_only'
            reason = 'Demasiados valores nulos y sin targets claros.'
        elif len(target_list) == 0:
            status = 'useful_for_eda_only'
            reason = 'Sin variable objetivo clara identificada.'
        elif info['num_cols'] < 3:
            status = 'not_recommended'
            reason = 'Muy pocas features numericas.'
        else:
            status = 'ready_for_basic_modeling'
            reason = 'Suficientes filas, features numericas y targets identificados.'
            
        readiness[name] = {"status": status, "reason": reason}
        
    return readiness
