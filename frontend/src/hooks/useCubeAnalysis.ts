import { useState, useMemo } from 'react';
import type { InputParameters, ModelResult } from '../types/model';
import type { RecommendationResult } from '../types/recommendation';
import { analyzeConfiguration } from '../lib/scoring';
import { getRecommendation, buildInterpretation } from '../lib/recommendationEngine';
import { defaultParameters } from '../data/defaultParameters';

export const useCubeAnalysis = () => {
  const [parameters, setParameters] = useState<InputParameters>(defaultParameters);
  const [isUpdating, setIsUpdating] = useState(false);

  // Analysis result using useMemo to calculate on the fly (heuristic/backend-ready)
  const results = useMemo<ModelResult>(() => {
    const rawResults = analyzeConfiguration(parameters);
    const resultsWithoutInterpretation: Omit<ModelResult, 'interpretation'> = rawResults;
    return {
      ...rawResults,
      interpretation: buildInterpretation(parameters, resultsWithoutInterpretation as any)
    };
  }, [parameters]);

  // Recommendation using results
  const recommendation = useMemo<RecommendationResult>(() => 
    getRecommendation(parameters, results), 
    [parameters, results]
  );

  const updateParameters = (newParams: Partial<InputParameters>) => {
    setIsUpdating(true);
    // Simulate complex processing or loading state for backend integration
    const timer = setTimeout(() => {
      setParameters(prev => ({ ...prev, ...newParams }));
      setIsUpdating(false);
    }, 400);
    return () => clearTimeout(timer);
  };

  return {
    parameters,
    setParameters,
    updateParameters,
    results,
    recommendation,
    isUpdating
  };
};
