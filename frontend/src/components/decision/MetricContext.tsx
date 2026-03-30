import { motion } from 'framer-motion';
import { interpretMetric } from '../../lib/metricInterpretation';
import type { Interpretation } from '../../lib/metricInterpretation';
import type { ObjectiveType } from '../../lib/baselineGenerator';
import { Activity, AlertCircle, CheckCircle2, HelpCircle } from 'lucide-react';

interface MetricContextCardProps {
  label: string;
  value: number;
  unit: string;
  metricKey: string;
  objective: ObjectiveType;
}

export function MetricContextCard({ label, value, unit, metricKey, objective }: MetricContextCardProps) {
  const info: Interpretation = interpretMetric(metricKey, value, objective);

  return (
    <div className="group relative p-12 rounded-[3.5rem] bg-white/[0.02] border border-white/5 hover:border-blue-500/30 transition-all cursor-default shadow-3xl">
       <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-5">
             <div className={`h-3 w-3 rounded-full shadow-[0_0_15px_currentColor] ${info.sentiment === 'favorable' ? 'bg-emerald-500 shadow-emerald-500/40' : info.sentiment === 'unfavorable' ? 'bg-orange-500 shadow-orange-500/40' : 'bg-blue-500 shadow-blue-500/40'}`} />
             <span className="text-xs font-black uppercase tracking-[0.4em] text-zinc-500 group-hover:text-white transition-colors">{label}</span>
          </div>
          <HelpCircle className="h-5 w-5 text-zinc-800 hover:text-zinc-500 transition-colors" />
       </div>

       <div className="flex items-baseline gap-4 mb-10">
          <span className="text-6xl md:text-7xl font-black text-white italic tabular-nums tracking-tighter drop-shadow-lg leading-none">{value.toFixed(1)}</span>
          <span className="text-lg font-black text-zinc-500 uppercase tracking-widest">{unit}</span>
       </div>

       {/* Contextual feedback */}
       <motion.div 
         initial={{ opacity: 0, scale: 0.98 }}
         animate={{ opacity: 1, scale: 1 }}
         className={`p-8 rounded-[2.5rem] bg-white/5 border border-white/5 space-y-4`}
       >
          <div className={`flex items-center gap-3 text-xs font-black uppercase tracking-widest ${info.sentiment === 'favorable' ? 'text-emerald-500' : info.sentiment === 'unfavorable' ? 'text-orange-500' : 'text-blue-500'}`}>
             {info.sentiment === 'favorable' ? <CheckCircle2 className="h-4 w-4" /> : 
              info.sentiment === 'unfavorable' ? <AlertCircle className="h-4 w-4" /> : 
              <Activity className="h-4 w-4" />}
             {info.label} <span className="opacity-40 italic ml-2">Verified Protocol</span>
          </div>
          <p className="text-[13px] md:text-sm text-zinc-400 leading-relaxed max-w-full uppercase font-medium tracking-tight">
             "{info.description}"
          </p>
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
             <motion.div 
              initial={{ width: 0 }}
              animate={{ width: info.sentiment === 'favorable' ? '90%' : info.sentiment === 'unfavorable' ? '30%' : '60%' }}
              className={`h-full ${info.sentiment === 'favorable' ? 'bg-emerald-500' : info.sentiment === 'unfavorable' ? 'bg-orange-500' : 'bg-blue-500'} shadow-[0_0_10px_currentColor] opacity-40`}
             />
          </div>
       </motion.div>
    </div>
  );
}
