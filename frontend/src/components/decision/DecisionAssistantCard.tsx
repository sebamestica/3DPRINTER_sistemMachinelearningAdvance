import { FlaskConical, ShieldCheck, AlertCircle, TrendingUp, HelpCircle, Box } from 'lucide-react';
import type { DecisionAssessment } from '../../types/decision';

const statusLabel: Record<DecisionAssessment['status'], string> = {
  strong: 'Candidato fuerte',
  promising: 'Candidato prometedor',
  validate: 'Requiere validación',
  weak: 'Candidato débil',
  'not-priority': 'No prioritario',
};

const statusColor: Record<DecisionAssessment['status'], string> = {
  strong: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/10',
  promising: 'text-blue-400 bg-blue-500/10 border-blue-500/20 shadow-blue-500/10',
  validate: 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20 shadow-zinc-500/10',
  weak: 'text-orange-400 bg-orange-500/10 border-orange-500/20 shadow-orange-500/10',
  'not-priority': 'text-red-400 bg-red-500/10 border-red-500/20 shadow-red-500/10',
};

interface Props {
  assessment: DecisionAssessment;
}

export function DecisionAssistantCard({ assessment }: Props) {
  return (
    <section className="relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-zinc-900/40 p-8 shadow-2xl backdrop-blur-xl h-full flex flex-col">
      {/* Structural Accent */}
      <div className="absolute top-0 right-0 h-32 w-32 -translate-y-1/2 translate-x-1/2 rounded-full bg-blue-500/5 blur-[60px]" />
      
      <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400">
               <FlaskConical className="h-4 w-4" />
             </div>
             <p className="text-[10px] font-black uppercase tracking-[0.22em] text-zinc-500">
               Lectura para Decisión Técnica
             </p>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight leading-none">
            {assessment.headline}
          </h3>
        </div>

        <div className={`shrink-0 flex items-center gap-2 rounded-2xl border px-5 py-2 text-[10px] font-black uppercase tracking-widest transition-all shadow-lg ${statusColor[assessment.status]}`}>
          <div className="h-1.5 w-1.5 rounded-full bg-current animate-pulse shadow-glow" />
          {statusLabel[assessment.status]}
        </div>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 grow">
        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className="flex items-center gap-2 text-[11px] font-black text-emerald-400/80 uppercase tracking-widest">
              <ShieldCheck className="h-3.5 w-3.5" /> Fortalezas de Diseño
            </h4>
            <ul className="space-y-3">
              {assessment.strengths.map((item, i) => (
                <li key={i} className="flex gap-4 text-sm text-zinc-100 leading-relaxed font-medium group">
                  <span className="text-emerald-500 font-black shrink-0">•</span>
                  <span className="opacity-90 group-hover:opacity-100 transition-opacity">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="flex items-center gap-2 text-[11px] font-black text-orange-400/80 uppercase tracking-widest">
              <AlertCircle className="h-3.5 w-3.5" /> Riesgos / Advertencias
            </h4>
            <ul className="space-y-3">
              {assessment.warnings.map((item, i) => (
                <li key={i} className="flex gap-4 text-sm text-zinc-300 leading-relaxed group italic">
                  <span className="text-orange-500 font-black shrink-0">•</span>
                  <span className="opacity-80 group-hover:opacity-100 transition-opacity">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-8 bg-black/20 rounded-[2rem] p-6 border border-white/5">
          <div className="space-y-4">
            <h4 className="flex items-center gap-2 text-[11px] font-black text-blue-400/80 uppercase tracking-widest">
              <TrendingUp className="h-3.5 w-3.5" /> Siguiente Acción Sugerida
            </h4>
            <div className="space-y-4">
              {assessment.nextActions.map((item, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-zinc-300 font-medium leading-relaxed">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="flex items-center gap-2 text-[11px] font-black text-indigo-400/80 uppercase tracking-widest">
              <Box className="h-3.5 w-3.5" /> Estudiar Geometría Alterna
            </h4>
            <div className="space-y-3">
              {assessment.compareNext.map((item, i) => (
                <div key={i} className="text-xs text-zinc-500 leading-relaxed flex items-start gap-2">
                   <div className="h-1 w-1 bg-indigo-500 mt-1.5 shrink-0" />
                   {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-white/5 flex items-center justify-between gap-8">
        <p className="text-[10px] text-zinc-600 font-medium leading-relaxed max-w-lg italic">
          <HelpCircle className="h-3 w-3 inline mr-1 opacity-50" />
          Fundamento: {assessment.rationale}
        </p>
        <button className="h-9 items-center gap-2 rounded-xl bg-white/5 px-5 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:bg-white/10 hover:text-white transition-all hidden md:flex">
           Guardar Hallazgo
        </button>
      </div>
    </section>
  );
}
