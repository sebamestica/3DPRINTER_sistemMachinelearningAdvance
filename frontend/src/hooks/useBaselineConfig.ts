import { useCallback } from 'react';
import type { ObjectiveType } from '../lib/baselineGenerator';
import { getBaselineForObjective } from '../lib/baselineGenerator';
import type { InputParameters } from '../types/model';
import type { AdvancedGeometryConfig } from '../types/advanced';

export function useBaselineConfig(
  updateBase: (updates: Partial<InputParameters>) => void,
  updateAdvanced: (updates: Partial<AdvancedGeometryConfig>) => void
) {
  const loadBaseline = useCallback((objective: ObjectiveType) => {
    const baseline = getBaselineForObjective(objective);
    
    // Update base parameters
    updateBase({
      geometry: baseline.geometry,
      material: baseline.material,
      infill: baseline.infill,
    });

    // Update advanced parameters
    updateAdvanced({
      cellSize: baseline.cellSize,
      strutThickness: baseline.strutThickness,
      shellThickness: baseline.shell,
      internalPadding: baseline.padding
    });
    
    return baseline;
  }, [updateBase, updateAdvanced]);

  return { loadBaseline };
}
