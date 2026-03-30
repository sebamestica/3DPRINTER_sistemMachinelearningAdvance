import { useState, useMemo, useCallback } from 'react';
import type { InputParameters } from '../types/model';
import type { AdvancedGeometryConfig } from '../types/advanced';
import { defaultParameters } from '../data/defaultParameters';
import { computeGeometricMetrics } from '../lib/geometricMetrics';
import { analyzeConfiguration } from '../lib/scoring';

export const initialAdvancedConfig: AdvancedGeometryConfig = {
  shellThickness: 0.16,
  internalPadding: 0.2,
  cellSize: 1.0,
  strutThickness: 0.15,
  orientationX: 0,
  orientationY: 0,
  orientationZ: 0,
  transparency: 0.8,
  densityScale: 1.0,
  showWireframe: true,
  showNodes: false,
  showEdges: true,
  showHeatOverlay: false,
};

export function useAdvancedAnalysis() {
  const [parameters, setParameters] = useState<InputParameters>(defaultParameters);
  const [advancedConfig, setAdvancedConfig] = useState<AdvancedGeometryConfig>(initialAdvancedConfig);

  const metrics = useMemo(() => {
    return computeGeometricMetrics(parameters.geometry, advancedConfig);
  }, [parameters.geometry, advancedConfig]);

  const results = useMemo(() => {
    return analyzeConfiguration(parameters);
  }, [parameters]);

  const updateAdvanced = useCallback((updates: Partial<AdvancedGeometryConfig>) => {
    setAdvancedConfig(prev => ({ ...prev, ...updates }));
  }, []);

  const updateBase = useCallback((updates: Partial<InputParameters>) => {
    setParameters(prev => ({ ...prev, ...updates }));
  }, []);

  return {
    parameters,
    advancedConfig,
    metrics,
    results,
    updateAdvanced,
    updateBase
  };
}
