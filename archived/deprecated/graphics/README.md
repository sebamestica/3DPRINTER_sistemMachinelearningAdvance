# graphics/

Capa exclusiva de visualización técnica para el proyecto PLA_3dPrinter_RESISTENCE.

## Estructura

```
graphics/
├── output/              ← todos los gráficos generados (.png)
│   ├── process/         ← parámetros de impresión (FDM)
│   ├── mechanical/      ← propiedades mecánicas (Propiedades_Extraidas + data)
│   ├── timeseries/      ← curvas tensión/compresión por probeta
│   └── summary/         ← resúmenes y comparativas cruzadas
├── src/
│   ├── plot_process_params.py    ← gráficos de parámetros FDM
│   ├── plot_mechanical_props.py  ← gráficos de propiedades mecánicas
│   ├── plot_timeseries.py        ← curvas F-d y tensión-deformación por probeta
│   └── plot_summary.py           ← gráficos de resumen cruzado
└── run_graphics.py               ← runner principal
```

## Uso

```bash
# Desde la raíz del proyecto
python graphics/run_graphics.py
```

## Fuentes de datos

- `Normalization/cleaned/FDM_Dataset_cleaned.csv`
- `Normalization/cleaned/data_cleaned.csv`
- `Normalization/cleaned/Propiedades_Extraidas_cleaned.csv`
- `Normalization/cleaned/TensiondataA_cleaned.csv`
- `Normalization/cleaned/TensiondataB_cleaned.csv`
- `Normalization/cleaned/Compressivedata_cleaned.csv`

## Reglas

- Solo lectura desde `Normalization/cleaned/` y `eda/tables/`.
- Solo escritura dentro de `graphics/output/`.
- No modifica ningún otro módulo del proyecto.
