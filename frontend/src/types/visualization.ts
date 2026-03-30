export type VisualMode =
  | 'solid'
  | 'transparent'
  | 'section'
  | 'exploded'
  | 'internal-only';

export interface CubeDimensions {
  width: number;
  height: number;
  depth: number;
  unit: 'cm';
}

export interface ShellConfig {
  thickness: number;
  transparency: number;
  showEdges: boolean;
}

export interface StructureRenderConfig {
  internalPadding: number;
  densityScale: number;
  showHeatOverlay: boolean;
}
