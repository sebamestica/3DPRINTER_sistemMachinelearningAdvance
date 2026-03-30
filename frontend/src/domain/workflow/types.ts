/**
 * WORKFLOW DOMAIN TYPES
 * Stage management and transitions with guards
 */

export type Stage = 'setup' | 'design' | 'slicing' | 'simulate' | 'compare' | 'deploy';
export type StageStatus = 'locked' | 'ready' | 'warning' | 'complete' | 'error';

export interface StageInfo {
  id: Stage;
  label: string;
  description: string;
  requiredFields: string[];
  optionalFields: string[];
}

export interface StageValidation {
  isValid: boolean;
  blockers: string[];
  warnings: string[];
}

export interface WorkflowState {
  // Current stage
  currentStage: Stage;
  previousStage: Stage | null;
  
  // Status per stage
  statusByStage: Record<Stage, StageStatus>;
  
  // Validation results
  validationByStage: Record<Stage, StageValidation>;
  
  // Navigation history
  visitedStages: Stage[];
  
  // Stage data completeness
  completenessByStage: Record<Stage, number>; // 0-100
  
  // Error tracking
  globalErrors: string[];
  
  // Timestamps
  stageEnteredAt: number;
  lastTransitionAt: number;
}

export interface WorkflowActions {
  // Navigation
  goToStage: (stage: Stage) => boolean;
  goToNextStage: () => boolean;
  goToPreviousStage: () => boolean;
  
  // Validation
  validateCurrentStage: () => StageValidation;
  validateStage: (stage: Stage) => StageValidation;
  
  // Status updates
  setStageStatus: (stage: Stage, status: StageStatus) => void;
  setStageCompleteness: (stage: Stage, completeness: number) => void;
  
  // Error handling
  addError: (error: string) => void;
  clearErrors: () => void;
  
  // Reset
  resetWorkflow: () => void;
}

export const STAGE_INFO: Record<Stage, StageInfo> = {
  setup: {
    id: 'setup',
    label: 'Setup',
    description: 'Configuración inicial del proyecto',
    requiredFields: ['dimensions', 'material', 'architecture'],
    optionalFields: ['printSpeed', 'printTemp']
  },
  design: {
    id: 'design',
    label: 'Design',
    description: 'Diseño geométrico de la estructura',
    requiredFields: ['cellSize', 'strutThickness', 'infillDensity'],
    optionalFields: ['orientation', 'viewMode']
  },
  slicing: {
    id: 'slicing',
    label: 'Slicing',
    description: 'Preparación para fabricación',
    requiredFields: ['layerHeight', 'nozzleSize'],
    optionalFields: ['printSpeed']
  },
  simulate: {
    id: 'simulate',
    label: 'Simulate',
    description: 'Análisis mecánico predictivo',
    requiredFields: ['validGeometry'],
    optionalFields: []
  },
  compare: {
    id: 'compare',
    label: 'Compare',
    description: 'Comparación de variantes',
    requiredFields: ['validSimulation'],
    optionalFields: ['multipleVariants']
  },
  deploy: {
    id: 'deploy',
    label: 'Deploy',
    description: 'Exportación y fabricación',
    requiredFields: ['selectedVariant'],
    optionalFields: []
  }
};

export const STAGE_ORDER: Stage[] = ['setup', 'design', 'slicing', 'simulate', 'compare', 'deploy'];

export const DEFAULT_WORKFLOW: WorkflowState = {
  currentStage: 'setup',
  previousStage: null,
  statusByStage: {
    setup: 'ready',
    design: 'locked',
    slicing: 'locked',
    simulate: 'locked',
    compare: 'locked',
    deploy: 'locked'
  },
  validationByStage: {
    setup: { isValid: false, blockers: [], warnings: [] },
    design: { isValid: false, blockers: ['Setup incomplete'], warnings: [] },
    slicing: { isValid: false, blockers: ['Design incomplete'], warnings: [] },
    simulate: { isValid: false, blockers: ['Slicing incomplete'], warnings: [] },
    compare: { isValid: false, blockers: ['Simulation incomplete'], warnings: [] },
    deploy: { isValid: false, blockers: ['No variant selected'], warnings: [] }
  },
  visitedStages: ['setup'],
  completenessByStage: {
    setup: 0,
    design: 0,
    slicing: 0,
    simulate: 0,
    compare: 0,
    deploy: 0
  },
  globalErrors: [],
  stageEnteredAt: Date.now(),
  lastTransitionAt: Date.now()
};