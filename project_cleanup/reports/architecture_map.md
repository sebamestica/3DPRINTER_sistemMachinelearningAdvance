# Arquitectura del Proyecto: Visualización de Compresión 3D

Este documento describe la estructura y el flujo de datos del proyecto tras la fase de saneamiento arquitectónico.

## 🏗️ Estructura del Directorio

El proyecto se divide en módulos funcionales y buckets de almacenamiento para facilitar la trazabilidad y el mantenimiento.

### 1. `pipelines/` (Núcleo de Procesamiento)
Contiene la lógica secuencial desde la ingesta de datos hasta la toma de decisiones.
- `normalization/`: Escalamiento y limpieza de variables de entrada.
- `specimen_linkage/`: Unión de datos de impresión con resultados mecánicos de alta confianza.
- `model_pipeline/`: Entrenamiento, evaluación y exportación de modelos de regresión.
- `decision_ready/`: Consolidación final, validación de estabilidad y matriz de decisión.

### 2. `visuals/` (Capa Gráfica Técnica)
Módulos dedicados a la generación de estática diagnóstica y visualización de resultados.
- `compression_graphics/`: Generación de mapas de calor y distribuciones mecánicas.

### 3. `frontend/` (Interfaz de Usuario)
Dashboard interactivo para la visualización del cubo 3D y parámetros del modelo.

### 4. `data/` (Almacenamiento de Datos)
- `raw/`: Datos originales sin procesar.
- `processed/`: Datos intermedios de las distintas fases.
- `final/`: Datasets validados y listos para el modelado.

### 5. `archived/` (Memoria Histórica)
Contiene exploraciones previas, reportes obsoletos y módulos de investigación (EDA, Audit) que ya cumplieron su función en el flujo principal.

## 🔄 Flujo del Proyecto

1. **Ingesta:** Datos en `data/raw`.
2. **Linkage:** `pipelines/specimen_linkage` vincula los datos y limpia el ruido.
3. **Modelado:** `pipelines/model_pipeline` entrena el modelo ganador (GBR).
4. **Validación:** `pipelines/decision_ready` emite el veredicto técnico.
5. **Visualización:** El `frontend/` y `visuals/` consumen los artefactos finales para su exhibición.

---
*Este mapa sirve de guía para cualquier nuevo integrante del equipo para entender el ciclo de vida del dato en el proyecto.*
