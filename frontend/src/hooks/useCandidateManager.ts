import { useState, useCallback } from 'react';
import type { CandidateConfig } from '../types/decision';
import type { InputParameters, ModelResult } from '../types/model';
import { buildDecisionAssessment } from '../lib/decisionRules';

export function useCandidateManager() {
  const [candidates, setCandidates] = useState<CandidateConfig[]>([]);

  const saveCandidate = useCallback((params: InputParameters, results: ModelResult, label: string) => {
    const assessment = buildDecisionAssessment(params, results);
    
    const newCandidate: CandidateConfig = {
      id: Math.random().toString(36).substr(2, 9),
      label: label || `Candidato ${candidates.length + 1}`,
      geometry: params.geometry,
      material: params.material,
      analysisMode: params.analysisMode,
      parameters: { ...params },
      metrics: {
        strength: results.compressiveStrength,
        deformation: results.relativeDeformation,
        concentration: results.concentrationIndex,
        distribution: results.distributionIndex,
        absorption: results.energyAbsorptionIndex
      },
      assessment
    };

    setCandidates(prev => [...prev, newCandidate]);
    return newCandidate.id;
  }, [candidates]);

  const removeCandidate = useCallback((id: string) => {
    setCandidates(prev => prev.filter(c => c.id !== id));
  }, []);

  return {
    candidates,
    saveCandidate,
    removeCandidate
  };
}
