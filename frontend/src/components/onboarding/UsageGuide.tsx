import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';

export function UsageGuide() {
  const [isOpen, setIsOpen] = useState(true);

  const steps = [
    { title: 'Define el objetivo del análisis', desc: 'Indica si buscas carga máxima o absorción de energía.' },
    { title: 'Observa la configuración base', desc: 'Cargada automáticamente según la mejor evidencia.' },
    { title: 'Ajusta parámetros y analiza', desc: 'Modifica geometría, infill y densidades en tiempo real.' },
    { title: 'Selecciona variante óptima', desc: 'Compara y valida antes de iniciar la fabricación (vía Advanced Lab).' }
  ];

  return (
    <div className="bg-white/[0.03] border border-white/5 rounded-3xl overflow-hidden backdrop-blur-xl">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 px-10 hover:bg-white/[0.02] transition-colors"
      >
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">¿Cómo usar la plataforma?</span>
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-10 pb-10 space-y-6"
          >
            {steps.map((step, i) => (
              <div key={i} className="flex gap-4 items-start border-l border-white/5 pl-6 py-2">
                 <div className="h-4 w-4 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center shrink-0 mt-1">
                    <CheckCircle className="h-2.5 w-2.5" />
                 </div>
                 <div className="flex flex-col">
                    <span className="text-xs font-black text-white/80 uppercase tracking-tighter">{step.title}</span>
                    <p className="text-[10px] text-zinc-600 uppercase mt-1 italic tracking-widest">{step.desc}</p>
                 </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
