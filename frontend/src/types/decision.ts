export type CandidateStatus =
  | 'strong'
  | 'promising'
  | 'validate'
  | 'weak'
  | 'not-priority';

export interface DecisionAssessment {
  status: CandidateStatus;
  headline: string;
  strengths: string[];
  warnings: string[];
  nextActions: string[];
  compareNext: string[];
  rationale: string;
}

export interface CandidateConfig {
  id: string;
  label: string;
  geometry: string;
  material: string;
  analysisMode: string;
  parameters: Record<string, number | string>;
  metrics: {
    strength: number;
    deformation: number;
    concentration?: number;
    distribution?: number;
    absorption?: number;
    score?: number;
  };
  assessment: DecisionAssessment;
}

export interface SessionSummary {
  selectedCandidateId: string | null;
  objective: string;
  comparedCandidates: string[];
  conclusion: string;
  risks: string[];
  nextStep: string;
}
