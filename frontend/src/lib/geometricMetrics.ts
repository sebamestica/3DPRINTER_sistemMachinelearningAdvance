import type { AdvancedGeometryConfig, GeometricMetrics } from '../types/advanced';
import type { GeometryType } from '../types/geometry';

export function computeGeometricMetrics(
  geometry: GeometryType,
  config: AdvancedGeometryConfig
): GeometricMetrics {
  const geometryBase: Record<string, { continuity: number; complexity: number; voids: number; nodes: number; print: number; align: number; }> = {
    solid: { continuity: 0.95, complexity: 0.2, voids: 0.05, nodes: 0.1, print: 0.2, align: 0.9 },
    gyroid: { continuity: 0.88, complexity: 0.82, voids: 0.42, nodes: 0.65, print: 0.72, align: 0.76 },
    honeycomb: { continuity: 0.74, complexity: 0.58, voids: 0.48, nodes: 0.52, print: 0.48, align: 0.63 },
    rectilinear: { continuity: 0.7, complexity: 0.36, voids: 0.5, nodes: 0.4, print: 0.32, align: 0.78 },
    cubic: { continuity: 0.79, complexity: 0.52, voids: 0.46, nodes: 0.58, print: 0.45, align: 0.81 },
    diamond: { continuity: 0.83, complexity: 0.66, voids: 0.44, nodes: 0.62, print: 0.59, align: 0.73 },
    lattice: { continuity: 0.8, complexity: 0.72, voids: 0.47, nodes: 0.76, print: 0.68, align: 0.71 },
    octet: { continuity: 0.86, complexity: 0.78, voids: 0.45, nodes: 0.82, print: 0.74, align: 0.84 },
  };

  const baseValues = geometryBase[geometry] || { continuity: 0.5, complexity: 0.5, voids: 0.5, nodes: 0.5, print: 0.5, align: 0.5 };

  const occupiedVolumeRatio = Math.min(
    0.98,
    Math.max(0.08, 1 - baseValues.voids + (config.densityScale - 1) * 0.15)
  );

  const voidRatio = 1 - occupiedVolumeRatio;

  const estimatedMaterialUsage = occupiedVolumeRatio * (1 + config.shellThickness * 0.5);

  const nodeDensity = Math.min(1, baseValues.nodes + config.densityScale * 0.08);

  const structuralContinuity = Math.min(1, baseValues.continuity + config.strutThickness * 0.2);

  const geometricComplexity = Math.min(1, baseValues.complexity + config.cellSize * 0.05);

  const printDifficulty = Math.min(
    1,
    baseValues.print + config.strutThickness * 0.3 + (config.showNodes ? 0.05 : 0)
  );

  const directionalAlignment = baseValues.align;

  return {
    occupiedVolumeRatio,
    voidRatio,
    estimatedMaterialUsage,
    nodeDensity,
    structuralContinuity,
    geometricComplexity,
    printDifficulty,
    directionalAlignment,
  };
}
