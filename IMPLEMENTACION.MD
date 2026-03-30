# Plan de Implementación: Cubo Estructural 3D - Asistente de Decisión Técnica

Este documento detalla la hoja de ruta para la refactorización y elevación del frontend del proyecto de resistencia de materiales impresos en 3D. El objetivo es transformar una visualización conceptual en una herramienta técnica de toma de decisiones e inspección estructural.

---

## 1. Visión y Objetivos

### 1.1 El Cambio de Paradigma: De Visor a Asistente de Decisión
Pasamos de mostrar "patrones abstractos" a representar un **Cubo Estructural de 5x5x5 cm** y, lo más importante, a **traducir esos datos en decisiones de ingeniería**.
- **Fidelidad**: El usuario manipula un prototipo digital real.
- **Utilidad**: El software responde "¿Qué diseño es mejor?", "¿Por qué?", y "¿Qué debo fabricar?".
- **Transparencia**: Distinción clara entre predicción de ML, interpretación geométrica y reglas heurísticas.

### 1.2 Módulos Principales
1.  **Decision Studio (Modo Presentación)**: Centro de mando para diseño, diagnóstico inmediato y selección de candidatos.
2.  **Advanced Lab (Modo Laboratorio)**: Análisis profundo de topología, capas (slicing) y métricas de red.
3.  **Candidate Manager**: Sistema para guardar, comparar y exportar configuraciones prometedoras.

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

## 5. Inteligencia de Decisión y Producto Técnico

### 5.1 Asistente de Decisión (Core)
Un nuevo módulo que traduce parámetros y métricas en:
- **Diagnóstico Preliminar**: Estado del diseño (Fuerte, Prometedor, Débil).
- **Fortalezas y Riesgos**: Análisis heurístico de la arquitectura seleccionada.
- **Siguiente Acción**: Sugerencias experimentales (ej. "Comparar con Gyroid").

### 5.2 Ayuda Contextual
Implementación de micro-explicaciones para evitar "configuración a ciegas":
- ¿Qué es el padding? ¿Cómo influye el shell? ¿Por qué importa el modo de análisis?

### 5.3 Resumen Exportable
Generación de un informe técnico con la configuración seleccionada, justificación técnica y próximos pasos, ideal para documentación académica.

---

## 6. Fases de Trabajo (Roadmap Actualizado)

### Fase 1: Cimientos de Decisión (Inmediato)
- Definición de tipos en `src/types/decision.ts`.
- Implementación de `decisionRules.ts` y el hook `useCandidateManager`.

### Fase 2: Escena 3D y UI de Apoyo
- Integración de ayudas contextuales en los sliders.
- Creación de la `DecisionAssistantCard`.

### Fase 3: Gestión de Candidatos
- Sistema de guardado y comparación dinámica de configuraciones.
- Sección de comparación de candidatos en la Home.

### Fase 4: Advanced Lab y Slicing (Refinamiento Técnico)
- Herramientas de inspección por capas.
- Métricas de conectividad y volumen real ocupado.

### Fase 5: Cierre de Sesión y Exportación
- Generación del `SessionSummary`.
- Botón de exportación JSON/Texto.

---

> [!IMPORTANT]
> Este plan prioriza la **utilidad técnica** sobre la estética superficial. Cada decisión de diseño debe facilitar la comprensión de cómo el diseño del cubo afecta su resistencia final.
