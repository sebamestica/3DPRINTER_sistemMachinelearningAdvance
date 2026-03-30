from sklearn.linear_model import LinearRegression, Ridge, Lasso, ElasticNet
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.dummy import DummyRegressor
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.model_selection import cross_val_score
import pandas as pd
import numpy as np

def build_preprocessing(num_cols, cat_cols):
    numeric_transformer = StandardScaler()
    categorical_transformer = OneHotEncoder(handle_unknown='ignore')
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numeric_transformer, num_cols),
            ('cat', categorical_transformer, cat_cols)
        ])
    return preprocessor

def run_baseline_comparison(train, target, cv_folds, logger):
    logger.info("Corriendo evaluacion base (Baselines)...")
    
    X_train = train.drop(columns=[target])
    y_train = train[target]
    
    num_cols = X_train.select_dtypes(include='number').columns.tolist()
    cat_cols = X_train.select_dtypes(exclude='number').columns.tolist()
    
    models = {
        "DummyRegressor": DummyRegressor(strategy="mean"),
        "LinearRegression": LinearRegression(),
        "Ridge": Ridge(random_state=42),
        "Lasso": Lasso(random_state=42),
        "ElasticNet": ElasticNet(random_state=42),
        "RandomForestRegressor": RandomForestRegressor(random_state=42),
        "GradientBoostingRegressor": GradientBoostingRegressor(random_state=42)
    }
    
    preprocessor = build_preprocessing(num_cols, cat_cols)
    cv_scores = []
    
    # We use cv_folds unless there are extremely few lines
    real_cv = min(cv_folds, X_train.shape[0] // 3)
    if real_cv < 2:
        real_cv = 2
        
    logger.info(f"Usando Cross-Validation con {real_cv} splits")
    
    untuned_pipelines = {}
    
    for name, clf in models.items():
        pipe = Pipeline(steps=[('preprocessor', preprocessor), ('model', clf)])
        try:
            scores = cross_val_score(pipe, X_train, y_train, cv=real_cv, scoring='r2')
            pipe.fit(X_train, y_train)
            untuned_pipelines[name] = pipe
            cv_scores.append({
                "Model": name,
                "R2_Mean_CV": scores.mean(),
                "R2_Std_CV": scores.std()
            })
        except Exception as e:
            logger.warning(f"Error evaluando baseline {name}: {str(e)}")
            
    df_cv = pd.DataFrame(cv_scores).sort_values(by="R2_Mean_CV", ascending=False)
    return df_cv, untuned_pipelines, preprocessor, num_cols, cat_cols
