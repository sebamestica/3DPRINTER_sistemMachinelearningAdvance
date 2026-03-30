import pandas as pd
from pathlib import Path

def load_data(config, logger):
    logger.info("Cargando splits del dataset modelable...")
    data_dir = Path(config["model_pipeline_data_dir"])
    
    try:
        train = pd.read_csv(data_dir / "train/train.csv")
        val = pd.read_csv(data_dir / "validation/validation.csv")
        test = pd.read_csv(data_dir / "test/test.csv")
        full = pd.read_csv(data_dir / "processed/final_features.csv")
    except Exception as e:
        logger.error(f"Error cargando los datos. Verifica ejecucion de model_pipeline. {e}")
        raise e
        
    logger.info(f"Cargados: Train({train.shape[0]}), Val({val.shape[0]}), Test({test.shape[0]})")
    return full, train, val, test
