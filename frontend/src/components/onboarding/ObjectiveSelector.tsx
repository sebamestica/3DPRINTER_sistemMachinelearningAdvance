import { motion } from 'framer-motion';
import { Target, Zap, Activity } from 'lucide-react';
import type { ObjectiveType } from '../../lib/baselineGenerator';

interface ObjectiveSelectorProps {
  onSelect: (objective: ObjectiveType) => void;
}

export function ObjectiveSelector({ onSelect }: ObjectiveSelectorProps) {
  const options: { id: ObjectiveType; label: string; icon: any; desc: string; color: string }[] = [
    { 
      id: 'resistance', 
      label: 'Priorizar Resistencia', 
      icon: Target, 
      desc: 'Optimizar para máxima carga soportada antes del fallo estructural.',
      color: 'blue'
    },
    { 
      id: 'absorption', 
      label: 'Priorizar Absorción', 
      icon: Zap, 
      desc: 'Optimizar para disipar energía y deformación elástica controlada.',
      color: 'orange'
    },
    { 
      id: 'balance', 
      label: 'Buscar Equilibrio', 
      icon: Activity, 
      desc: 'Optimizar para un compromiso entre peso, coste y rendimiento mecánico.',
      color: 'emerald'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mx-auto">
      {options.map((opt) => (
        <motion.button
          key={opt.id}
          whileHover={{ y: -8, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(opt.id)}
          className={`flex flex-col items-center text-center p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 hover:border-${opt.color}-500/40 hover:bg-${opt.color}-500/[0.02] transition-all group`}
        >
          <div className={`h-16 w-16 rounded-[1.5rem] flex items-center justify-center bg-${opt.color}-500/10 text-${opt.color}-500 mb-6 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-shadow`}>
            <opt.icon className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-black text-white mb-3 uppercase tracking-tight">{opt.label}</h3>
          <p className="text-zinc-500 text-sm leading-relaxed">{opt.desc}</p>
        </motion.button>
      ))}
    </div>
  );
}
