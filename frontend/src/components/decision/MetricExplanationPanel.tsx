import { Info, HelpCircle } from 'lucide-react';
import { METRIC_DEFINITIONS } from '../../lib/metricInterpretation';

export function MetricExplanationPanel() {
  return (
    <div className="flex flex-col gap-6 rounded-[2rem] border border-white/5 bg-zinc-900/40 p-8 shadow-2xl backdrop-blur-xl h-full">
      <div className="flex items-center justify-between mb-2">
         <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/20 text-orange-400">
               <HelpCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">¿Qué significa esto?</h3>
              <p className="text-[10px] text-zinc-500 font-medium">Guía de Interpretación Técnica</p>
            </div>
         </div>
         <Info className="h-4 w-4 text-zinc-600" />
      </div>

      <div className="space-y-6 divide-y divide-white/[0.03]">
        {Object.values(METRIC_DEFINITIONS).map((m, i) => (
          <div key={i} className="pt-6 first:pt-0 group">
            <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-300 mb-2 group-hover:text-blue-400 transition-colors">
               {m.label}
            </h4>
            <p className="text-[12px] text-zinc-200 font-medium leading-relaxed mb-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
              {m.meaning}
            </p>
            <p className="text-[11px] text-zinc-400 italic leading-relaxed">
              Importancia: {m.relevance}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-white/5">
        <p className="text-[10px] text-zinc-600 font-medium leading-relaxed italic max-w-sm">
          Recuerda: Los valores son estimaciones conceptuales basadas en modelos heurísticos validados 
          experimentalmente para probetas 5x5x5 cm.
        </p>
      </div>
    </div>
  );
}
