/**
 * SIMULATION DOMAIN TYPES
 * Model predictions, confidence, and validation metrics
 */

export type SimulationMode = 'interpolated' | 'extrapolated' | 'exact';
export type SimulationStatus = 'idle' | 'running' | 'complete' | 'error';
export type ModelState = 'validated' | 'provisional' | 'extrapolated' | 'insufficient_data';
export type TestType = 'compression' | 'tension' | 'flexion' | 'impact' | 'fatigue';

export interface PredictionResult {
  yieldEstimate: number;        // MPa
  energyAbsorption: number;      // J
  stiffness: number;            // N/mm
  maxLoad: number;              // N
  
  // Confidence metrics
  confidenceBand: [number, number]; // [lower, upper] MPa
  confidenceLevel: number;      // % (e.g., 95)
  
  // Domain fit
  domainFit: number;            // % - how well within training domain
  mode: SimulationMode;
  
  // Model metadata
  modelVersion: string;
  modelDate: string;
}

export interface ModelMetrics {
  mae: number;   // Mean Absolute Error
  rmse: number;  // Root Mean Square Error
  r2: number;    // R-squared
  mape: number;  // Mean Absolute Percentage Error
  
  // Coverage metrics
  trainingCoverage: number;     // % of training data range
  validationCoverage: number;  // % of validation data range
  
  // Drift detection
  driftScore: number;          // 0-1, higher = more drift
  lastCalibration: string;     // ISO date
}

export interface SimulationInput {
  features: Record<string, number>;
  normalizedFeatures: Record<string, number>;
  featureVersion: string;
}

export interface SimulationWarning {
  id: string;
  type: 'extrapolation' | 'low_confidence' | 'out_of_domain' | 'model_drift' | 'missing_features';
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  dismissible: boolean;
}

export interface SimulationState {
  // Status
  status: SimulationStatus;
  lastRunAt: number | null;
  
  // Input
  input: SimulationInput;
  
  // Output
  prediction: PredictionResult | null;
  
  // Model metrics
  metrics: ModelMetrics;
  
  // Warnings
  warnings: SimulationWarning[];
  
  // Test configuration
  testType: TestType;
  testConfig: {
    strainRate: number;
    temperature: number;
    humidity: number;
  };
  
  // History
  runHistory: Array<{
    id: string;
    timestamp: number;
    input: SimulationInput;
    prediction: PredictionResult;
  }>;
}

export interface SimulationActions {
  // Run simulation
  runSimulation: () => Promise<void>;
  cancelSimulation: () => void;
  
  // Input updates
  setInput: (input: Partial<SimulationInput>) => void;
  setTestType: (type: TestType) => void;
  setTestConfig: (config: Partial<SimulationState['testConfig']>) => void;
  
  // Warnings
  addWarning: (warning: SimulationWarning) => void;
  dismissWarning: (id: string) => void;
  clearWarnings: () => void;
  
  // History
  clearHistory: () => void;
  
  // Reset
  resetSimulation: () => void;
}

export const DEFAULT_MODEL_METRICS: ModelMetrics = {
  mae: 2.34,
  rmse: 3.12,
  r2: 0.89,
  mape: 8.5,
  trainingCoverage: 85,
  validationCoverage: 78,
  driftScore: 0.12,
  lastCalibration: '2024-01-15T00:00:00Z'
};

export const DEFAULT_SIMULATION: SimulationState = {
  status: 'idle',
  lastRunAt: null,
  input: {
    features: {},
    normalizedFeatures: {},
    featureVersion: '1.0.0'
  },
  prediction: null,
  metrics: DEFAULT_MODEL_METRICS,
  warnings: [],
  testType: 'compression',
  testConfig: {
    strainRate: 1.0,
    temperature: 23,
    humidity: 50
  },
  runHistory: []
};