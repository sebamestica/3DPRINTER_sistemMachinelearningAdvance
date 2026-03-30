/**
 * RENDER PRESET SELECTOR
 * Quality presets for desktop/balanced/mobile
 */

import { motion } from 'framer-motion';
import { Monitor, Laptop, Smartphone, Cpu, Sparkles, Zap } from 'lucide-react';
import { useRenderStore } from '../../store';
import type { RenderPreset } from '../../domain/render/types';

const PRESET_CONFIG: Record<RenderPreset, {
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  polyBudget: string;
}> = {
  ultra: {
    label: 'Ultra',
    description: 'Maximum quality, high-end hardware',
    icon: <Sparkles className="h-4 w-4" />,
    color: 'from-purple-500 to-pink-500',
    polyBudget: '1M polys'
  },
  desktop: {
    label: 'Desktop',
    description: 'Full quality for workstations',
    icon: <Monitor className="h-4 w-4" />,
    color: 'from-blue-500 to-cyan-500',
    polyBudget: '500K polys'
  },
  balanced: {
    label: 'Balanced',
    description: 'Optimized for laptops',
    icon: <Laptop className="h-4 w-4" />,
    color: 'from-emerald-500 to-teal-500',
    polyBudget: '220K polys'
  },
  mobile: {
    label: 'Mobile',
    description: 'Optimized for tablets/phones',
    icon: <Smartphone className="h-4 w-4" />,
    color: 'from-amber-500 to-orange-500',
    polyBudget: '80K polys'
  }
};

export function RenderPresetSelector() {
  const { preset, setPreset, metrics, autoAdjust, toggleAutoAdjust, deviceClass } = useRenderStore();

  const presets: RenderPreset[] = ['ultra', 'desktop', 'balanced', 'mobile'];

  return (
    <div className="p-4 rounded-2xl bg-zinc-900/50 border border-white/5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cpu className="h-4 w-4 text-zinc-600" />
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
            Quality Preset
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-zinc-600 uppercase">Auto-adjust</span>
          <button
            onClick={toggleAutoAdjust}
            className={`w-8 h-4 rounded-full transition-colors ${
              autoAdjust ? 'bg-blue-600' : 'bg-zinc-700'
            }`}
          >
            <motion.div
              className="h-3 w-3 rounded-full bg-white shadow"
              animate={{ x: autoAdjust ? 16 : 2 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </button>
        </div>
      </div>

      {/* Preset Grid */}
      <div className="grid grid-cols-2 gap-2">
        {presets.map((p) => {
          const config = PRESET_CONFIG[p];
          const isActive = preset === p;
          const isRecommended =
            (deviceClass === 'desktop-high' && p === 'desktop') ||
            (deviceClass === 'desktop-mid' && p === 'balanced') ||
            (deviceClass === 'laptop' && p === 'balanced') ||
            (deviceClass === 'tablet' && p === 'mobile') ||
            (deviceClass === 'mobile' && p === 'mobile');

          return (
            <motion.button
              key={p}
              onClick={() => setPreset(p)}
              className={`
                relative p-3 rounded-xl border transition-all text-left
                ${isActive
                  ? 'bg-white/5 border-white/20'
                  : 'bg-zinc-900/50 border-white/5 hover:border-white/10'
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isRecommended && (
                <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 rounded-full bg-blue-600 text-[7px] font-black uppercase">
                  Recommended
                </span>
              )}

              <div className="flex items-center gap-2 mb-1">
                <div className={`p-1.5 rounded-lg bg-gradient-to-br ${config.color} bg-opacity-20`}>
                  {config.icon}
                </div>
                <span className="text-xs font-black text-white">{config.label}</span>
              </div>

              <p className="text-[9px] text-zinc-500 leading-tight">{config.description}</p>
              <p className="text-[8px] text-zinc-600 mt-1 font-mono">{config.polyBudget}</p>
            </motion.button>
          );
        })}
      </div>

      {/* FPS Display */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/30 border border-white/5">
        <div className="flex items-center gap-2">
          <Zap className="h-3.5 w-3.5 text-zinc-600" />
          <span className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold">FPS</span>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-lg font-black tabular-nums ${
            metrics.currentFPS >= 55 ? 'text-emerald-500' :
            metrics.currentFPS >= 30 ? 'text-amber-500' : 'text-red-500'
          }`}>
            {metrics.currentFPS}
          </span>
          <div className="flex flex-col text-[8px] text-zinc-600">
            <span>min: {metrics.minFPS}</span>
            <span>max: {metrics.maxFPS}</span>
          </div>
        </div>
      </div>
    </div>
  );
}