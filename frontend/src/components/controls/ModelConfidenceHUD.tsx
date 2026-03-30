/**
 * MODEL CONFIDENCE HUD
 * Floating technical panel for real-time model health and prediction confidence.
 */

import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Activity, AlertTriangle, CheckCircle2, ChevronRight } from 'lucide-react';
import { useSimulationStore } from '../../store';

export function ModelConfidenceHUD() {
  const { prediction, status, warnings } = useSimulationStore();

  if (status === 'idle' || !prediction) return null;

  const isExtrapolated = prediction.mode === 'extrapolated';
  const hasHighWarnings = warnings.some(w => w.severity === 'high' || w.severity === 'critical');

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="absolute top-10 right-10 z-20 pointer-events-auto"
    >
      <div className="w-64 rounded-3xl bg-black/60 backdrop-blur-3xl border border-white/10 overflow-hidden shadow-2xl">
        {/* Header Hook */}
        <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
           <div className="flex items-center gap-2">
              <Activity className="h-3 w-3 text-blue-500" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">Confidence Analysis</span>
           </div>
           <div className="flex items-center gap-1">
              <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[8px] font-bold text-zinc-600 uppercase">Live</span>
           </div>
        </div>

        <div className="p-5 space-y-4">
           {/* Main Confidence Value */}
           <div className="flex items-center justify-between">
              <div className="flex flex-col">
                 <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Yield Prediction</span>
                 <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-black text-white italic tracking-tighter tabular-nums">{prediction.yieldEstimate}</span>
                    <span className="text-[10px] font-black text-zinc-500 uppercase">MPa</span>
                 </div>
              </div>
              <div className={`h-10 w-10 rounded-2xl flex items-center justify-center border ${
                isExtrapolated ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' : 'bg-blue-600/10 border-blue-500/30 text-blue-500'
              }`}>
                 <Shield className="h-5 w-5" />
              </div>
           </div>

           {/* Progress Confidence / Domain Fit */}
           <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                 <span className="text-zinc-600">Domain Fit Index</span>
                 <span className={prediction.domainFit > 80 ? 'text-emerald-500' : 'text-amber-500'}>{prediction.domainFit}%</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                 <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${prediction.domainFit}%` }}
                    className={`h-full ${prediction.domainFit > 80 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                 />
              </div>
           </div>

           {/* Metadata & Warning Badge */}
           <div className="pt-2 flex items-center justify-between">
              <div className="flex flex-col">
                 <span className="text-[8px] font-bold text-zinc-700 uppercase">Model_Ref</span>
                 <span className="text-[9px] font-mono text-zinc-500">v{prediction.modelVersion}</span>
              </div>
              
              <div className={`px-2 py-1 rounded-lg border flex items-center gap-1.5 ${
                isExtrapolated ? 'bg-amber-500/10 border-amber-500/20' : 'bg-emerald-500/5 border-emerald-500/20'
              }`}>
                 {isExtrapolated ? <AlertTriangle className="h-2.5 w-2.5 text-amber-500" /> : <CheckCircle2 className="h-2.5 w-2.5 text-emerald-500" />}
                 <span className={`text-[8px] font-black uppercase tracking-widest ${isExtrapolated ? 'text-amber-500' : 'text-emerald-500'}`}>
                    {prediction.mode}
                 </span>
              </div>
           </div>

           {/* Dynamic Blocker Warning */}
           {hasHighWarnings && (
             <div className="mt-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                <AlertTriangle className="h-3 w-3 text-red-500 shrink-0 mt-0.5" />
                <span className="text-[9px] font-bold text-red-500 leading-tight uppercase tracking-tight">
                   Critical: Extrapolation risk detected. Result might be non-defensible.
                </span>
             </div>
           )}
        </div>

        {/* Footer Deep Link */}
        <div className="px-5 py-3 bg-black/40 border-t border-white/5 flex items-center justify-between group cursor-pointer hover:bg-white/[0.02] transition-colors">
           <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest group-hover:text-zinc-400 transition-colors">View technical calibration</span>
           <ChevronRight className="h-2.5 w-2.5 text-zinc-700 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    </motion.div>
  );
}
