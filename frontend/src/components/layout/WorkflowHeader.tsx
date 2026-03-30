/**
 * WORKFLOW HEADER - FUNCTIONAL NAVIGATION
 * Real state machine with guards and blockers
 */

import { Target, Microscope, ChevronRight, AlertTriangle, CheckCircle2, Lock, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkflowStore, useUIStore, useSimulationStore } from '../../store';
import type { Stage, StageStatus } from '../../domain/workflow/types';
import { STAGE_INFO } from '../../domain/workflow/types';

const STAGE_ICONS: Record<Stage, React.ReactNode> = {
  setup: <Clock className="h-3.5 w-3.5" />,
  design: <Target className="h-3.5 w-3.5" />,
  slicing: <div className="h-3.5 w-3.5 flex items-center justify-center text-[10px] font-black">SL</div>,
  simulate: <Microscope className="h-3.5 w-3.5" />,
  compare: <div className="h-3.5 w-3.5 flex items-center justify-center text-[10px] font-black">AB</div>,
  deploy: <div className="h-3.5 w-3.5 flex items-center justify-center text-[10px] font-black">EX</div>
};

const STATUS_COLORS: Record<StageStatus, string> = {
  locked: 'text-zinc-700',
  ready: 'text-zinc-400',
  warning: 'text-amber-500',
  complete: 'text-emerald-500',
  error: 'text-red-500'
};

const STATUS_BG: Record<StageStatus, string> = {
  locked: 'bg-zinc-800/50',
  ready: 'bg-zinc-800',
  warning: 'bg-amber-500/10',
  complete: 'bg-emerald-500/10',
  error: 'bg-red-500/10'
};

export function WorkflowHeader() {
  const {
    currentStage,
    statusByStage,
    validationByStage,
    goToStage
  } = useWorkflowStore();

  const { openModal } = useUIStore();
  const { status: simStatus } = useSimulationStore();

  const stages = Object.entries(STAGE_INFO) as [Stage, typeof STAGE_INFO[Stage]][];
  const currentIdx = stages.findIndex(([id]) => id === currentStage);

  const handleStageClick = (stageId: Stage) => {
    const status = statusByStage[stageId];
    const validation = validationByStage[stageId];

    if (status === 'locked') {
      // Show blocker modal
      openModal('workflow-blocked', {
        stage: stageId,
        blockers: validation.blockers,
        warnings: validation.warnings
      });
      return;
    }

    goToStage(stageId);
  };

  return (
    <div className="flex-1 flex items-center justify-between relative px-2">
      {/* 1. BRAND / PRODUCT LOGO */}
      <div className="flex items-center gap-10">
        <div
          className="flex items-center gap-4 group cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => handleStageClick('setup')}
        >
          <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)]">
            <Target className="h-6 w-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-[14px] font-black uppercase tracking-[0.4em] leading-none text-white">
              PLA Structural v4.2
            </span>
            <span className="text-[10px] font-bold text-zinc-600 uppercase mt-1 tracking-[0.2em]">
              Additive Design Lab
            </span>
          </div>
        </div>

        <div className="h-4 w-px bg-white/10 hidden xl:block" />

        {/* 2. WORKFLOW STEPS WITH REAL STATE */}
        <div className="flex items-center gap-2 lg:gap-4">
          {stages.map(([stageId, info], idx) => {
            const status = statusByStage[stageId];
            const validation = validationByStage[stageId];
            const isActive = idx <= currentIdx;
            const isCurrent = idx === currentIdx;
            const isLocked = status === 'locked';
            const hasWarnings = validation.warnings.length > 0;
            const hasBlockers = validation.blockers.length > 0;

            return (
              <div key={stageId} className="flex items-center gap-2">
                <motion.button
                  onClick={() => handleStageClick(stageId)}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg transition-all
                    ${isLocked ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-white/5'}
                    ${isCurrent ? STATUS_BG[status] : ''}
                  `}
                  whileHover={!isLocked ? { scale: 1.02 } : {}}
                  whileTap={!isLocked ? { scale: 0.98 } : {}}
                >
                  <div className="flex flex-col items-start">
                    <div className="flex items-center gap-2">
                      {/* Status indicator */}
                      {status === 'complete' && (
                        <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                      )}
                      {status === 'locked' && (
                        <Lock className="h-3 w-3 text-zinc-600" />
                      )}
                      {hasWarnings && status !== 'complete' && (
                        <AlertTriangle className="h-3 w-3 text-amber-500" />
                      )}

                      <span className={`
                        text-[9px] lg:text-[10px] font-black uppercase tracking-widest
                        ${STATUS_COLORS[status]}
                        ${isCurrent ? 'text-white' : ''}
                      `}>
                        {info.label}
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="relative h-0.5 w-full mt-1.5 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        className="absolute inset-y-0 left-0 bg-blue-600 rounded-full"
                        initial={{ width: 0 }}
                        animate={{
                          width: status === 'complete' ? '100%' :
                                 status === 'locked' ? '0%' :
                                 isCurrent ? '60%' : '0%'
                        }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                </motion.button>

                {/* Connector */}
                {idx < stages.length - 1 && (
                  <ChevronRight className={`
                    h-3 w-3 transition-colors
                    ${idx < currentIdx ? 'text-blue-600' : 'text-white/10'}
                  `} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. STATUS INDICATORS */}
      <div className="flex items-center gap-8">
        <div className="hidden lg:flex items-center gap-6 px-4 py-1.5 bg-white/[0.02] rounded-full border border-white/5 text-[8px] font-mono tracking-widest text-zinc-600 uppercase">
          <span className="flex items-center gap-2">
            <div className={`h-1 w-1 rounded-full shadow-[0_0_8px] ${
              simStatus === 'running' ? 'bg-amber-500 shadow-amber-500' :
              simStatus === 'complete' ? 'bg-emerald-500 shadow-emerald-500' :
              'bg-zinc-500'
            }`} />
            ENGINE: {simStatus.toUpperCase()}
          </span>
          <span className="flex items-center gap-2">
            <div className="h-1 w-1 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
            FEA-V: INJECTED
          </span>
        </div>

        <button
          onClick={() => openModal('protocol')}
          className="h-10 px-6 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:border-blue-500 transition-all active:scale-95 group shadow-xl"
        >
          <Microscope className="h-4 w-4 text-zinc-600 group-hover:text-blue-500 transition-colors" />
          Inspect Protocol
        </button>
      </div>
    </div>
  );
}

/**
 * BLOCKER MODAL
 * Shows why a stage is locked
 */
export function WorkflowBlockerModal() {
  const { activeModal, modalData, closeModal } = useUIStore();

  if (activeModal !== 'workflow-blocked') return null;

  const stage = modalData?.stage as Stage | undefined;
  const blockers = modalData?.blockers as string[] || [];
  const warnings = modalData?.warnings as string[] || [];
  const info = stage ? STAGE_INFO[stage] : null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeModal}
        className="fixed inset-0 bg-black/80 backdrop-blur-3xl z-50 cursor-pointer"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] bg-[#080808] border border-white/10 rounded-[2rem] p-10 z-50 shadow-3xl"
      >
        <header className="flex items-center gap-4 pb-6 border-b border-white/5">
          <div className="h-12 w-12 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center">
            <Lock className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">
              Stage Locked
            </span>
            <h2 className="text-xl font-black text-white uppercase">
              {info?.label || 'Unknown Stage'}
            </h2>
          </div>
        </header>

        <div className="py-6 space-y-6">
          {blockers.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-red-500">
                Requirements Missing
              </h3>
              <ul className="space-y-2">
                {blockers.map((blocker, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-zinc-400">
                    <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                    {blocker}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {warnings.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-amber-500">
                Warnings
              </h3>
              <ul className="space-y-2">
                {warnings.map((warning, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-zinc-400">
                    <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                    {warning}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <button
          onClick={closeModal}
          className="w-full h-12 rounded-xl bg-zinc-800 text-white text-xs font-black uppercase tracking-[0.2em] hover:bg-zinc-700 transition-all"
        >
          Understood
        </button>
      </motion.div>
    </AnimatePresence>
  );
}