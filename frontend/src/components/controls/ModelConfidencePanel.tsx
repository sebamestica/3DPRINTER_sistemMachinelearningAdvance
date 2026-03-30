/**
 * MODEL CONFIDENCE PANEL
 * Shows prediction reliability, domain fit, and warnings
 */

import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Info, TrendingUp, Shield, Gauge, AlertCircle } from 'lucide-react';
import { useSimulationStore } from '../../store';
import type { SimulationWarning } from '../../domain/simulation/types';

export function ModelConfidencePanel() {
  const { prediction, warnings, metrics, status } = useSimulationStore();

  if (status === 'idle') {
    return (
      <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-zinc-800 flex items-center justify-center">
            <Gauge className="h-4 w-4 text-zinc-600" />
          </div>
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
              Model Confidence
            </h3>
            <p className="text-xs text-zinc-500">Run simulation to see predictions</p>
          </div>
        </div>
      </div>
    );
  }

  if (!prediction) return null;

  const getDomainFitColor = (fit: number) => {
    if (fit >= 85) return 'text-emerald-500';
    if (fit >= 70) return 'text-amber-500';
    return 'text-red-500';
  };

  const getModeBadge = (mode: string) => {
    if (mode === 'interpolated') {
      return { label: 'INTERPOLATED', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' };
    }
    return { label: 'EXTRAPOLATED', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' };
  };

  const modeBadge = getModeBadge(prediction.mode);

  return (
    <div className="space-y-4">
      {/* Main Prediction */}
      <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </div>
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
                Yield Estimate
              </h3>
              <p className="text-xs text-zinc-500">Model v{prediction.modelVersion}</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${modeBadge.color}`}>
            {modeBadge.label}
          </span>
        </div>

        {/* Main Value */}
        <div className="flex items-baseline gap-2">
          <motion.span
            key={prediction.yieldEstimate}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-black text-white tabular-nums"
          >
            {prediction.yieldEstimate}
          </motion.span>
          <span className="text-lg font-bold text-zinc-500">MPa</span>
        </div>

        {/* Confidence Band */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <Shield className="h-3.5 w-3.5 text-zinc-600" />
            <span className="text-zinc-500">Confidence:</span>
            <span className="text-zinc-300 font-mono">
              ±{((prediction.confidenceBand[1] - prediction.confidenceBand[0]) / 2).toFixed(1)} MPa
            </span>
          </div>
          <div className="h-3 w-px bg-white/10" />
          <div className="flex items-center gap-2">
            <span className="text-zinc-500">Range:</span>
            <span className="text-zinc-300 font-mono">
              {prediction.confidenceBand[0]} - {prediction.confidenceBand[1]}
            </span>
          </div>
        </div>

        {/* Domain Fit Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-zinc-600 uppercase tracking-widest font-bold">Domain Fit</span>
            <span className={`font-black ${getDomainFitColor(prediction.domainFit)}`}>
              {prediction.domainFit}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                backgroundColor: prediction.domainFit >= 85 ? '#10b981' :
                                 prediction.domainFit >= 70 ? '#f59e0b' : '#ef4444'
              }}
              initial={{ width: 0 }}
              animate={{ width: `${prediction.domainFit}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          {prediction.domainFit < 80 && (
            <p className="text-[10px] text-amber-500 flex items-center gap-1.5">
              <AlertTriangle className="h-3 w-3" />
              Parameters outside validated range
            </p>
          )}
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-xl bg-zinc-900/30 border border-white/5">
          <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600 block mb-1">
            Energy Absorption
          </span>
          <span className="text-lg font-black text-white">{prediction.energyAbsorption}</span>
          <span className="text-xs text-zinc-500 ml-1">J</span>
        </div>
        <div className="p-4 rounded-xl bg-zinc-900/30 border border-white/5">
          <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600 block mb-1">
            Stiffness
          </span>
          <span className="text-lg font-black text-white">{prediction.stiffness}</span>
          <span className="text-xs text-zinc-500 ml-1">N/mm</span>
        </div>
      </div>

      {/* Model Metrics */}
      <div className="p-4 rounded-xl bg-zinc-900/30 border border-white/5">
        <div className="flex items-center gap-2 mb-3">
          <Info className="h-3.5 w-3.5 text-zinc-600" />
          <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">
            Model Performance
          </span>
        </div>
        <div className="grid grid-cols-4 gap-3 text-center">
          <div>
            <span className="text-xs font-black text-white block">{metrics.mae}</span>
            <span className="text-[8px] text-zinc-600 uppercase">MAE</span>
          </div>
          <div>
            <span className="text-xs font-black text-white block">{metrics.rmse}</span>
            <span className="text-[8px] text-zinc-600 uppercase">RMSE</span>
          </div>
          <div>
            <span className="text-xs font-black text-white block">{metrics.r2}</span>
            <span className="text-[8px] text-zinc-600 uppercase">R²</span>
          </div>
          <div>
            <span className="text-xs font-black text-white block">{metrics.mape}%</span>
            <span className="text-[8px] text-zinc-600 uppercase">MAPE</span>
          </div>
        </div>
      </div>

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="space-y-2">
          {warnings.map((warning) => (
            <WarningCard key={warning.id} warning={warning} />
          ))}
        </div>
      )}
    </div>
  );
}

function WarningCard({ warning }: { warning: SimulationWarning }) {
  const { dismissWarning } = useSimulationStore();

  const getIcon = () => {
    switch (warning.severity) {
      case 'critical': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'high': return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      default: return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getBg = () => {
    switch (warning.severity) {
      case 'critical': return 'bg-red-500/5 border-red-500/20';
      case 'high': return 'bg-amber-500/5 border-amber-500/20';
      default: return 'bg-blue-500/5 border-blue-500/20';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`p-3 rounded-xl border flex items-start gap-3 ${getBg()}`}
    >
      {getIcon()}
      <div className="flex-1">
        <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 block mb-0.5">
          {warning.type.replace('_', ' ')}
        </span>
        <p className="text-xs text-zinc-300">{warning.message}</p>
      </div>
      {warning.dismissible && (
        <button
          onClick={() => dismissWarning(warning.id)}
          className="text-zinc-600 hover:text-zinc-400 transition-colors"
        >
          ×
        </button>
      )}
    </motion.div>
  );
}