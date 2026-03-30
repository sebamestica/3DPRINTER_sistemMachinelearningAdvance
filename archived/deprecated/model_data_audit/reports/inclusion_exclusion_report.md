# Reporte de Inclusión/Exclusión — Diagnóstico de la Pipeline Previa

Este reporte diagnostica con exactitud por qué la pipeline anterior solo procesó `data.csv` (50 filas) a pesar de haber descubierto 6 datasets válidos.

## Resumen del problema

La pipeline previa aplicó una cadena de filtros incorrectamente calibrados que descartó datasets válidos o los incluyó con un target equivocado. Los 5 puntos de fallo se detallan por dataset a continuación.

|Dataset|Stage|Resultado|Razón principal|
|---|---|---|---|
|FDM_Dataset.csv|select_model_data|EXCLUDED|No column matching canonical target or synonyms found in first 100 rows of CSV|
|Compressivedata.csv|select_model_data|EXCLUDED|No column matching canonical target or synonyms found in first 100 rows of CSV|
|TensiondataB.csv|select_model_data|EXCLUDED|validate_experimental_compatibility: name contains 'Tension' → excluded as tension test|
|Propiedades_Extraidas.csv|select_model_data|EXCLUDED|reliability_score=low_reliability triggered exclusion rule|
|TensiondataA.csv|select_model_data|EXCLUDED|reliability_score=low_reliability triggered exclusion rule|
|data.csv|validate_experimental_compatibility|PASSED_WITH_CAUTION|N/A — pasó todos los filtros|


## Diagnóstico por dataset


### FDM_Dataset.csv

- **Outcome final**: `EXCLUDED`
- **Scores en registry**: value=high_value | reliability=high_reliability
- **Target encontrado en primeras 100 filas**: []
- **Problema de encabezado CSV multi-fila**: False
  - No column matching canonical target or synonyms found in first 100 rows of CSV
  - No column matching canonical target or synonyms found in first 100 rows of CSV

### Compressivedata.csv

- **Outcome final**: `EXCLUDED`
- **Scores en registry**: value=medium_value | reliability=medium_reliability
- **Target encontrado en primeras 100 filas**: []
- **Problema de encabezado CSV multi-fila**: True
  - No column matching canonical target or synonyms found in first 100 rows of CSV
  - No column matching canonical target or synonyms found in first 100 rows of CSV

### TensiondataB.csv

- **Outcome final**: `EXCLUDED`
- **Scores en registry**: value=medium_value | reliability=high_reliability
- **Target encontrado en primeras 100 filas**: ['stress[mpa]']
- **Problema de encabezado CSV multi-fila**: False
  - validate_experimental_compatibility: name contains 'Tension' → excluded as tension test

### Propiedades_Extraidas.csv

- **Outcome final**: `EXCLUDED`
- **Scores en registry**: value=high_value | reliability=low_reliability
- **Target encontrado en primeras 100 filas**: ['max_force']
- **Problema de encabezado CSV multi-fila**: True
  - reliability_score=low_reliability triggered exclusion rule
  - reliability_score=low_reliability triggered exclusion rule

### TensiondataA.csv

- **Outcome final**: `EXCLUDED`
- **Scores en registry**: value=medium_value | reliability=low_reliability
- **Target encontrado en primeras 100 filas**: ['stress[mpa]']
- **Problema de encabezado CSV multi-fila**: False
  - reliability_score=low_reliability triggered exclusion rule
  - reliability_score=low_reliability triggered exclusion rule

### data.csv

- **Outcome final**: `PASSED_WITH_CAUTION`
- **Scores en registry**: value=high_value | reliability=high_reliability
- **Target encontrado en primeras 100 filas**: ['tension_strenght']
- **Problema de encabezado CSV multi-fila**: False
  - validate_experimental_compatibility: generic tabular dataset → included with caution


## Causa raíz identificada


Los 5 fallos encadenados de la pipeline previa:

1. **`Propiedades_Extraidas.csv`**: Excluida en `select_model_data.py` porque `reliability_score=low_reliability`. Regla ciega: no evalúa si el dataset tiene el único compressive data válido disponible.

2. **`TensiondataA.csv`**: Excluida por `reliability_score=low_reliability`. Esta evaluación fue asignada manualmente en el registry sin justificación sólida para excluirla de todas las fases.

3. **`Compressivedata.csv`**: Tiene `reliability_score=medium_reliability` (pasa stage 1), pero su CSV tiene un encabezado de 2 filas. Las primeras 100 filas que lee `select_model_data` contienen los sub-headers como datos, no las columnas reales. En consecuencia, el nombre de columnas como `stress[mpa]` no aparece en las primeras 100 filas → el target no es detectado → el dataset es **excluido antes de llegar a validate_compatibility**.

4. **`FDM_Dataset.csv`**: Tiene parámetros de proceso pero ninguna columna de resistencia mecánica. Excluido correctamente, ya que no tiene target directo ni sinónimo.

5. **`TensiondataB.csv`**: Tiene `reliability_score=high_reliability` y pasa stage 1 (detecta columnas de tensión). Pero en `validate_experimental_compatibility`, la condición `"Tension" in name` la **excluye directamente** por nombre, sin verificar si tiene datos de compresión embebidos. Exclusión por string matching, no por análisis real del contenido.

**Consecuencia**: Solo `data.csv` pasó todos los filtros — no porque sea el mejor dataset para el target, sino porque es el único que no activa ninguna regla de exclusión ciega y tiene la palabra `strenght` en sus columnas (mapeada como sinónimo de `compressive_strength`). El resultado es 50 filas de datos de **tracción** mislabeled como `compressive_strength`.
