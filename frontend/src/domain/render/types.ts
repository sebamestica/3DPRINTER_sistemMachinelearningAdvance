/**
 * RENDER DOMAIN TYPES
 * Performance presets, LOD, and device optimization
 */

export type RenderPreset = 'desktop' | 'balanced' | 'mobile' | 'ultra';
export type LODLevel = 0 | 1 | 2 | 3; // 0 = lowest, 3 = highest
export type DeviceClass = 'desktop-high' | 'desktop-mid' | 'laptop' | 'tablet' | 'mobile';

export interface RenderConfig {
  polyBudget: number;
  shadowsEnabled: boolean;
  transparencyEnabled: boolean;
  postFXEnabled: boolean;
  antialiasing: boolean;
  lodLevel: LODLevel;
  instancingEnabled: boolean;
  frustumCulling: boolean;
  occlusionCulling: boolean;
}

export interface PerformanceMetrics {
  currentFPS: number;
  averageFPS: number;
  minFPS: number;
  maxFPS: number;
  frameTime: number;        // ms
  drawCalls: number;
  triangles: number;
  geometries: number;
  textures: number;
  programs: number;
  memoryMB: number;
}

export interface RenderState {
  // Preset
  preset: RenderPreset;
  deviceClass: DeviceClass;
  
  // Configuration
  config: RenderConfig;
  
  // Performance
  metrics: PerformanceMetrics;
  targetFPS: number;
  
  // Adaptive settings
  autoAdjust: boolean;
  degradationLevel: number; // 0-100, higher = more degraded
  
  // Quality overrides
  forceShadows: boolean | null;
  forceTransparency: boolean | null;
  
  // Debug
  showStats: boolean;
  showGrid: boolean;
  showAxes: boolean;
}

export interface RenderActions {
  // Preset management
  setPreset: (preset: RenderPreset) => void;
  setDeviceClass: (deviceClass: DeviceClass) => void;
  
  // Configuration
  updateConfig: (config: Partial<RenderConfig>) => void;
  
  // Performance
  updateMetrics: (metrics: Partial<PerformanceMetrics>) => void;
  setTargetFPS: (fps: number) => void;
  
  // Adaptive
  toggleAutoAdjust: () => void;
  setDegradationLevel: (level: number) => void;
  
  // Quality overrides
  setForceShadows: (enabled: boolean | null) => void;
  setForceTransparency: (enabled: boolean | null) => void;
  
  // Debug
  toggleStats: () => void;
  toggleGrid: () => void;
  toggleAxes: () => void;
  
  // Reset
  resetToDefaults: () => void;
}

export const RENDER_PRESETS: Record<RenderPreset, RenderConfig> = {
  ultra: {
    polyBudget: 1_000_000,
    shadowsEnabled: true,
    transparencyEnabled: true,
    postFXEnabled: true,
    antialiasing: true,
    lodLevel: 3,
    instancingEnabled: true,
    frustumCulling: true,
    occlusionCulling: true
  },
  desktop: {
    polyBudget: 500_000,
    shadowsEnabled: true,
    transparencyEnabled: true,
    postFXEnabled: true,
    antialiasing: true,
    lodLevel: 2,
    instancingEnabled: true,
    frustumCulling: true,
    occlusionCulling: false
  },
  balanced: {
    polyBudget: 220_000,
    shadowsEnabled: false,
    transparencyEnabled: true,
    postFXEnabled: false,
    antialiasing: true,
    lodLevel: 1,
    instancingEnabled: true,
    frustumCulling: true,
    occlusionCulling: false
  },
  mobile: {
    polyBudget: 80_000,
    shadowsEnabled: false,
    transparencyEnabled: false,
    postFXEnabled: false,
    antialiasing: false,
    lodLevel: 0,
    instancingEnabled: true,
    frustumCulling: true,
    occlusionCulling: false
  }
};

export const DEFAULT_PERFORMANCE_METRICS: PerformanceMetrics = {
  currentFPS: 60,
  averageFPS: 58,
  minFPS: 45,
  maxFPS: 60,
  frameTime: 16.67,
  drawCalls: 0,
  triangles: 0,
  geometries: 0,
  textures: 0,
  programs: 0,
  memoryMB: 0
};

export const DEFAULT_RENDER: RenderState = {
  preset: 'desktop',
  deviceClass: 'desktop-high',
  config: RENDER_PRESETS.desktop,
  metrics: DEFAULT_PERFORMANCE_METRICS,
  targetFPS: 60,
  autoAdjust: true,
  degradationLevel: 0,
  forceShadows: null,
  forceTransparency: null,
  showStats: false,
  showGrid: true,
  showAxes: false
};