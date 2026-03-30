# Auditoría de Descubrimiento de Datasets

Esta fase inventaría todos los datasets limpios disponibles en disco.

|Dataset|Filas (aprox)|Columnas|Tipo de Ensayo|Value Score|Reliability|Tabular|
|---|---|---|---|---|---|---|
|FDM_Dataset.csv|50|20|process_parameters|high_value|high_reliability|True|
|Compressivedata.csv|169686|12|compressive|medium_value|medium_reliability|True|
|TensiondataB.csv|5514|10|tension|medium_value|high_reliability|True|
|Propiedades_Extraidas.csv|100|10|tension_or_both|high_value|low_reliability|True|
|TensiondataA.csv|26228|19|tension|medium_value|low_reliability|True|
|data.csv|50|12|tension_summary|high_value|high_reliability|True|


## Columnas por Dataset


### FDM_Dataset.csv

`layer_height_mm`, `infill_density_%`, `infill_pattern`, `bed_temperature_c`, `print_speed_mm_s`, `material`, `fan_speed_m_s`, `nozzle_diameter_mm`, `build_volume_cm3`, `filament_type`, `filament_diameter_mm`, `melting_temperature_c`, `retraction_distance_mm`, `retraction_speed_mm_s`, `flow_rate_%`, `acceleration_mm_s2`, `linear_advance`, `loading_rate_n_s`, `microstructure`, `material_type`

### Compressivedata.csv

`raw_data`, `unnamed:_1`, `unnamed:_2`, `unnamed:_3`, `unnamed:_4`, `unnamed:_5`, `unnamed:_6`, `unnamed:_7`, `unnamed:_8`, `probeta`, `raw_data.1`, `raw_data.2`

### TensiondataB.csv

`unnamed:_0`, `axial_force`, `axial_displacement`, `time`, `axial_displacement_error`, `axial_634.12f`, `strain_[mm/mm]`, `stress[mpa]`, `strainext[mm/mm]`, `probeta`

### Propiedades_Extraidas.csv

`file`, `sheet`, `max_force`, `maxstrain`, `modulo_young`, `maxstrainext`, `length`, `thickness`, `width`, `transverse_area`

### TensiondataA.csv

`unnamed:_0`, `axial_force`, `axial_displacement`, `time`, `axial_displacement_error`, `axial_634.12f`, `strain_[mm/mm]`, `stress[mpa]`, `strainext[mm/mm]`, `probeta`, `raw_data`, `unnamed:_1`, `unnamed:_2`, `unnamed:_3`, `unnamed:_4`, `unnamed:_5`, `unnamed:_6`, `unnamed:_7`, `unnamed:_8`

### data.csv

`layer_height`, `wall_thickness`, `infill_density`, `infill_pattern`, `nozzle_temperature`, `bed_temperature`, `print_speed`, `material`, `fan_speed`, `roughness`, `tension_strenght`, `elongation`


## Observaciones clave

- **FDM_Dataset.csv**: 0.0% nulls | timeseries=False | compatibilidad=incompatible
- **Compressivedata.csv**: 24.93% nulls | timeseries=False | compatibilidad=compatible
- **TensiondataB.csv**: 0.0% nulls | timeseries=True | compatibilidad=incompatible
- **Propiedades_Extraidas.csv**: 69.3% nulls | timeseries=False | compatibilidad=incompatible
- **TensiondataA.csv**: 47.37% nulls | timeseries=True | compatibilidad=incompatible
- **data.csv**: 0.0% nulls | timeseries=False | compatibilidad=incompatible