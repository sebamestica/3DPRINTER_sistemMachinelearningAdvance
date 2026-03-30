import type { GeometryType } from './geometry';
import type { VisualMode } from './visualization';

export type AnalysisMode = 'strength' | 'absorption' | 'balance';
export type MaterialType = 'PLA' | 'ABS' | 'PETG' | 'TPU';

export interface InputParameters {
  material: MaterialType;
  geometry: GeometryType;
  infill: number;
  layerHeight: number;
  speed: number;
  temperature: number;
  compressionLevel: number;
  shellThickness: number;
  internalPadding: number;
  transparency: number;
  visualMode: VisualMode;
  analysisMode: AnalysisMode;
}

export interface ModelResult {
  compressiveStrength: number;
  relativeDeformation: number;
  concentrationIndex: number;
  distributionIndex: number;
  energyAbsorptionIndex: number;
  confidence: number;
  interpretation: string;
}

export interface ComparisonResult {
  cubeA: {
    params: InputParameters;
    results: ModelResult;
  };
  cubeB: {
    params: InputParameters;
    results: ModelResult;
  };
  recommendation: string;
}
