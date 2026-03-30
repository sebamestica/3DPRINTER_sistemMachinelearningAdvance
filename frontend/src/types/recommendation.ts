export type RecommendationLevel = 'optimal' | 'favorable' | 'moderate' | 'risky' | 'not-recommended';

export interface DecisionWarning {
  severity: 'low' | 'medium' | 'high';
  message: string;
  parameterImpact?: string;
}

export interface RecommendationResult {
  level: RecommendationLevel;
  primaryRecommendation: string;
  technicalReasons: string[];
  warnings: DecisionWarning[];
  nextSteps: string[];
  prototypeRecommendation: boolean;
}
