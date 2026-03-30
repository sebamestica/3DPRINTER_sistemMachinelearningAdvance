/**
 * SIMULATION STORE
 * Model predictions and validation metrics
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { SimulationState, SimulationActions, SimulationWarning, TestType, PredictionResult } from '../../domain/simulation/types';
import { DEFAULT_SIMULATION, DEFAULT_MODEL_METRICS } from '../../domain/simulation/types';
import { useProductStore } from '../product';

// Generate unique IDs
const generateId = () => Math.random().toString(36).substring(2, 9);

// Mock simulation function - replace with actual model
const runPrediction = async (params: any): Promise<PredictionResult> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Mock prediction based on parameters
  const baseYield = 45; // MPa base
  const cellFactor = params.cellSize ? (10 - params.cellSize) / 10 : 0.5;
  const strutFactor = params.strutThickness ? params.strutThickness / 2 : 0.5;
  const infillFactor = params.infillDensity ? params.infillDensity / 100 : 0.5;

  const yieldEstimate = baseYield * (1 + cellFactor * 0.3) * (1 + strutFactor * 0.4) * (1 + infillFactor * 0.5);
  const confidence = 0.85 + Math.random() * 0.1;

  return {
    yieldEstimate: Math.round(yieldEstimate * 10) / 10,
    energyAbsorption: Math.round(yieldEstimate * 1.5 * 10) / 10,
    stiffness: Math.round(yieldEstimate * 50) / 10,
    maxLoad: Math.round(yieldEstimate * 25 * 25 * 10) / 10,
    confidenceBand: [
      Math.round((yieldEstimate * 0.9) * 10) / 10,
      Math.round((yieldEstimate * 1.1) * 10) / 10
    ],
    confidenceLevel: 95,
    domainFit: Math.round(70 + Math.random() * 25),
    mode: yieldEstimate > 60 ? 'extrapolated' : 'interpolated',
    modelVersion: 'mech_v0.4.2',
    modelDate: '2024-01-15'
  };
};

export const useSimulationStore = create<SimulationState & SimulationActions>()(
  devtools(
    (set, get) => ({
      // Initial state
      ...DEFAULT_SIMULATION,

      // Run simulation
      runSimulation: async () => {
        set({ status: 'running' }, false, 'runSimulation/start');

        try {
          const product = useProductStore.getState();
          const params = {
            dimensions: product.dimensions,
            material: product.material,
            architecture: product.architecture,
            cellSize: product.cellSize,
            strutThickness: product.strutThickness,
            infillDensity: product.infillDensity,
            layerHeight: product.layerHeight,
            nozzleSize: product.nozzleSize
          };

          const prediction = await runPrediction(params);

          // Generate warnings based on prediction
          const warnings: SimulationWarning[] = [];
          if (prediction.mode === 'extrapolated') {
            warnings.push({
              id: generateId(),
              type: 'extrapolation',
              message: 'Prediction is outside training domain. Results may be less reliable.',
              severity: 'medium',
              dismissible: true
            });
          }
          if (prediction.domainFit < 80) {
            warnings.push({
              id: generateId(),
              type: 'out_of_domain',
              message: `Domain fit is ${prediction.domainFit}%. Consider parameters closer to validated range.`,
              severity: 'high',
              dismissible: true
            });
          }

          set({
            status: 'complete',
            prediction,
            warnings,
            lastRunAt: Date.now(),
            runHistory: [
              ...get().runHistory,
              {
                id: generateId(),
                timestamp: Date.now(),
                input: get().input,
                prediction
              }
            ].slice(-10) // Keep last 10 runs
          }, false, 'runSimulation/complete');

        } catch (error) {
          set({
            status: 'error',
            warnings: [{
              id: generateId(),
              type: 'missing_features',
              message: error instanceof Error ? error.message : 'Simulation failed',
              severity: 'critical',
              dismissible: false
            }]
          }, false, 'runSimulation/error');
        }
      },

      cancelSimulation: () => set(
        { status: 'idle' },
        false,
        'cancelSimulation'
      ),

      // Input updates
      setInput: (input) => set(
        (state) => ({
          input: { ...state.input, ...input }
        }),
        false,
        'setInput'
      ),

      setTestType: (testType: TestType) => set(
        { testType },
        false,
        'setTestType'
      ),

      setTestConfig: (config) => set(
        (state) => ({
          testConfig: { ...state.testConfig, ...config }
        }),
        false,
        'setTestConfig'
      ),

      // Warnings
      addWarning: (warning: SimulationWarning) => set(
        (state) => ({
          warnings: [...state.warnings, warning]
        }),
        false,
        'addWarning'
      ),

      dismissWarning: (id: string) => set(
        (state) => ({
          warnings: state.warnings.filter(w => w.id !== id)
        }),
        false,
        'dismissWarning'
      ),

      clearWarnings: () => set(
        { warnings: [] },
        false,
        'clearWarnings'
      ),

      // History
      clearHistory: () => set(
        { runHistory: [] },
        false,
        'clearHistory'
      ),

      // Reset
      resetSimulation: () => set(
        { ...DEFAULT_SIMULATION },
        false,
        'resetSimulation'
      )
    }),
    { name: 'SimulationStore' }
  )
);

// Selectors
export const selectPrediction = (state: SimulationState) => state.prediction;
export const selectWarnings = (state: SimulationState) => state.warnings;
export const selectIsRunning = (state: SimulationState) => state.status === 'running';
export const selectHasResults = (state: SimulationState) => state.prediction !== null;