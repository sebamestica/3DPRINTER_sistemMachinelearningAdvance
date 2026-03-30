# Resistencia Estructural en Cubos 3D: Proyecto de Ingeniería & ML

Este proyecto desarrolla un sistema predictivo y de visualización para analizar la respuesta mecánica (resistencia a la compresión) de componentes fabricados mediante manufactura aditiva (impresión 3D).

## 🎯 Objetivo
Predecir con alta precisión la resistencia a compresión (MPa) basándose en parámetros de diseño (infill, material, temperatura, etc.) y visualizar el comportamiento estimado en una interfaz 3D profesional.

## 🏗️ Arquitectura del Proyecto

El sistema está organizado en un flujo de **pipelines** modulares y una capa de **visualización** integrada.

- **`pipelines/`**: Núcleo del procesamiento de datos.
  - `normalization/`: Limpieza y escalamiento de variables.
  - `specimen_linkage/`: Unión de datos de fabricación con resultados de ensayos mecánicos.
  - `model_pipeline/`: Entrenamiento de modelos GBR (Gradient Boosting Regressor) con alta fidelidad (R2 ~0.90+).
  - `decision_ready/`: Validación final y generación de reportes consolidados.
- **`visuals/`**: Análisis gráfico estático de las distribuciones y correlaciones mecánicas.
- **`frontend/`**: Dashboard interactivo con visualización 3D del cubo ante compresión (React + Three.js).
- **`data/`**: Datasets organizados por fase (raw, processed, final).
- **`archived/`**: Memoria histórica del proyecto (EDA, auditorías previas y experimentos).

## 🚀 Cómo Ejecutar

### 1. Requisitos
- Python 3.9+
- Node.js (para el frontend)

### 2. Ejecutar el Pipeline de Datos
Para validar el estado actual del modelo y generar reportes:
```powershell
cd pipelines/decision_ready
python src/validate_current_model.py
```

### 3. Ejecutar la Visualización 3D
```powershell
cd frontend
npm install
npm run dev -- --host
```

## 📊 Resultados Destacados
- **Modelo Ganador:** Gradient Boosting Regressor.
- **Precisión:** R2 ~0.90 en conjunto de prueba.
- **Dataset Validado:** 35 especímenes con vinculación de alta confianza manual y automática.

---
**Nota Técnica:** Todas las visualizaciones 3D en el frontend representan una **interpretación visual asistida por el modelo** y no deben tomarse como simulaciones físicas exactas.
