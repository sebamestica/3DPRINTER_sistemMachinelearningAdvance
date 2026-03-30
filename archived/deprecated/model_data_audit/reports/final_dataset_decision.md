# Decisión Final — Dataset de Modelado para `compressive_strength`

> [!CAUTION]
> **MODELADO BLOQUEADO**: The only mechanically correct compressive dataset (Compressivedata) lacks process parameter features. Modeling only on structure_type is technically valid but produces an impoverished model. The critical missing step is linking specimen IDs to their print parameters. This audit recommends building that linkage before training.


## Dataset recomendado: `candidate_A_compressive_only`

- **Filas**: 35
- **Target**: compressive_strength (max stress per specimen)
- **Origen del target**: Aggregated from Compressivedata.csv per-specimen readings
- **Tarea de modelado**: Descriptive regression: structure_type → compressive_strength

### Advertencias del dataset recomendado

- ⚠️ No process parameters (infill, layer height, etc.) — only structural type is available as feature.
- ⚠️ Without process parameter linkage this dataset cannot explain manufacturing decisions.
- ⚠️ Specimen IDs not linked to FDM_Dataset or data.csv — external join needed.

## Datasets rechazados

### candidate_B_data_only
- Target column is tensile resistance, not compressive strength
- Viability explicitly marked INVALID


## Limitaciones abiertas

- Specimen IDs in Compressivedata (G29A, H44B, etc.) are not yet linked to print parameters.
- Without process parameters (infill, layer height) the model has no manufacturing levers.
- Compressivedata.csv has multi-row CSV headers that broke the pipeline's target detection.
- n_specimens depends on how many unique probeta values have valid stress readings.

## Siguiente paso correcto

Link Compressivedata specimen IDs to process parameters (FDM_Dataset or data.csv). Without this linkage the only available feature is structure_type, which limits predictive value. Once linked, this becomes a valid regression dataset.


## Tabla comparativa de candidatos

|Dataset candidato|Filas|Features|Target correcto|Viabilidad|
|---|---|---|---|---|
|candidate_A_compressive_only|35|1|CORRECT|LOW|
|candidate_B_data_only|50|11|INCORRECT|INVALID|