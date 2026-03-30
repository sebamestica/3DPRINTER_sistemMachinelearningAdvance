export type GeometryType = 'solid' | 'gyroid' | 'honeycomb' | 'rectilinear' | 'cubic' | 'diamond' | 'lattice' | 'octet';
export type MaterialType = 'PLA' | 'ABS' | 'PETG' | 'TPU';
export type StructuralMode = 'compression' | 'tensile' | 'flexion';

export interface CubeParameters {
  geometry: GeometryType;
  infill: number; // 10-100%
  shellThickness: number; // mm
  padding: number; // internal offset
  cellSize: number; // scale
  strutThickness: number; // structural members
  orientation: number; // degrees
  material: MaterialType;
  temperature: number;
  mode: StructuralMode;
  loadForce: number; // New: Simulated work force in N or MPa Target
}

export interface PreviewConfig {
  renderMode: 'solid' | 'translucent' | 'wireframe' | 'internal-only';
  showShell: boolean;
  sectionView: boolean;
  currentLayer: number;
  totalLayers: number;
}

export type AppStatus = 'initial' | 'configured' | 'previewed' | 'analyzed' | 'compared' | 'selected';
