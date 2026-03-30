/**
 * WORKFLOW STORE
 * Stage management with guards and transitions
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { WorkflowState, WorkflowActions, Stage, StageStatus, StageValidation } from '../../domain/workflow/types';
import { DEFAULT_WORKFLOW, STAGE_ORDER } from '../../domain/workflow/types';
import { useProductStore } from '../product';
import { useSimulationStore } from '../simulation';
import * as Validators from '../../domain/workflow/validators';

// Guard functions - determine if transition is allowed
const guards = {
  canEnterSetup: (): StageValidation => {
    const product = useProductStore.getState();
    return Validators.validateSetup(product);
  },

  canEnterDesign: (): StageValidation => {
    const product = useProductStore.getState();
    return Validators.validateDesign(product);
  },

  canEnterSlicing: (): StageValidation => {
    const product = useProductStore.getState();
    return Validators.validateSlicing(product);
  },

  canEnterSimulate: (): StageValidation => {
    const simulation = useSimulationStore.getState();
    return Validators.validateSimulate(simulation);
  },

  canEnterCompare: (): StageValidation => {
    const product = useProductStore.getState();
    return Validators.validateCompare(product);
  },

  canEnterDeploy: (): StageValidation => {
    const product = useProductStore.getState();
    return Validators.validateDeploy(product);
  }
};

const getGuard = (stage: Stage): (() => StageValidation) => {
  switch (stage) {
    case 'setup': return guards.canEnterSetup;
    case 'design': return guards.canEnterDesign;
    case 'slicing': return guards.canEnterSlicing;
    case 'simulate': return guards.canEnterSimulate;
    case 'compare': return guards.canEnterCompare;
    case 'deploy': return guards.canEnterDeploy;
  }
};

export const useWorkflowStore = create<WorkflowState & WorkflowActions>()(
  devtools(
    (set, get) => ({
      // Initial state
      ...DEFAULT_WORKFLOW,

      // Navigation
      goToStage: (stage: Stage): boolean => {
        const currentStage = get().currentStage;
        const targetIndex = STAGE_ORDER.indexOf(stage);
        const currentIndex = STAGE_ORDER.indexOf(currentStage);

        // Validate the target stage
        const validation = get().validateStage(stage);

        if (!validation.isValid && targetIndex > currentIndex) {
          // Can't jump forward to invalid stage
          set({
            validationByStage: {
              ...get().validationByStage,
              [stage]: validation
            }
          }, false, 'goToStage/blocked');
          return false;
        }

        // Update all intermediate stages
        const newStatusByStage = { ...get().statusByStage };
        STAGE_ORDER.forEach((s, idx) => {
          if (idx < targetIndex) {
            newStatusByStage[s] = 'complete';
          } else if (idx === targetIndex) {
            newStatusByStage[s] = validation.isValid ? 'ready' : 'warning';
          } else {
            newStatusByStage[s] = 'locked';
          }
        });

        set({
          previousStage: currentStage,
          currentStage: stage,
          statusByStage: newStatusByStage,
          visitedStages: [...new Set([...get().visitedStages, stage])],
          validationByStage: {
            ...get().validationByStage,
            [stage]: validation
          },
          stageEnteredAt: Date.now(),
          lastTransitionAt: Date.now()
        }, false, 'goToStage');

        return true;
      },

      goToNextStage: (): boolean => {
        const currentIndex = STAGE_ORDER.indexOf(get().currentStage);
        if (currentIndex < STAGE_ORDER.length - 1) {
          return get().goToStage(STAGE_ORDER[currentIndex + 1]);
        }
        return false;
      },

      goToPreviousStage: (): boolean => {
        const currentIndex = STAGE_ORDER.indexOf(get().currentStage);
        if (currentIndex > 0) {
          return get().goToStage(STAGE_ORDER[currentIndex - 1]);
        }
        return false;
      },

      // Validation
      validateCurrentStage: (): StageValidation => {
        return get().validateStage(get().currentStage);
      },

      validateStage: (stage: Stage): StageValidation => {
        const guard = getGuard(stage);
        return guard();
      },

      // Status updates
      setStageStatus: (stage: Stage, status: StageStatus) => set(
        (state) => ({
          statusByStage: { ...state.statusByStage, [stage]: status }
        }),
        false,
        'setStageStatus'
      ),

      setStageCompleteness: (stage: Stage, completeness: number) => set(
        (state) => ({
          completenessByStage: { ...state.completenessByStage, [stage]: Math.max(0, Math.min(100, completeness)) }
        }),
        false,
        'setStageCompleteness'
      ),

      // Error handling
      addError: (error: string) => set(
        (state) => ({
          globalErrors: [...state.globalErrors, error]
        }),
        false,
        'addError'
      ),

      clearErrors: () => set(
        { globalErrors: [] },
        false,
        'clearErrors'
      ),

      // Reset
      resetWorkflow: () => set(
        { ...DEFAULT_WORKFLOW },
        false,
        'resetWorkflow'
      )
    }),
    { name: 'WorkflowStore' }
  )
);

// Selectors
export const selectCurrentStage = (state: WorkflowState) => state.currentStage;
export const selectStageStatus = (stage: Stage) => (state: WorkflowState) => state.statusByStage[stage];
export const selectCanProgress = (state: WorkflowState) => {
  const currentIndex = STAGE_ORDER.indexOf(state.currentStage);
  return currentIndex < STAGE_ORDER.length - 1;
};