import { useMemo, useEffect } from 'react';
import { WorkspaceShell } from '../components/layout/WorkspaceShell';
import { WorkflowHeader, WorkflowBlockerModal } from '../components/layout/WorkflowHeader';
import { LeftPanel } from '../components/layout/LeftPanel';
import { RightPanel } from '../components/layout/RightPanel';
import { BottomDock } from '../components/layout/BottomDock';
import { PrintableCubeScene } from '../components/preview/PrintableCubeScene';
import { ModelConfidenceHUD } from '../components/controls/ModelConfidenceHUD';
import { useCubeDesign } from '../hooks/useCubeDesign';
import { runSimulation } from '../lib/scoring';
import { useWorkflowStore, useSimulationStore, useUIStore } from '../store';
import { startPerformanceMonitor } from '../store/render';
import { ProtocolModal } from '../components/modals/ProtocolModal';

/**
 * HOME PAGE - STUDIO WORKSPACE
 * Main design and simulation workspace with functional workflow
 */

export function HomePage() {
  const { parameters, preview, updateParameters, updatePreview } = useCubeDesign();
  const { currentStage, goToStage } = useWorkflowStore();
  const { runSimulation: runSim, status: simStatus } = useSimulationStore();
  const { activeModal } = useUIStore();

  // Start performance monitor on mount
  useEffect(() => {
    startPerformanceMonitor();
  }, []);

  // Dynamic simulation engine
  const results = useMemo(() => runSimulation(parameters), [parameters]);

  // Auto-run simulation when entering simulate stage
  useEffect(() => {
    if (currentStage === 'simulate' && simStatus === 'idle') {
      runSim();
    }
  }, [currentStage, simStatus, runSim]);

  return (
    <>
      <WorkspaceShell
        header={<WorkflowHeader />}
        leftPanel={<LeftPanel parameters={parameters} updateParams={updateParameters} />}
        rightPanel={
          <div className="space-y-4 overflow-y-auto">
            <RightPanel parameters={parameters} results={results} />
          </div>
        }
        bottomDock={<BottomDock preview={preview} updatePreview={updatePreview} />}
      >
        {/* THE VIEWPORT STAGE */}
        <div className="w-full h-full relative cursor-crosshair">
          <PrintableCubeScene
            parameters={parameters}
            preview={preview}
          />
          
          <ModelConfidenceHUD />

          {/* TECHNICAL HUD STATUS */}
          <div className="absolute top-10 left-10 pointer-events-none group px-6 py-4 rounded-3xl bg-black/60 backdrop-blur-3xl border border-white/10 space-y-2 shadow-3xl">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 group-hover:text-blue-500 transition-colors">
              Workspace: Digital Prototyping
            </h2>
            <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <span className="text-xl font-black text-white italic tracking-tighter uppercase tabular-nums">
                   50×50×50 mm
                </span>
                <span className="text-[9px] font-bold text-zinc-800 uppercase tracking-widest leading-none">
                  Dimensions LOD_1:1
                </span>
              </div>
              <div className="h-6 w-px bg-white/10" />
              <div className="flex flex-col">
                <span className="text-xl font-black text-white italic tracking-tighter uppercase leading-none">
                  {parameters.geometry || 'Gyroid'}
                </span>
                <span className="text-[9px] font-bold text-blue-500 uppercase tracking-widest mt-1">
                  Active Architecture
                </span>
              </div>
            </div>

            {/* Stage indicator */}
            <div className="pt-2 border-t border-white/5 mt-2">
              <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">
                Stage: {currentStage.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="absolute bottom-10 right-10 flex items-center gap-3">
            <button
              onClick={() => goToStage('simulate')}
              className="h-12 px-6 rounded-xl bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20"
            >
              Run Simulation
            </button>
          </div>

          {/* GRID ENGINE WATERMARK (SVG) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.05]">
            <pattern id="grid-main-v2" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid-main-v2)" />
          </svg>
        </div>
      </WorkspaceShell>

      {/* Modals */}
      <WorkflowBlockerModal />
      {activeModal === 'protocol' && <ProtocolModal />}
    </>
  );
}
