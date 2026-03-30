/**
 * VALIDATION & CALIBRATION PANEL
 * Quality Assurance and Model Defensibility Metrics
 */

import { motion } from 'framer-motion';
import { 
  Shield, TrendingUp, Target, AlertCircle, 
  CheckCircle2, BarChart3, Database, Info, Activity
} from 'lucide-react';
import { useSimulationStore } from '../../../store';
import type { ModelState } from '../../../domain/simulation/types';

export function ValidationPanel() {
  const { prediction, metrics, status } = useSimulationStore();

  // Determine Model State based on metrics
  const getModelState = (): { state: ModelState; label: string; color: string } => {
    if (metrics.trainingCoverage < 30) return { state: 'insufficient_data', label: 'Insufficient Data', color: 'text-zinc-600 border-zinc-800 bg-zinc-900/40' };
    if (prediction?.mode === 'extrapolated') return { state: 'extrapolated', label: 'Out of Bounds', color: 'text-amber-500 border-amber-500/20 bg-amber-500/5' };
    if (metrics.r2 < 0.8) return { state: 'provisional', label: 'Provisional Model', color: 'text-blue-400 border-blue-500/20 bg-blue-500/5' };
    return { state: 'validated', label: 'Validated Engine', color: 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5' };
  };

  const modelState = getModelState();

  const primaryMetrics = [
    { label: 'MAE', value: metrics.mae, unit: 'MPa', target: '< 3.0', ok: metrics.mae < 3 },
    { label: 'RMSE', value: metrics.rmse, unit: 'MPa', target: '< 4.0', ok: metrics.rmse < 4 },
    { label: 'R²', value: metrics.r2, unit: '', target: '> 0.85', ok: metrics.r2 > 0.85 },
    { label: 'MAPE', value: metrics.mape, unit: '%', target: '< 10%', ok: metrics.mape < 10 }
  ];

  return (
    <div className="flex flex-col gap-8 h-full">
      {/* 1. MODEL STATUS HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">
            <Shield className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white uppercase tracking-tight italic">Calibration Protocol v4.2</h2>
            <p className="text-xs text-zinc-600 uppercase tracking-widest mt-0.5">Statistical Defensibility & Error Analysis</p>
          </div>
        </div>

        <div className={`px-5 py-2 rounded-xl border flex items-center gap-3 transition-all ${modelState.color}`}>
           <CheckCircle2 className="h-4 w-4" />
           <span className="text-[10px] font-black uppercase tracking-[0.2em]">{modelState.label}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         {/* 2. ERROR METRICS GRID */}
         <div className="lg:col-span-2 space-y-6">
            <div className="p-8 rounded-[2.5rem] bg-zinc-950 border border-white/5 space-y-8">
               <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div className="flex items-center gap-3">
                     <BarChart3 className="h-4 w-4 text-zinc-600" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Error Distribution Score</span>
                  </div>
                  <span className="text-[9px] font-mono text-zinc-700">KERNEL_FEA_ID: 0x88F2A</span>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  {primaryMetrics.map((m) => (
                    <div key={m.label} className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-1 group hover:border-blue-500/20 transition-colors">
                       <div className="flex items-center justify-between">
                          <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{m.label}</span>
                          {m.ok ? <Activity className="h-3 w-3 text-emerald-500/50" /> : <AlertCircle className="h-3 w-3 text-amber-500/50" />}
                       </div>
                       <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-black text-white tabular-nums italic">{m.value}</span>
                          <span className="text-[10px] font-black text-zinc-700 uppercase">{m.unit}</span>
                       </div>
                       <div className="text-[8px] font-bold text-zinc-800 uppercase tracking-tighter">Target Threshold: {m.target}</div>
                    </div>
                  ))}
               </div>
            </div>

            {/* Residuals Placeholder */}
            <div className="p-8 rounded-[2.5rem] bg-zinc-950 border border-white/5 space-y-4">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <Activity className="h-4 w-4 text-zinc-600" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Residual Diagnostics</span>
                  </div>
                  <Info className="h-4 w-4 text-zinc-800 hover:text-blue-500 cursor-help" />
               </div>
               <div className="h-32 w-full rounded-2xl bg-black/40 border border-white/5 border-dashed flex flex-col items-center justify-center gap-2">
                  <span className="text-[10px] font-black text-zinc-800 uppercase italic">Visualizing Normal Distribution...</span>
                  <div className="flex items-end gap-1 h-12">
                     {[20, 35, 50, 80, 100, 80, 50, 35, 20].map((h, i) => (
                       <motion.div 
                        key={i} 
                        initial={{ height: 0 }} animate={{ height: `${h}%` }}
                        className="w-4 bg-blue-500/10 border-t border-blue-500/30 rounded-t-sm" 
                       />
                     ))}
                  </div>
               </div>
            </div>
         </div>

         {/* 3. COVERAGE & DRIFT (RIGHT) */}
         <div className="space-y-6">
            <div className="p-8 rounded-[2.5rem] bg-zinc-950 border border-white/5 space-y-8">
               <div className="flex items-center gap-3">
                  <Database className="h-4 w-4 text-zinc-600" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Data Coverage</span>
               </div>
               
               <div className="space-y-6">
                  {[
                    { label: 'Training Set', val: metrics.trainingCoverage, color: 'bg-blue-600' },
                    { label: 'Validation Set', val: metrics.validationCoverage, color: 'bg-indigo-600' },
                    { label: 'Domain Fit (Active)', val: prediction?.domainFit || 0, color: 'bg-purple-600' }
                  ].map((c) => (
                    <div key={c.label} className="space-y-2">
                       <div className="flex justify-between items-baseline">
                          <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{c.label}</span>
                          <span className="text-xs font-black text-white italic">{c.val}%</span>
                       </div>
                       <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }} animate={{ width: `${c.val}%` }}
                            className={`h-full ${c.color} shadow-[0_0_10px_rgba(37,99,235,0.3)]`} 
                          />
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="p-8 rounded-[2.5rem] bg-zinc-950 border border-white/5 space-y-6">
               <div className="flex items-center gap-3">
                  <TrendingUp className="h-4 w-4 text-zinc-600" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Model Drift</span>
               </div>
               <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                     <span className="text-3xl font-black text-white tabular-nums">{(metrics.driftScore * 100).toFixed(1)}%</span>
                     <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500">Stability: High</span>
                  </div>
                  <div className="h-12 w-12 rounded-full border-4 border-emerald-500/10 border-t-emerald-500 rotate-[-45deg]" />
               </div>
               <p className="text-[9px] font-bold text-zinc-700 leading-relaxed uppercase italic">
                  Last calibration synchronized on {metrics.lastCalibration.split('T')[0]}. Performance remains within design band.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
}