from sklearn.model_selection import GridSearchCV
from sklearn.pipeline import Pipeline
from sklearn.linear_model import Ridge, Lasso, ElasticNet
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor

def tune_models(train, target, preprocessor, grid_config, cv_folds, logger):
    logger.info("Sintonizando hiperparametros de candidatos top...")
    
    X_train = train.drop(columns=[target])
    y_train = train[target]
    
    real_cv = min(cv_folds, X_train.shape[0] // 3)
    if real_cv < 2: real_cv = 2
    
    base_estimators = {
        "Ridge": Ridge(random_state=42),
        "Lasso": Lasso(random_state=42),
        "ElasticNet": ElasticNet(random_state=42),
        "RandomForestRegressor": RandomForestRegressor(random_state=42),
        "GradientBoostingRegressor": GradientBoostingRegressor(random_state=42)
    }
    
    best_tuned = {}
    
    for model_name, param_grid in grid_config.items():
        if model_name not in base_estimators: continue
        
        pipe = Pipeline(steps=[('preprocessor', preprocessor), ('model', base_estimators[model_name])])
        
        try:
            search = GridSearchCV(pipe, param_grid, cv=real_cv, scoring='r2', n_jobs=1)
            search.fit(X_train, y_train)
            best_tuned[model_name] = search.best_estimator_
            logger.info(f"Tuning {model_name} completado. Mejor R2 CV = {search.best_score_:.3f}")
        except Exception as e:
            logger.warning(f"Error tuneando {model_name}: {str(e)}")
            
    return best_tuned
