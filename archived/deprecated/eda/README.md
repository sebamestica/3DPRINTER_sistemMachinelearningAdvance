# Modulo Exploratory Data Analysis (EDA)

Este modulo opera unicamente leyendo desde la data alojada en `normalization/cleaned/`. 
Se encarga de identificar la estructura relacional de los datos, descartar datasets y calcular la viabilidad del pipeline para machine learning sobre los resultados experimentales de impresion 3D estructural.

## Estructura
- `run_eda.py`: Archivo core que orquesta el modulo de eda
- `figures/`: Histogramas, matrices de correlación (heatmap)
- `tables/`: CSV's de metadata
- `reports/`: Documentos en formato markdown

## Uso
Ejecutar desde terminal estando en la carpeta eda:
```bash
python run_eda.py
```
