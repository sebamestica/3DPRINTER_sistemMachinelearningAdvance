import { motion } from 'framer-motion';
import { Shield, Zap, AlertCircle, CheckCircle2, Info, LayoutGrid, Layers } from 'lucide-react';
import type { ManufacturingAssessment } from '../../lib/manufacturingRules';

/**
 * Manufacturing Reality Layer (AM Validation Panel)
 * Shows Printability Score, Risks, and Merits in a CAD-like UI.
 */

interface PrintabilityPanelProps {
  assessment: ManufacturingAssessment;
  currentLayer: number;
}

export function PrintabilityPanel({ assessment, currentLayer }: PrintabilityPanelProps) {
  const getStatusColor = (v: any) => v === 'printable' ? 'emerald' : v === 'caution' ? 'orange' : 'red';
  const color = getStatusColor(assessment.verdict);

  return (
    <div className="p-8 rounded-[3.5rem] bg-black border border-white/10 space-y-10 shadow-3xl overflow-hidden relative group">
       <div className={`absolute -inset-1 bg-${color}-500/10 blur-[100px] opacity-20 pointer-events-none`} />
       
       {/* 1. PRINTABILITY SCORE (GAUGE) */}
       <header className="flex items-center justify-between group cursor-default">
          <div className="flex items-center gap-4">
             <div className="h-10 w-10 shrink-0 rounded-2xl bg-white/5 flex items-center justify-center text-zinc-600 group-hover:text-blue-500 transition-colors shadow-inner">
                <Shield className="h-4 w-4" />
             </div>
             <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">AM Printability Status</span>
                <span className="text-sm font-bold text-zinc-400 group-hover:text-white transition-colors uppercase tracking-widest italic">{assessment.verdict === 'printable' ? 'Sólida' : assessment.verdict === 'caution' ? 'Precaución' : 'Peligro Crítico'}</span>
             </div>
          </div>
          <Info className="h-4 w-4 text-zinc-800 hover:text-white transition-colors cursor-help" />
       </header>

       <div className="flex items-center gap-10">
          <div className="relative h-28 w-28 shrink-0 flex items-center justify-center">
             <svg className="h-full w-full -rotate-90">
                <circle cx="56" cy="56" r="48" fill="none" stroke="currentColor" strokeWidth="10" className="text-zinc-900" />
                <circle 
                  cx="56" cy="56" r="48" fill="none" stroke="currentColor" strokeWidth="10" 
                  strokeDasharray={2 * Math.PI * 48} 
                  strokeDashoffset={2 * Math.PI * 48 * (1 - assessment.score/100)} 
                  className={`text-${color}-500 shadow-[0_0_15px_currentColor] transition-all duration-1000`}
                />
             </svg>
             <div className="absolute inset-x-0 flex flex-col items-center">
                <span className="num-lg drop-shadow-xl text-white">{assessment.score}</span>
                <span className="text-[8px] font-black text-white/30 uppercase mt-1 tracking-widest text-center">Score</span>
             </div>
          </div>
          
          <div className="flex-1 space-y-3">
             <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest block mb-1">Cálculo de Manufactura v1.0.5</span>
             <p className="text-[12px] font-bold text-zinc-300 leading-relaxed uppercase tracking-tight italic">
                "{assessment.verdict === 'printable' ? 'Protocolo de fabricación estable bajo condiciones de cura estándar.' : 'Advertencia de zonas críticas: Verifique soportes y temperatura perimetral.'}"
             </p>
          </div>
       </div>

       {/* 2. LAYER REALITY HUD */}
       <div className="h-px w-full bg-white/5" />

       <div className="grid grid-cols-2 gap-4">
          <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-2">
             <div className="flex items-center gap-2 text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                <Layers className="h-3 w-3" /> Densidad Capa
             </div>
             <div className="text-xl font-black text-white italic tabular-nums tracking-tighter">{(98 - currentLayer/2).toFixed(1)}%</div>
             <span className="text-[8px] font-mono text-zinc-800 uppercase tracking-widest leading-none">V_Continuidad</span>
          </div>
          <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-2">
             <div className="flex items-center gap-2 text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                <Zap className="h-3 w-3" /> G-Code Energy
             </div>
             <div className="text-xl font-black text-white italic tabular-nums tracking-tighter">{(24 + currentLayer/4).toFixed(1)} <span className="text-xs text-zinc-700">J/mm</span></div>
             <span className="text-[8px] font-mono text-zinc-800 uppercase tracking-widest leading-none">Dist. Térmica</span>
          </div>
       </div>

       {/* 3. RISKS & MERITS */}
       <div className="space-y-6 pt-2">
          {assessment.risks.length > 0 && (
             <div className="space-y-4">
                <div className="text-[10px] font-black text-orange-500 uppercase tracking-widest flex items-center gap-3">
                   <AlertCircle className="h-4 w-4" /> Riesgos de Impresión
                </div>
                <div className="space-y-3">
                   {assessment.risks.map((risk, i) => (
                     <div key={i} className="flex gap-4 p-4 rounded-2xl bg-orange-500/[0.03] border border-orange-500/10 text-[11px] font-bold text-zinc-500 leading-relaxed uppercase tracking-tight group hover:bg-orange-500/[0.05] transition-all">
                        <span className="text-orange-500/30 group-hover:text-orange-400 transition-colors">!</span> {risk}
                     </div>
                   ))}
                </div>
             </div>
          )}
          {assessment.merits.length > 0 && (
             <div className="space-y-4">
                <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-3">
                   <CheckCircle2 className="h-4 w-4" /> Fortalezas AM
                </div>
                <div className="space-y-3">
                   {assessment.merits.map((merit, i) => (
                     <div key={i} className="flex gap-4 p-4 rounded-2xl bg-emerald-500/[0.03] border border-emerald-500/10 text-[11px] font-bold text-zinc-300 leading-relaxed uppercase tracking-tight group hover:bg-emerald-500/[0.05] transition-all">
                        <CheckCircle2 className="h-3 w-3 text-emerald-500/30 group-hover:text-emerald-500 transition-colors" /> {merit}
                     </div>
                   ))}
                </div>
             </div>
          )}
       </div>

    </div>
  );
}
