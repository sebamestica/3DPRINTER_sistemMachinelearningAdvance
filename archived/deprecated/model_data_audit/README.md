# model_data_audit/

## Propósito

Esta fase existe porque la pipeline de modelado anterior entrenó modelos sobre una base incorrecta:
**50 filas de datos de tracción** (`tension_strenght` de `data.csv`) renombradas automáticamente
a `compressive_strength`, cuando el proyecto busca modelar resistencia a la compresión de estructuras
celulares/lattice impresas en PLA.

El objetivo de esta carpeta es auditar, diagnosticar y resolver ese problema antes de continuar
con entrenamiento.

---

## Por qué era necesaria

La pipeline `model_pipeline/` aplicó una cadena de filtros que excluyó 5 de los 6 datasets
descubiertos y terminó usando el único que no levantaba ningún flag — `data.csv` — a pesar de
que sus 50 filas corresponden a ensayos de **tracción**, no de **compresión**.

Los fallos encadenados detectados:
1. `reliability_score=low_reliability` en el registry descartó `Propiedades_Extraidas` y `TensiondataA` sin analizar su contenido real.
2. `Compressivedata.csv` pasó el filtro de calidad pero tiene un **encabezado CSV de dos filas** — las primeras 100 filas que leía la pipeline contenían sub-headers no los datos reales, imposibilitando la detección del target.
3. `TensiondataA` y `TensiondataB` fueron excluidos por `"Tension" in name` — string matching ciego, no análisis de contenido.
4. `FDM_Dataset.csv` no tiene columna de resultado mecánico — exclusión correcta.
5. `data.csv` pasó todos los filtros porque tiene `tension_strenght` que matcheó como sinónimo de `compressive_strength`.

---

## Qué consume

| Fuente | Descripción |
|---|---|
| `Normalization/cleaned/` | Los 6 CSVs limpios: FDM_Dataset, Compressivedata, TensiondataA, TensiondataB, Propiedades_Extraidas, data |
| `Normalization/config/file_registry.json` | Registry con metadata de calidad y rutas |
| `model_pipeline/config/target_config.json` | Configuración de target de la pipeline previa (solo lectura) |

No modifica ninguno de estos archivos.

---

## Qué produce

### Reportes (`reports/`)

| Reporte | Contenido |
|---|---|
| `discovery_audit.md` | Inventario técnico: filas, columnas, tipo de ensayo, scores |
| `target_mapping_audit.md` | Veredicto por dataset: target directo / derivado / inexistente |
| `inclusion_exclusion_report.md` | Diagnóstico de por qué la pipeline anterior usó solo `data.csv` |
| `compatibility_audit.md` | Evaluación experimental: compatible / con cautela / incompatible |
| `final_dataset_decision.md` | Dataset recomendado, rechazados, limitaciones, siguiente paso |

### Artefactos (`artifacts/`)

| Artefacto | Descripción |
|---|---|
| `dataset_profiles/discovery_index.json` | Índice de descubrimiento con metadata completa |
| `dataset_profiles/full_profiles.json` | Perfiles detallados por dataset |
| `candidate_targets/target_mapping.json` | Veredictos de target por dataset |
| `candidate_targets/derivation_assessment.json` | Evaluación de derivación desde Compressivedata |
| `candidate_targets/candidate_summaries.json` | Resumen de datasets candidatos |
| `candidate_targets/candidate_A_compressive_only.csv` | Dataset A: Compressivedata agregado por probeta |
| `candidate_targets/candidate_B_data_only.csv` | Dataset B: data.csv (tensile — marcado como inválido para compresión) |
| `compatibility_tables/pipeline_trace.json` | Traza exacta de exclusiones de la pipeline previa |
| `compatibility_tables/compatibility_matrix.json` | Matriz de compatibilidad experimental |
| `compatibility_tables/candidate_comparison.json` | Comparación de candidatos con scoring |
| `row_origin_registry/row_registry.json` | Registro de origen de cada fila de los candidatos |

---

## Cómo ejecutar

```bash
python model_data_audit/run_model_data_audit.py
```

No requiere dependencias fuera de `pandas` y `numpy`.

---

## Cómo interpretar la decisión final

Leer `reports/final_dataset_decision.md`. En el estado actual:

- **Modelado bloqueado**: la auditoría detecta que ningún candidato tiene suficientes features
  para un modelo predictivo de compresión. El `Candidate A` es mecánicamente correcto pero
  solo tiene `structure_type` como feature — sin parámetros de proceso.
- **Acción requerida**: vincular los IDs de probeta de `Compressivedata.csv` (G29A, H44B, etc.)
  con sus parámetros de impresión en `FDM_Dataset.csv` o `data.csv`.
- **`Candidate B` (data.csv)** está marcado como **inválido** para modelar `compressive_strength`
  porque sus targets son tensiles. Es válido como predictor de resistencia a la tracción si se
  renombra correctamente.

---

## Condición de desbloqueo

El modelado serio se desbloquea cuando:
1. Se genera una tabla de correspondencia `specimen_id → print_parameters`.
2. Se une esa tabla con el `Candidate A` (Compressivedata agregado).
3. El dataset resultante tiene ≥ 20 filas y ≥ 4 features numéricas.
