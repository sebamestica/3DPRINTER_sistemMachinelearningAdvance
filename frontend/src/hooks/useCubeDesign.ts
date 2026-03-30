import { useState } from 'react';
import type { CubeParameters, PreviewConfig } from '../types/design';

/**
 * Technical Design Engine Hook.
 * Manages Cube Parameters, Preview Modes, and Simulation States.
 */

export const useCubeDesign = () => {
  const [parameters, setParameters] = useState<CubeParameters>({
    geometry: 'gyroid',
    infill: 40,
    shellThickness: 1.2,
    padding: 0.2,
    cellSize: 1.5,
    strutThickness: 0.12,
    orientation: 0,
    material: 'PLA',
    temperature: 205,
    mode: 'compression',
    loadForce: 500
  });

  const [preview, setPreview] = useState<PreviewConfig>({
    renderMode: 'translucent',
    showShell: true,
    sectionView: false,
    currentLayer: 50,
    totalLayers: 100
  });

  const updateParameters = (p: Partial<CubeParameters>) => setParameters(prev => ({ ...prev, ...p }));
  const updatePreview = (p: Partial<PreviewConfig>) => setPreview(prev => ({ ...prev, ...p }));

  return { parameters, preview, updateParameters, updatePreview };
};
