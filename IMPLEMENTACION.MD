# Plan de Implementación Expreso: Cubo Estructural 3D - Decision Studio & Advanced Lab

Este documento detalla la hoja de ruta para la refactorización y elevación del frontend del proyecto de resistencia de materiales impresos en 3D. El objetivo es transformar una visualización conceptual en una herramienta técnica de toma de decisiones e inspección estructural.

---

## 1. Visión y Objetivos

### 1.1 El Cambio de Paradigma
Pasamos de mostrar "patrones abstractos" a representar un **Cubo Estructural de 5x5x5 cm** completo. 
- **Fidelidad**: El usuario debe sentir que manipula un prototipo digital real.
- **Utilidad**: El software debe responder "¿Qué diseño es mejor para mi objetivo?" y "¿Cómo está construido internamente?".

### 1.2 Módulos Principales
1.  **Decision Studio (Modo Presentación)**: Enfocado en la comparación de alto nivel, selección de materiales/geometrías y lectura de resultados del backend.
2.  **Advanced Lab (Modo Laboratorio)**: Enfocado en la inspección geométrica profunda, análisis de capas (slicing), métricas de conectividad y visualización de nodos.

---

## 2. Arquitectura Técnica

### 2.1 Stack Tecnológico
- **Core**: React 19 + Vite + TypeScript.
- **3D Engine**: React Three Fiber (R3F) + Drei + Three.js.
- **Styling**: Tailwind CSS v4 para una interfaz técnica y sobria.
- **Animación**: Framer Motion para transiciones de UI no intrusivas.
- **Routing**: React Router Dom para la separación de módulos.

### 2.2 Estructura de Archivos (Nueva/Refactorizada)
```text
src/
  pages/                # Rutas principales: HomePage.tsx, AdvancedLabPage.tsx
  app/                  # Configuración global, rutas, layouts
  sections/             # Secciones de alto nivel (Hero, Workbench, Lab)
  components/
    controls/           # Paneles de parámetros (Standard y Advanced)
    visualization/      # Escenas 3D, Assembly, Shell, Factory
    comparison/         # Grillas y tarjetas de comparación 3D
    ui/                 # Componentes atómicos (Botones, Inputs técnicos)
  hooks/                # Lógica de estado dedicada (CubeAnalysis, AdvancedGeometry)
  lib/                  # Motores: scoring, recommendation, geometryBuilders, metrics
  types/                # Definiciones estrictas para visualización y modelos
  data/                 # Parámetros por defecto y datos de geometrías
```

---

## 3. Implementación del Modelo 3D (Cubo 5x5x5)

El "Cubo" ya no es una sola malla, sino un **Ensamblaje (Assembly)**:

### 3.1 OuterShell (Carcasa)
- Representa el volumen externo de 5x5x5 cm.
- **Modos**: Sólido, Translúcido, Seccionado (clipping), Explotado.
- Control de transparencia dinámico.

### 3.2 InternalStructure (Estructura Interna)
- Generada por `GeometryMeshFactory`.
- Contenida dentro de los límites internos (considerando `internalPadding`).
- Implementación de patrones: Gyroid, Honeycomb, Rectilinear, Lattice, Octet, Diamond, Cubic.

### 3.3 Entorno y Carga
- **Placas de Compresión**: Representación de la prensa neumática.
- **Vectores de Carga**: Flechas que indican la dirección de la fuerza vertical.
- **Deformación**: Aplicación sutil de escala/offset para simular compresión visual.

---

## 4. Advanced Lab (El Corazón Técnico)

### 4.1 Herramientas de Inspección
- **Slice View**: Slider vertical para recorrer el cubo capa por capa (clipping plane dinámico).
- **Wireframe & Nodes**: Visualización de la topología interna y puntos de conexión.
- **Heat Overlay**: Representación conceptual de zonas de intensidad geométrica.

### 4.2 Métricas Geométricas
Cálculo en tiempo real de:
- Volumen ocupado vs. Vacío.
- Complejidad geométrica (densidad de polígonos estimada).
- Direccionalidad de la estructura respecto al eje Z (Carga).
- Continuidad estructural (evaluación de rutas de carga).

---

## 5. Integración con Backend e IA

### 5.1 Enlace de Predicción
El sistema está diseñado para enviar los `InputParameters` a un endpoint de inferencia (modelo ML) y recibir:
- **Resistencia Estimada (MPa)**.
- **Deformación Relativa (mm)**.
- **Score de Confianza**.

### 5.2 Motor de Recomendación
Un engine en el frontend (`recommendationEngine.ts`) procesa el diseño actual y los resultados para generar una recomendación técnica textual, defendible académicamente.

---

## 6. Fases de Trabajo (Roadmap)

### Fase 1: Cimientos y Tipado (Inmediato)
- Instalación de dependencias (Router).
- Definición de tipos en `src/types/`.
- Creación de la estructura de carpetas.

### Fase 2: Escena 3D Refactorizada
- Implementación de `CubeAssemblyScene`.
- Creación de `OuterShell` con modos de visualización.
- Lógica de `InternalStructure` dentro del cubo.

### Fase 3: Advanced Lab y Slicing
- Desarrollo del modo seccionado y por capas.
- Implementación del slider de inspección.
- Panel de parámetros avanzados.

### Fase 4: Comparación y Decisiones
- Refactorización de `ComparisonSection` para mostrar cubos completos.
- Integración del scoring y recomendaciones refinadas.

### Fase 5: Pulido y Preparación Backend
- Optimización de rendimiento.
- Documentación técnica final.
- Mock de conexión con backend real.

---

> [!IMPORTANT]
> Este plan prioriza la **utilidad técnica** sobre la estética superficial. Cada decisión de diseño debe facilitar la comprensión de cómo el diseño del cubo afecta su resistencia final.
