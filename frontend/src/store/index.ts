/**
 * CENTRAL STORE EXPORT
 * All Zustand stores for the application
 */

// Domain stores
export { useProductStore, selectDimensions, selectMaterial, selectArchitecture, selectGeometryParams, selectManufacturingParams } from './product';
export { useWorkflowStore, selectCurrentStage, selectStageStatus, selectCanProgress } from './workflow';
export { useSimulationStore, selectPrediction, selectWarnings, selectIsRunning, selectHasResults } from './simulation';
export { useRenderStore, selectPreset, selectConfig, selectFPS, selectIsMobile, startPerformanceMonitor } from './render';
export { useUIStore, selectPanels, selectModal, selectIsMobile as selectUIMobile } from './ui';

// Re-export types
export type { ProductState, ProductActions, Dimensions, MaterialType, ArchitectureType, ViewMode, OrientationType } from '../domain/product/types';
export type { WorkflowState, WorkflowActions, Stage, StageStatus, StageValidation } from '../domain/workflow/types';
export type { SimulationState, SimulationActions, PredictionResult, SimulationWarning, TestType } from '../domain/simulation/types';
export type { RenderState, RenderActions, RenderPreset, DeviceClass, RenderConfig, PerformanceMetrics } from '../domain/render/types';
export type { UIState, UIActions, ModalType, ToastMessage } from './ui';