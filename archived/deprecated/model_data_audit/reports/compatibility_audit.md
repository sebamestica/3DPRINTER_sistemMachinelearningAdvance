# Auditoría de Compatibilidad Experimental

Evaluación dataset por dataset de si es experimentalmente compatible con un modelo de regresión cuyo target es `compressive_strength`.


## ✅ Compatible

### Compressivedata.csv

- **Tipo de ensayo**: `compressive`
- **Filas**: ~169686 | **Columnas**: 12
- **Timeseries alta frecuencia**: False
- **Nulls**: 24.93%
- Compressive test dataset with tabular structure.


## ⚠️ Compatible con Cautela


## ❌ Incompatible

### FDM_Dataset.csv

- **Tipo de ensayo**: `process_parameters`
- **Filas**: ~50 | **Columnas**: 20
- **Timeseries alta frecuencia**: False
- **Nulls**: 0.0%
- No valid compressive target in process parameter dataset.

### TensiondataB.csv

- **Tipo de ensayo**: `tension`
- **Filas**: ~5514 | **Columnas**: 10
- **Timeseries alta frecuencia**: True
- **Nulls**: 0.0%
- Tension time-series: measures tension, not compression. Including as compressive_strength would confuse ensayo type.

### Propiedades_Extraidas.csv

- **Tipo de ensayo**: `tension_or_both`
- **Filas**: ~100 | **Columnas**: 10
- **Timeseries alta frecuencia**: False
- **Nulls**: 69.3%
- Propiedades_Extraidas: 69.3% null values. Compressivedata entries (majority of rows) have ALL property columns empty — properties were never extracted from the compressive data. Only TensiondataA entries have numeric values, and those are tensile properties.

### TensiondataA.csv

- **Tipo de ensayo**: `tension`
- **Filas**: ~26228 | **Columnas**: 19
- **Timeseries alta frecuencia**: True
- **Nulls**: 47.37%
- Tension time-series: measures tension, not compression. Including as compressive_strength would confuse ensayo type.

### data.csv

- **Tipo de ensayo**: `tension_summary`
- **Filas**: ~50 | **Columnas**: 12
- **Timeseries alta frecuencia**: False
- **Nulls**: 0.0%
- No valid compressive target in process parameter dataset.
