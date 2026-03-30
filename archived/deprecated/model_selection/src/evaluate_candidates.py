from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import pandas as pd

def evaluate_models_test(models_dict, test, target, logger):
    logger.info("Evaluando y comparando todos los pipelines en el Set de Test...")
    
    X_test = test.drop(columns=[target])
    y_test = test[target]
    
    results = []
    for name, model in models_dict.items():
        try:
            preds = model.predict(X_test)
            mae = mean_absolute_error(y_test, preds)
            rmse = mean_squared_error(y_test, preds) ** 0.5
            r2 = r2_score(y_test, preds)
            
            relative_error = (abs(y_test - preds) / (abs(y_test) + 1e-9)).mean() * 100
            
            results.append({
                "Model": name,
                "Test_MAE": mae,
                "Test_RMSE": rmse,
                "Test_R2": r2,
                "Test_MAPE": relative_error
            })
        except Exception as e:
            logger.error(f"Falla en Test de {name}: {str(e)}")
            
    df_eval = pd.DataFrame(results).sort_values(by="Test_R2", ascending=False)
    return df_eval
