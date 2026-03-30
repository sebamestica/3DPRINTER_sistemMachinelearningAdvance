import type { InputParameters, ModelResult } from '../types/model';
import { GEOMETRIES } from '../data/geometries';

export const analyzeConfiguration = (params: InputParameters): Omit<ModelResult, 'interpretation'> => {
  const geo = GEOMETRIES.find(g => g.type === params.geometry) || GEOMETRIES[0];
  const profile = geo.profile;

  // Initial calculation based on physical variables
  // Resistance is proportional to infill and vertical strength ratio of the geometry
  let baseStrength = (params.infill / 8) * profile.verticalStrengthRatio;
  
  if (params.material === 'ABS') baseStrength *= 1.25;
  if (params.material === 'PETG') baseStrength *= 1.15;
  if (params.material === 'TPU') baseStrength *= 0.35; 

  // Impact of layer height and shell thickness on stability
  baseStrength *= (1 + params.shellThickness * 0.82);
  const tempCorrection = 1 - Math.abs(params.temperature - 215) / 200;
  baseStrength *= tempCorrection;

  // Distribution and Concentration Indices (Conceptual)
  // Distribution increases with isotropy and internal padding/density balance
  const distributionIndex = profile.isotropy * (params.infill / 90) * (1 - params.internalPadding * 0.2);
  
  // Concentration depends on how non-isotropic the pattern is under vertical load
  const concentrationIndex = (1 - profile.isotropy) * (params.compressionLevel / 85);

  // Energy Absorption
  // High for TPU or complex structures like Gyroid/Lattice
  const energyAbsorptionIndex = profile.energyAbsorption * (params.infill / 100) * (params.material === 'TPU' ? 2.4 : 1.15);

  // Relative Deformation (Conceptual - mm)
  // TPU deforms much more than PLA
  const deformationBase = (params.compressionLevel / 100) * (params.material === 'TPU' ? 18.5 : 2.4);
  const relativeDeformation = deformationBase * (1 - (params.infill / 115)) * (1 - params.shellThickness * 0.3);

  return {
    compressiveStrength: parseFloat(Math.max(0, baseStrength).toFixed(2)),
    relativeDeformation: parseFloat(Math.max(0, relativeDeformation).toFixed(2)),
    concentrationIndex: parseFloat(Math.max(0, Math.min(1, concentrationIndex)).toFixed(3)),
    distributionIndex: parseFloat(Math.max(0, Math.min(1, distributionIndex)).toFixed(3)),
    energyAbsorptionIndex: parseFloat(Math.max(0, Math.min(1, energyAbsorptionIndex)).toFixed(3)),
    confidence: 0.88
  };
};
