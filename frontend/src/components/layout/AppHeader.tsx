import { Target, Microscope, ChevronRight, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useWorkflowStore, useUIStore } from '../../store';
import { STAGE_ORDER, STAGE_INFO } from '../../domain/workflow/types';
import type { Stage } from '../../domain/workflow/types';

/**
 * Technical Workspace Header
 * Fully integrated with the Engineering Workflow Store.
 */

export function AppHeader() {
  const [showModal, setShowModal] = useState(false);
  const { currentStage, statusByStage, goToStage, validationByStage } = useWorkflowStore();
  const { addToast } = useUIStore();

  const handleStepClick = (stageId: string) => {
    // Map string from STAGE_ORDER to Stage type safely
    const targetStage = stageId as Stage;
    const success = goToStage(targetStage);
    
    if (!success) {
      const validation = validationByStage[targetStage];
      if (validation?.blockers && validation.blockers.length > 0) {
        addToast({
          type: 'error',
          message: `Acceso Bloqueado: ${validation.blockers[0]}`,
          duration: 3000
        });
      }
    }
  };

  const getStatusColor = (stage: Stage) => {
    const status = statusByStage[stage];
    const isCurrent = currentStage === stage;

    if (isCurrent) return 'text-blue-500';
    if (status === 'complete') return 'text-emerald-500';
    if (status === 'warning') return 'text-amber-500';
    if (status === 'locked') return 'text-zinc-800';
    return 'text-zinc-500';
  };

  const getBarColor = (stage: Stage) => {
    const status = statusByStage[stage];
    const isCurrent = currentStage === stage;

    if (isCurrent) return 'bg-blue-600 shadow-[0_0_12px_#2563eb] w-full';
    if (status === 'complete') return 'bg-emerald-500 w-full';
    if (status === 'warning') return 'bg-amber-500 w-full';
    if (status === 'locked') return 'bg-white/5 w-2';
    return 'bg-white/10 w-full';
  };

  const getStatusIcon = (stage: Stage) => {
    const status = statusByStage[stage];
    if (status === 'locked') return <Lock className="h-2 w-2" />;
    if (status === 'warning') return <AlertCircle className="h-2 w-2" />;
    if (status === 'complete') return <CheckCircle2 className="h-2 w-2" />;
    return null;
  };

  return (
    <div className="flex-1 flex items-center justify-between relative px-2">
       
       {/* 1. BRAND / PRODUCT LOGO */}
       <div className="flex items-center gap-10">
          <div 
            className="flex items-center gap-4 group cursor-pointer hover:opacity-80 transition-opacity" 
            onClick={() => handleStepClick('setup')}
          >
             <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                <Target className="h-6 w-6 text-white" />
             </div>
             <div className="flex flex-col">
                <span className="text-[14px] font-black uppercase tracking-[0.4em] leading-none text-white">PLA Structural v4.2</span>
                <span className="text-[10px] font-bold text-zinc-600 uppercase mt-1 tracking-[0.2em]">Additive Design Lab</span>
             </div>
          </div>
          
          <div className="h-4 w-px bg-white/10 hidden xl:block" />

          {/* 2. DYNAMIC WORKFLOW INDICATOR */}
          <div className="flex items-center gap-8 lg:gap-14">
             {STAGE_ORDER.map((stageId, idx) => {
               const stage = STAGE_INFO[stageId];
               const isCurrent = currentStage === stageId;
               
               return (
                 <div 
                   key={stageId} 
                   className="flex items-center gap-4 group cursor-pointer" 
                   onClick={() => handleStepClick(stageId)}
                 >
                    <div className="flex flex-col items-center">
                       <div className="flex items-center gap-1.5 mb-1.5">
                          <span className={`text-[9px] lg:text-[10px] font-black uppercase tracking-widest transition-colors ${getStatusColor(stageId)}`}>
                             {stage.label}
                          </span>
                          <span className={getStatusColor(stageId)}>
                             {getStatusIcon(stageId)}
                          </span>
                       </div>
                       <div className={`h-1 rounded-full transition-all duration-700 ${getBarColor(stageId)}`} />
                    </div>
                    {idx < STAGE_ORDER.length - 1 && (
                      <ChevronRight className="h-3 w-3 text-white/5" />
                    )}
                 </div>
               );
             })}
          </div>
       </div>

       {/* 3. FUNCTIONAL ACTIONS */}
       <div className="flex items-center gap-8">
          <div className="hidden lg:flex items-center gap-6 px-4 py-1.5 bg-white/[0.02] rounded-full border border-white/5 text-[8px] font-mono tracking-widest text-zinc-600 uppercase">
             <span className="flex items-center gap-2 mr-2"><div className="h-1 w-1 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" /> ENGINE: ACTIVE</span>
             <span className="flex items-center gap-2"><div className="h-1 w-1 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" /> FEA-V: INJECTED</span>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="h-10 px-6 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:border-blue-500 transition-all active:scale-95 group shadow-xl"
          >
             <Microscope className="h-4 w-4 text-zinc-600 group-hover:text-blue-500 transition-colors" />
             Inspect Protocol
          </button>
       </div>

       {/* TECHNICAL PROTOCOL MODAL */}
       <AnimatePresence>
          {showModal && (
            <>
               <motion.div 
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                 onClick={() => setShowModal(false)}
                 className="fixed inset-0 bg-black/80 backdrop-blur-3xl z-50 cursor-pointer"
               />
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
                 className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-fit bg-[#080808] border border-white/10 rounded-[3rem] p-12 z-50 shadow-3xl pointer-events-auto flex flex-col space-y-10"
               >
                  <header className="flex items-center gap-6 pb-6 border-b border-white/5">
                     <div className="h-14 w-14 rounded-2xl bg-blue-600/10 text-blue-500 flex items-center justify-center">
                        <Microscope className="h-8 w-8" />
                     </div>
                     <div className="flex flex-col">
                        <span className="text-xs font-black uppercase tracking-[0.4em] text-zinc-500">Protocolo de Inspección Técnica</span>
                        <span className="text-2xl font-black text-white uppercase italic tracking-tighter shadow-glow">Module Analyzer v4.2.0</span>
                     </div>
                  </header>

                  <div className="space-y-6">
                     <p className="text-sm font-bold text-zinc-400 uppercase tracking-tight italic leading-relaxed">
                        Evaluando arquitectura interna bajo estándares de manufactura de alta resolución. Este protocolo detecta discrepancias entre el modelo predictivo y la factibilidad física en el laboratorio.
                     </p>
                     
                     <div className="grid grid-cols-2 gap-4">
                        {[
                          { label: 'Baseline', val: 'Honeycomb Ref' },
                          { label: 'Sim-Engine', val: 'V4-Active' },
                          { label: 'Precision', val: '+/- 0.05MPa' },
                          { label: 'Validation', val: 'Empirical' }
                        ].map((m, i) => (
                          <div key={i} className="p-4 rounded-2xl bg-white/[0.04] border border-white/5 space-y-1">
                             <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">{m.label}</span>
                             <div className="text-[12px] font-black text-white italic truncate">{m.val}</div>
                          </div>
                        ))}
                     </div>
                  </div>

                  <button 
                    onClick={() => setShowModal(false)}
                    className="w-full h-16 rounded-[2rem] bg-blue-600 text-white text-xs font-black uppercase tracking-[0.3em] hover:bg-blue-500 transition-all active:scale-[0.98] shadow-2xl shadow-blue-900/40"
                  >
                     Entendido / Cerrar Análisis
                  </button>
               </motion.div>
            </>
          )}
       </AnimatePresence>

    </div>
  );
}
