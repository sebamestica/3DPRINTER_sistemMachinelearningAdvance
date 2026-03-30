import type { InputParameters } from '../types/model';

export const defaultParameters: InputParameters = {
  material: 'PLA',
  geometry: 'gyroid',
  infill: 35,
  layerHeight: 0.2,
  speed: 50,
  temperature: 205,
  compressionLevel: 55,
  shellThickness: 0.18,
  internalPadding: 0.2,
  transparency: 0.35,
  visualMode: 'transparent',
  analysisMode: 'balance',
};
