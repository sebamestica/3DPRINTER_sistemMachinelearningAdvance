/**
 * FAILURE ANALYSIS PANEL
 * Predict failure modes and stress concentrations
 */

import { motion } from 'framer-motion';
import { AlertTriangle, Layers, Box, Zap, TrendingDown, AlertCircle } from 'lucide-react';
import { useProductStore, useSimulationStore } from '../../../store';

interface FailureMode {
  id: string;
  name: string;
  probability: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  mitigation: string;
}

const FAILURE_MODES: FailureMode[] = [
  {
    id: 'buckling',
    name: 'Euler Buckling',
    probability: 0.35,
    severity: 'high',
    description: 'Column instability under compressive load',
    mitigation: 'Reduce strut length or increase cross-section'
  },
  {
    id: 'layer_delamination',
    name: 'Layer Delamination',
    probability: 0.25,
    severity: 'medium',
    description: 'Separation between printed layers',
    mitigation: 'Increase layer adhesion with higher temp'
  },
  {
    id: 'stress_concentration',
    name: 'Stress Concentration',
    probability: 0.20,
    severity: 'high',
    description: 'Localized stress at geometric discontinuities',
    mitigation: 'Add fillets or smooth transitions'
  },
  {
    id: 'progressive_collapse',
    name: 'Progressive Collapse',
    probability: 0.15,
    severity: 'critical',
    description: 'Sequential failure of structural members',
    mitigation: 'Increase redundancy in load paths'
  },
  {
    id: 'layer_fracture',
    name: 'Layer Fracture',
    probability: 0.10,
    severity: 'medium',
    description: 'Crack propagation along layer lines',
    mitigation: 'Optimize print orientation'
  }
];

export function FailureAnalysisPanel() {
  const { prediction } = useSimulationStore();
  const { strutThickness, layerHeight, infillDensity } = useProductStore();

  // Calculate adjusted probabilities based on parameters
  const adjustedModes = FAILURE_MODES.map(mode => {
    let adjustedProb = mode.probability;

    // Adjust based on strut thickness
    if (mode.id === 'buckling') {
      adjustedProb *= strutThickness < 0.8 ? 1.5 : strutThickness > 1.0 ? 0.7 : 1;
    }

    // Adjust based on layer height
    if (mode.id === 'layer_delamination' || mode.id === 'layer_fracture') {
      adjustedProb *= layerHeight > 0.25 ? 1.4 : 0.8;
    }

    // Adjust based on infill
    if (mode.id === 'progressive_collapse') {
      adjustedProb *= infillDensity < 30 ? 1.6 : infillDensity > 50 ? 0.6 : 1;
    }

    return {
      ...mode,
      probability: Math.min(1, adjustedProb)
    };
  }).sort((a, b) => b.probability - a.probability);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/10 border-red-500/30 text-red-500';
      case 'high': return 'bg-amber-500/10 border-amber-500/30 text-amber-500';
      case 'medium': return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500';
      default: return 'bg-blue-500/10 border-blue-500/30 text-blue-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center">
          <AlertTriangle className="h-5 w-5 text-red-500" />
        </div>
        <div>
          <h2 className="text-lg font-black text-white uppercase tracking-tight">
            Failure Analysis
          </h2>
          <p className="text-xs text-zinc-500">Predict failure modes and stress concentrations</p>
        </div>
      </div>

      {/* Failure Mode Cards */}
      <div className="space-y-3">
        {adjustedModes.map((mode, idx) => (
          <motion.div
            key={mode.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-5 rounded-2xl bg-zinc-900/50 border border-white/5"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg border ${getSeverityColor(mode.severity)}`}>
                  {mode.severity === 'critical' ? (
                    <AlertCircle className="h-4 w-4" />
                  ) : mode.severity === 'high' ? (
                    <AlertTriangle className="h-4 w-4" />
                  ) : (
                    <Layers className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{mode.name}</h3>
                  <p className="text-[10px] text-zinc-500">{mode.description}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-lg font-black ${
                  mode.probability > 0.5 ? 'text-red-500' :
                  mode.probability > 0.3 ? 'text-amber-500' : 'text-zinc-400'
                }`}>
                  {(mode.probability * 100).toFixed(0)}%
                </span>
                <span className="text-[9px] text-zinc-600 block uppercase">probability</span>
              </div>
            </div>

            {/* Probability Bar */}
            <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden mb-3">
              <motion.div
                className={`h-full rounded-full ${
                  mode.probability > 0.5 ? 'bg-red-500' :
                  mode.probability > 0.3 ? 'bg-amber-500' : 'bg-zinc-500'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${mode.probability * 100}%` }}
                transition={{ duration: 0.8, delay: idx * 0.1 }}
              />
            </div>

            {/* Mitigation */}
            <div className="flex items-start gap-2 p-3 rounded-xl bg-zinc-900/50">
              <Zap className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-500 block mb-0.5">
                  Mitigation
                </span>
                <span className="text-xs text-zinc-400">{mode.mitigation}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Stress Concentration Map Placeholder */}
      <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingDown className="h-4 w-4 text-zinc-600" />
          <h3 className="text-sm font-bold text-white">Stress Distribution</h3>
        </div>
        <div className="aspect-video rounded-xl bg-zinc-900 flex items-center justify-center border border-dashed border-white/10">
          <div className="text-center">
            <Box className="h-8 w-8 text-zinc-700 mx-auto mb-2" />
            <p className="text-xs text-zinc-600">Run simulation to generate stress map</p>
          </div>
        </div>
      </div>
    </div>
  );
}