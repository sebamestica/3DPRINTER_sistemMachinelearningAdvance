import { motion } from 'framer-motion';
import { ArrowRight, Zap, Target, Activity } from 'lucide-react';
import type { ObjectiveType, BaselineConfig } from '../../lib/baselineGenerator';

interface BaselineInfoCardProps {
  objective: ObjectiveType;
  config: BaselineConfig;
  onAnalyze: () => void;
}

export function BaselineInfoCard({ objective, config, onAnalyze }: BaselineInfoCardProps) {
  const meta: Record<ObjectiveType, { title: string; color: string; icon: any }> = {
    resistance: { title: 'High Resistance Protocol', color: 'blue', icon: Target },
    absorption: { title: 'Energy Absorption Max', color: 'orange', icon: Zap },
    balance: { title: 'Optimal Structural Balance', color: 'emerald', icon: Activity }
  };

  const { title, color, icon: ObjectiveIcon } = meta[objective];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-10 rounded-[3rem] bg-black border border-white/[0.03] space-y-10 relative overflow-hidden backdrop-blur-3xl shadow-3xl"
    >
       <div className={`absolute -right-20 -top-20 h-64 w-64 bg-${color}-500/10 blur-[100px] pointer-events-none rounded-full animate-pulse`} />
       
       <header className="space-y-6">
          <div className="flex items-center gap-6">
             <div className={`h-14 w-14 rounded-2xl bg-${color}-500/10 text-${color}-500 flex items-center justify-center border border-${color}-500/20`}>
                <ObjectiveIcon className="h-8 w-8" />
             </div>
             <div className="flex flex-col">
                <span className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500">Configuración Base Cargada</span>
                <span className="text-2xl font-black text-white uppercase tracking-tight italic drop-shadow-lg">{title}</span>
             </div>
          </div>
       </header>

       <div className="space-y-8">
          <div className="grid grid-cols-2 gap-4">
             {[
               { label: 'Geometría', value: config.geometry },
               { label: 'Material', value: config.material },
               { label: 'Infill Base', value: config.infill + '%' },
               { label: 'Densidad LOD', value: (config.cellSize * 10).toFixed(0) + ' Units' }
             ].map((item, i) => (
               <div key={i} className="px-6 py-5 rounded-[2rem] bg-white/[0.04] border border-white/5 space-y-2 hover:bg-white/[0.06] transition-all">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">{item.label}</span>
                  <div className="text-lg font-black text-white/90 uppercase italic tracking-tighter">{item.value}</div>
               </div>
             ))}
          </div>
          
          <div className="p-6 rounded-2xl bg-white/5 border-l-4 border-blue-600">
             <p className="text-[12px] md:text-sm text-zinc-400 uppercase leading-relaxed italic tracking-tight font-medium">
               "Protocolo validado para maximizar {objective === 'resistance' ? 'la resistencia a la fractura' : objective === 'absorption' ? 'la disipación de energía por volumen' : 'la eficiencia peso-resistencia'}."
             </p>
          </div>
       </div>

       <button 
         onClick={onAnalyze}
         className={`w-full group py-6 rounded-[2.5rem] bg-blue-600 text-white flex items-center justify-center gap-5 hover:bg-blue-500 transition-all font-black uppercase text-sm tracking-[0.3em] shadow-2xl shadow-blue-900/40 active:scale-[0.98]`}
       >
          <span>Realizar Primer Análisis</span>
          <ArrowRight className="h-5 w-5 group-hover:translate-x-1.5 transition-transform" />
       </button>
    </motion.div>
  );
}
