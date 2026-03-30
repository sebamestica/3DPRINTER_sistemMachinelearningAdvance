/**
 * RENDER STORE
 * Performance presets and device optimization
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { RenderState, RenderActions, RenderPreset, DeviceClass, RenderConfig, PerformanceMetrics } from '../../domain/render/types';
import { DEFAULT_RENDER, RENDER_PRESETS, DEFAULT_PERFORMANCE_METRICS } from '../../domain/render/types';

// Device detection utility
const detectDeviceClass = (): DeviceClass => {
  if (typeof window === 'undefined') return 'desktop-high';

  const ua = navigator.userAgent.toLowerCase();
  const isMobile = /mobile|android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua);
  const isTablet = /tablet|ipad/i.test(ua) || (isMobile && window.innerWidth > 768);

  if (isMobile && !isTablet) return 'mobile';
  if (isTablet) return 'tablet';

  // Desktop - check for high-end indicators
  const cores = navigator.hardwareConcurrency || 4;
  const memory = (navigator as any).deviceMemory || 8;

  if (cores >= 8 && memory >= 16) return 'desktop-high';
  if (cores >= 4 && memory >= 8) return 'desktop-mid';
  return 'laptop';
};

// Get recommended preset for device
const getRecommendedPreset = (deviceClass: DeviceClass): RenderPreset => {
  switch (deviceClass) {
    case 'desktop-high': return 'desktop';
    case 'desktop-mid': return 'balanced';
    case 'laptop': return 'balanced';
    case 'tablet': return 'mobile';
    case 'mobile': return 'mobile';
    default: return 'balanced';
  }
};

export const useRenderStore = create<RenderState & RenderActions>()(
  devtools(
    (set, get) => ({
      // Initial state with auto-detection
      ...DEFAULT_RENDER,
      deviceClass: detectDeviceClass(),
      preset: getRecommendedPreset(detectDeviceClass()),
      config: RENDER_PRESETS[getRecommendedPreset(detectDeviceClass())],

      // Preset management
      setPreset: (preset: RenderPreset) => set(
        {
          preset,
          config: RENDER_PRESETS[preset]
        },
        false,
        'setPreset'
      ),

      setDeviceClass: (deviceClass: DeviceClass) => {
        const recommendedPreset = getRecommendedPreset(deviceClass);
        set({
          deviceClass,
          preset: recommendedPreset,
          config: RENDER_PRESETS[recommendedPreset]
        }, false, 'setDeviceClass');
      },

      // Configuration
      updateConfig: (config: Partial<RenderConfig>) => set(
        (state) => ({
          config: { ...state.config, ...config }
        }),
        false,
        'updateConfig'
      ),

      // Performance
      updateMetrics: (metrics: Partial<PerformanceMetrics>) => set(
        (state) => ({
          metrics: { ...state.metrics, ...metrics }
        }),
        false,
        'updateMetrics'
      ),

      setTargetFPS: (fps: number) => set(
        { targetFPS: fps },
        false,
        'setTargetFPS'
      ),

      // Adaptive
      toggleAutoAdjust: () => set(
        (state) => ({ autoAdjust: !state.autoAdjust }),
        false,
        'toggleAutoAdjust'
      ),

      setDegradationLevel: (level: number) => set(
        { degradationLevel: Math.max(0, Math.min(100, level)) },
        false,
        'setDegradationLevel'
      ),

      // Quality overrides
      setForceShadows: (enabled: boolean | null) => set(
        { forceShadows: enabled },
        false,
        'setForceShadows'
      ),

      setForceTransparency: (enabled: boolean | null) => set(
        { forceTransparency: enabled },
        false,
        'setForceTransparency'
      ),

      // Debug
      toggleStats: () => set(
        (state) => ({ showStats: !state.showStats }),
        false,
        'toggleStats'
      ),

      toggleGrid: () => set(
        (state) => ({ showGrid: !state.showGrid }),
        false,
        'toggleGrid'
      ),

      toggleAxes: () => set(
        (state) => ({ showAxes: !state.showAxes }),
        false,
        'toggleAxes'
      ),

      // Reset
      resetToDefaults: () => {
        const deviceClass = detectDeviceClass();
        const preset = getRecommendedPreset(deviceClass);
        set({
          ...DEFAULT_RENDER,
          deviceClass,
          preset,
          config: RENDER_PRESETS[preset]
        }, false, 'resetToDefaults');
      }
    }),
    { name: 'RenderStore' }
  )
);

// Adaptive performance monitor
export const startPerformanceMonitor = () => {
  let frameCount = 0;
  let lastTime = performance.now();
  let minFPS = Infinity;
  let maxFPS = 0;

  const measure = () => {
    frameCount++;
    const now = performance.now();
    const delta = now - lastTime;

    if (delta >= 1000) {
      const fps = Math.round((frameCount * 1000) / delta);
      minFPS = Math.min(minFPS, fps);
      maxFPS = Math.max(maxFPS, fps);

      const store = useRenderStore.getState();
      store.updateMetrics({
        currentFPS: fps,
        averageFPS: Math.round((fps + (store.metrics.averageFPS || fps)) / 2),
        minFPS,
        maxFPS,
        frameTime: 1000 / fps
      });

      // Auto-adjust if enabled and FPS is too low
      if (store.autoAdjust && fps < store.targetFPS * 0.7) {
        const currentLevel = store.degradationLevel;
        if (currentLevel < 100) {
          store.setDegradationLevel(Math.min(100, currentLevel + 10));
        }
      }

      frameCount = 0;
      lastTime = now;
    }

    requestAnimationFrame(measure);
  };

  requestAnimationFrame(measure);
};

// Selectors
export const selectPreset = (state: RenderState) => state.preset;
export const selectConfig = (state: RenderState) => state.config;
export const selectFPS = (state: RenderState) => state.metrics.currentFPS;
export const selectIsMobile = (state: RenderState) =>
  state.deviceClass === 'mobile' || state.deviceClass === 'tablet';