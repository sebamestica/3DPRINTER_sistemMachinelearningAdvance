# Engineering Frontend: 3D Cube Compression Visualization

Este proyecto es una interfaz web profesional diseñada para visualizar el comportamiento mecánico de un cubo impreso en 3D sometido a compresión. Utiliza un stack moderno de ingeniería visual para ofrecer una experiencia interactiva, técnica y honesta.

## 🚀 Cómo Correr el Proyecto

1. **Navegar a la carpeta:**
   ```powershell
   cd frontend
   ```
2. **Instalar dependencias:**
   ```powershell
   npm install
   ```
3. **Iniciar el servidor de desarrollo:**
   ```powershell
   npm run dev
   ```

## 🏗️ Estructura del Proyecto

Sigue una arquitectura modular y escalable sugerida para proyectos de ingeniería:

- `src/types/model.ts`: Definición rigurosa de los tipos de datos (Materiales, Parámetros, Resultados).
- `src/data/mockCubeData.ts`: Centralización de datos iniciales y rejilla de visualización (Grid 5x5x5).
- `src/hooks/useCubeVisualization.ts`: Lógica de estado y puente para futura integración con API.
- `src/components/visualization/`: Escena 3D (`Three.js` via `React Three Fiber`).
- `src/sections/`: Secciones de la Single Page Application (Hero, Parámetros, Resultados, Metodología).
- `src/lib/colorScale.ts`: Lógica de mapeo cromático para intensidad de carga.

## 🔬 Capacidad de Visualización 3D

El cubo principal utiliza **Instanced Meshing** para optimizar el rendimiento. Cada voxel representa un punto de datos en la rejilla de 125 puntos (5x5x5).
- **Deformación Vertical:** Se escala dinámicamente en el eje Y basado en el `compressionLevel`.
- **Mapeo Cromático:** Los colores cambian según la `intensity` calculada, simulando zonas de mayor compromiso estructural.

## 🔌 Integración con el Backend

El proyecto está preparado para conectarse a un modelo de predicción real. El punto de conexión principal es el hook:

`src/hooks/useCubeVisualization.ts`

### Pasos para Conectar:
1. Reemplazar la lógica de `useMemo` en el hook por una llamada `fetch` o `axios` dentro de un `useEffect` o mediante `React Query`.
2. El endpoint debería recibir un objeto `InputParameters` y devolver un `ModelResult`.
3. Actualizar la rejilla `visualizationData` con los valores de intensidad reales devueltos por el servidor.

---
**Nota sobre Honestidad Técnica:** El frontend incluye disclaimer explícitos indicando que se trata de una **interpretación visual** basada en predicción, manteniendo la seriedad académica del proyecto.
