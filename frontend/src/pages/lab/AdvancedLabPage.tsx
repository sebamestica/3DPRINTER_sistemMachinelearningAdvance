/**
 * ADVANCED TEST LAB - MAIN PAGE
 * Dedicated workspace for experimental design and validation
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Activity, FlaskConical, Target, AlertTriangle, FileDown,
  ChevronRight, Play, Pause, RotateCcw, Download, Share2, Settings,
  Beaker, TrendingUp, Shield, Microscope, Layers, Zap, BarChart3
} from 'lucide-react';
import { useProductStore, useSimulationStore, useUIStore } from '../../store';
import { ExperimentalDesignPanel } from './modules/ExperimentalDesignPanel';
import { MechanicalProtocolsPanel } from './modules/MechanicalProtocolsPanel';
import { ValidationPanel } from './modules/ValidationPanel';
import { FailureAnalysisPanel } from './modules/FailureAnalysisPanel';
import { ExportPanel } from './modules/ExportPanel';

type LabModule = 'experimental' | 'protocols' | 'validation' | 'failure' | 'export';

const MODULES: Record<LabModule, {
  label: string;
  icon: React.ReactNode;
  description: string;
}> = {
  experimental: {
    label: 'Experimental Design',
    icon: <Beaker className="h-4 w-4" />,
    description: 'Design test matrices and sample configurations'
  },
  protocols: {
    label: 'Mechanical Protocols',
    icon: <Activity className="h-4 w-4" />,
    description: 'Configure compression, tension, flexion tests'
  },
  validation: {
    label: 'Validation & Calibration',
    icon: <Shield className="h-4 w-4" />,
    description: 'Model metrics and domain coverage'
  },
  failure: {
    label: 'Failure Analysis',
    icon: <AlertTriangle className="h-4 w-4" />,
    description: 'Predict failure modes and stress concentrations'
  },
  export: {
    label: 'Export & Research',
    icon: <FileDown className="h-4 w-4" />,
    description: 'Generate reports and technical documentation'
  }
};

export function AdvancedLabPage() {
  const [activeModule, setActiveModule] = useState<LabModule>('experimental');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { prediction, status, runSimulation } = useSimulationStore();
  const { addToast } = useUIStore();

  const handleRunSimulation = async () => {
    addToast({
      type: 'info',
      message: 'Starting simulation...'
    });
    await runSimulation();
    if (status === 'complete') {
      addToast({
        type: 'success',
        message: 'Simulation complete'
      });
    }
  };

  return (
    <div className="h-screen w-screen bg-[#050505] text-zinc-300 font-sans overflow-hidden flex flex-col antialiased">
      {/* HEADER */}
      <header className="h-14 shrink-0 bg-black/40 backdrop-blur-3xl border-b border-white/[0.05] flex items-center justify-between px-6 z-50">
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="group flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-all"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="hidden md:inline">Studio</span>
          </Link>

          <div className="h-4 w-px bg-white/10" />

          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(147,51,234,0.3)]">
              <FlaskConical className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-xs font-black uppercase tracking-widest text-white leading-none">
                Advanced Test Lab
              </h1>
              <p className="text-[9px] font-bold text-zinc-600 uppercase mt-0.5 tracking-[0.2em]">
                Experimental Validation Suite v2.0
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="h-8 px-3 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-all"
          >
            {sidebarOpen ? 'Hide' : 'Show'} Sidebar
          </button>
          <button
            onClick={handleRunSimulation}
            disabled={status === 'running'}
            className="h-8 px-4 flex items-center gap-2 rounded-lg bg-purple-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-purple-500 transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50"
          >
            {status === 'running' ? (
              <>
                <Pause className="h-3.5 w-3.5" /> Running...
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5" /> Run Analysis
              </>
            )}
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* SIDEBAR NAVIGATION */}
        <AnimatePresence initial={false}>
          {sidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 240, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="h-full shrink-0 border-r border-white/5 bg-[#080808] flex flex-col z-40"
            >
              <nav className="p-4 space-y-1">
                {(Object.entries(MODULES) as [LabModule, typeof MODULES.experimental][]).map(([id, module]) => (
                  <motion.button
                    key={id}
                    onClick={() => setActiveModule(id)}
                    className={`
                      w-full p-3 rounded-xl flex items-center gap-3 text-left transition-all
                      ${activeModule === id
                        ? 'bg-purple-600/10 border border-purple-500/20 text-white'
                        : 'hover:bg-white/5 text-zinc-500 hover:text-zinc-300'
                      }
                    `}
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={`p-1.5 rounded-lg ${
                      activeModule === id ? 'bg-purple-500/20 text-purple-400' : 'bg-zinc-800 text-zinc-600'
                    }`}>
                      {module.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-widest block truncate">
                        {module.label}
                      </span>
                    </div>
                    {activeModule === id && (
                      <ChevronRight className="h-3.5 w-3.5 text-purple-500" />
                    )}
                  </motion.button>
                ))}
              </nav>

              {/* Quick Stats */}
              <div className="mt-auto p-4 border-t border-white/5">
                <div className="p-3 rounded-xl bg-zinc-900/50 space-y-2">
                  <div className="flex items-center justify-between text-[9px]">
                    <span className="text-zinc-600 uppercase tracking-widest">Status</span>
                    <span className={`font-bold ${
                      status === 'complete' ? 'text-emerald-500' :
                      status === 'running' ? 'text-amber-500' : 'text-zinc-500'
                    }`}>
                      {status.toUpperCase()}
                    </span>
                  </div>
                  {prediction && (
                    <div className="flex items-center justify-between text-[9px]">
                      <span className="text-zinc-600 uppercase tracking-widest">Yield</span>
                      <span className="text-white font-mono">{prediction.yieldEstimate} MPa</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeModule}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {activeModule === 'experimental' && <ExperimentalDesignPanel />}
              {activeModule === 'protocols' && <MechanicalProtocolsPanel />}
              {activeModule === 'validation' && <ValidationPanel />}
              {activeModule === 'failure' && <FailureAnalysisPanel />}
              {activeModule === 'export' && <ExportPanel />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}