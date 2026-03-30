import pandas as pd
from pathlib import Path
from src.utils import read_json

def load_all_datasets(registry_path, logger):
    registry = read_json(registry_path)
    datasets = {}
    for key, info in registry.items():
        if info.get('status') == 'cleaned' and info.get('cleaned_path'):
            path = Path(registry_path).parent.parent / info['cleaned_path']
            if path.exists():
                try:
                    df = pd.read_csv(path)
                    datasets[info['name']] = {
                        "df": df,
                        "info": info
                    }
                    logger.info(f"Cargado: {info['name']} con {df.shape[0]} filas.")
                except Exception as e:
                    logger.error(f"Error cargando {info['name']}: {str(e)}")
    return datasets
