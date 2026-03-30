# Módulo de Selección de Modelos

Este repositorio aislado se encarga ÚNICAMENTE de comparar matemáticamente y afinar los modelos de `model_pipeline`.
En lugar de modificar los splits o limpiar variables, recibe el archivo curado por los Data Engineers en `model_pipeline/data/` y aplica Tuning de Hiperparámetros, métricas en Testing y revisión cruzada de robustez (Standard Cross-Validation).

## Ejecución
Desde esta carpeta (o invocándolo con Python desde la raíz general), ejecutar:
```bash
python run_model_selection.py
```

## Salidas Críticas
`reports/final_model_decision.md` -> Justificará si el "ganador" es un `validated_final_model` o un inseguro `best_current_option` (lo cual ocurre cuando faltan filas experimentales).
`artifacts/best_model` -> Dónde termina el pipeline en Scikit-Learn (PKL empacado listo para inferencia).
