import { AlertTriangle, CheckCircle, Info, ArrowRight, ShieldAlert, Award } from 'lucide-react';
import type { RecommendationResult, RecommendationLevel } from '../../types/recommendation';
import { cn } from '../../lib/utils';

interface RecommendationCardProps {
  recommendation: RecommendationResult;
}

const getLevelStatus = (level: RecommendationLevel) => {
  switch (level) {
    case 'optimal': return { icon: <Award className="h-4 w-4" />, color: 'text-green-500', bg: 'bg-green-500/10', label: 'OPTIMAL' };
    case 'favorable': return { icon: <CheckCircle className="h-4 w-4" />, color: 'text-blue-500', bg: 'bg-blue-500/10', label: 'FAVORABLE' };
    case 'risky': return { icon: <AlertTriangle className="h-4 w-4" />, color: 'text-amber-500', bg: 'bg-amber-500/10', label: 'RISKY' };
    case 'not-recommended': return { icon: <ShieldAlert className="h-4 w-4" />, color: 'text-red-500', bg: 'bg-red-500/10', label: 'CRITICAL' };
    default: return { icon: <Info className="h-4 w-4" />, color: 'text-zinc-500', bg: 'bg-zinc-500/10', label: 'MODERATE' };
  }
};

export function RecommendationCard({ recommendation }: RecommendationCardProps) {
  const status = getLevelStatus(recommendation.level);

  return (
    <div className="flex flex-col gap-6 rounded-3xl border border-white/5 bg-zinc-900/40 p-10 shadow-3xl backdrop-blur-2xl">
      <div className="flex items-center justify-between border-b border-white/5 pb-6">
         <div className="flex items-center gap-3">
            <div className={cn("flex h-10 w-10 items-center justify-center rounded-2xl shadow-lg", status.bg, status.color)}>
               {status.icon}
            </div>
            <div>
               <div className={cn("text-[10px] font-black tracking-widest uppercase", status.color)}>{status.label}</div>
               <h3 className="text-xl font-black tracking-tight text-white uppercase">Soporte de Decisión</h3>
            </div>
         </div>
      </div>

      <div className="space-y-8">
        {/* Main Recommendation */}
        <p className="text-lg font-medium leading-relaxed text-zinc-300">
           {recommendation.primaryRecommendation}
        </p>

        {/* Technical Reasons */}
        <div className="space-y-4">
           <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Razones Técnicas</h4>
           <div className="flex flex-col gap-3">
              {recommendation.technicalReasons.map((reason, i) => (
                 <div key={i} className="flex items-start gap-4">
                    <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shadow-glow" />
                    <p className="text-sm leading-relaxed text-zinc-400">{reason}</p>
                 </div>
              ))}
           </div>
        </div>

        {/* Warnings */}
        {recommendation.warnings.length > 0 && (
          <div className="space-y-4">
             <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Advertencias de Diseño</h4>
             <div className="flex flex-col gap-3">
                {recommendation.warnings.map((warning, i) => (
                   <div key={i} className={cn(
                     "rounded-2xl border p-4",
                     warning.severity === 'high' ? "border-red-500/20 bg-red-500/5" : "border-amber-500/20 bg-amber-500/5"
                   )}>
                      <div className="flex items-center gap-2 mb-2">
                         <AlertTriangle className={cn("h-3 w-3", warning.severity === 'high' ? "text-red-500" : "text-amber-500")} />
                         <span className={cn("text-[10px] font-black uppercase", warning.severity === 'high' ? "text-red-500" : "text-amber-500")}>
                            Severidad {warning.severity}
                         </span>
                      </div>
                      <p className="text-xs leading-relaxed text-zinc-300">{warning.message}</p>
                      {warning.parameterImpact && <p className="mt-2 text-[10px] font-bold text-zinc-500 italic uppercase">Acción: {warning.parameterImpact}</p>}
                   </div>
                ))}
             </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="space-y-4">
           <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Siguiente Acción Recomendada</h4>
           <div className="flex flex-col gap-3">
              {recommendation.nextSteps.map((step, i) => (
                 <div key={i} className="group flex items-center gap-4 rounded-xl border border-white/5 bg-white/5 p-4 transition-all hover:bg-white/10">
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-zinc-800 text-zinc-500 group-hover:bg-primary group-hover:text-white transition-colors">
                       <ArrowRight className="h-3 w-3" />
                    </div>
                    <p className="text-xs font-bold text-zinc-400 group-hover:text-white transition-colors">{step}</p>
                 </div>
              ))}
           </div>
        </div>
      </div>

      <div className="mt-auto border-t border-white/5 pt-8">
         <div className="flex items-center justify-between rounded-2xl bg-black/40 p-6">
            <div>
               <div className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Recomendación Final</div>
               <div className="mt-1 text-sm font-black text-white italic uppercase tracking-tighter">
                  {recommendation.prototypeRecommendation ? "APROBADO PARA PROTOTIPO" : "PENDIENTE DE AJUSTES"}
               </div>
            </div>
            <div className={cn(
              "h-4 w-4 rounded-full shadow-glow",
              recommendation.prototypeRecommendation ? "bg-green-500 shadow-green-500/40" : "bg-red-500 shadow-red-500/40"
            )} />
         </div>
      </div>
    </div>
  );
}
