export interface AdvancedGeometryConfig {
  shellThickness: number;
  internalPadding: number;
  cellSize: number;
  strutThickness: number;
  orientationX: number;
  orientationY: number;
  orientationZ: number;
  transparency: number;
  densityScale: number;
  showWireframe: boolean;
  showNodes: boolean;
  showEdges: boolean;
  showHeatOverlay: boolean;
}

export interface SliceConfig {
  enabled: boolean;
  axis: 'x' | 'y' | 'z';
  depth: number;
}

export interface GeometricMetrics {
  occupiedVolumeRatio: number;
  voidRatio: number;
  estimatedMaterialUsage: number;
  nodeDensity: number;
  structuralContinuity: number;
  geometricComplexity: number;
  printDifficulty: number;
  directionalAlignment: number;
}

export interface ExportableCubeConfig {
  geometry: string;
  material: string;
  analysisMode: string;
  parameters: Record<string, number | string | boolean>;
  advanced: AdvancedGeometryConfig;
}
