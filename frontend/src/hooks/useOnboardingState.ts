import { useState } from 'react';
import type { ObjectiveType } from '../lib/baselineGenerator';

export type OnboardingStatus = 'initial' | 'objective_selected' | 'baseline_loaded' | 'analyzed' | 'compared' | 'candidate_selected';

export function useOnboardingState() {
  const [status, setStatus] = useState<OnboardingStatus>('initial');
  const [objective, setObjective] = useState<ObjectiveType | null>(null);

  const selectObjective = (newObjective: ObjectiveType) => {
    setObjective(newObjective);
    setStatus('objective_selected');
  };

  const setBaselineLoaded = () => setStatus('baseline_loaded');
  const setAnalyzed = () => setStatus('analyzed');
  const setCompared = () => setStatus('compared');
  const setCandidateSelected = () => setStatus('candidate_selected');
  const resetToInitial = () => {
    setObjective(null);
    setStatus('initial');
  };

  return {
    status,
    objective,
    selectObjective,
    setBaselineLoaded,
    setAnalyzed,
    setCompared,
    setCandidateSelected,
    resetToInitial
  };
}
