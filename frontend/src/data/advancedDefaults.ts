import type { AdvancedGeometryConfig, SliceConfig } from '../types/advanced';

export const defaultAdvancedGeometryConfig: AdvancedGeometryConfig = {
  shellThickness: 0.18,
  internalPadding: 0.2,
  cellSize: 0.65,
  strutThickness: 0.08,
  orientationX: 0,
  orientationY: 0,
  orientationZ: 0,
  transparency: 0.3,
  densityScale: 1,
  showWireframe: false,
  showNodes: false,
  showEdges: true,
  showHeatOverlay: true,
};

export const defaultSliceConfig: SliceConfig = {
  enabled: false,
  axis: 'y',
  depth: 0.5,
};
