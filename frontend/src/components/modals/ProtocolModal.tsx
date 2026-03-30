/**
 * PROTOCOL MODAL
 * Technical inspection modal
 */

import { motion, AnimatePresence } from 'framer-motion';
import { Microscope, X } from 'lucide-react';
import { useUIStore, useSimulationStore, useProductStore } from '../../store';

export function ProtocolModal() {
  const { closeModal } = useUIStore();
  const { prediction, metrics, status } = useSimulationStore();
  const { architecture, material, dimensions } = useProductStore();

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
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] bg-[#080808] border border-white/10 rounded-[2rem] p-8 z-50 shadow-3xl"
      >
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-blue-600/10 text-blue-500 flex items-center justify-center">
              <Microscope className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">
                Protocolo de Inspección Técnica
              </span>
              <h2 className="text-xl font-black text-white uppercase italic tracking-tight">
                Module Analyzer v4.2.0
              </h2>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-2 rounded-lg hover:bg-white/5 text-zinc-600 hover:text-white transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="space-y-6">
          <p className="text-sm text-zinc-400 leading-relaxed">
            Evaluando arquitectura interna bajo estándares de manufactura de alta resolución.
            Este protocolo detecta discrepancias entre el modelo predictivo y la factibilidad física.
          </p>

          {/* Configuration */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/5">
              <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-600 block mb-1">
                Architecture
              </span>
              <span className="text-sm font-bold text-white uppercase">{architecture}</span>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/5">
              <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-600 block mb-1">
                Material
              </span>
              <span className="text-sm font-bold text-white">{material}</span>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/5">
              <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-600 block mb-1">
                Dimensions
              </span>
              <span className="text-sm font-bold text-white font-mono">
                {dimensions.x}×{dimensions.y}×{dimensions.z} mm
              </span>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/5">
              <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-600 block mb-1">
                Status
              </span>
              <span className={`text-sm font-bold uppercase ${
                status === 'complete' ? 'text-emerald-500' :
                status === 'running' ? 'text-amber-500' : 'text-zinc-500'
              }`}>
                {status}
              </span>
            </div>
          </div>

          {/* Prediction Results */}
          {prediction && (
            <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
              <span className="text-[9px] font-bold uppercase tracking-widest text-blue-500 block mb-3">
                Latest Prediction
              </span>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <span className="text-2xl font-black text-white">{prediction.yieldEstimate}</span>
                  <span className="text-xs text-zinc-500 ml-1">MPa</span>
                </div>
                <div>
                  <span className="text-lg font-bold text-white">{prediction.domainFit}%</span>
                  <span className="text-[9px] text-zinc-600 block">Domain Fit</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-white uppercase">{prediction.mode}</span>
                  <span className="text-[9px] text-zinc-600 block">Mode</span>
                </div>
              </div>
            </div>
          )}

          {/* Model Metrics */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'MAE', value: metrics.mae },
              { label: 'RMSE', value: metrics.rmse },
              { label: 'R²', value: metrics.r2 },
              { label: 'MAPE', value: `${metrics.mape}%` }
            ].map((m) => (
              <div key={m.label} className="p-3 rounded-xl bg-zinc-900/50 text-center">
                <span className="text-xs font-black text-white block">{m.value}</span>
                <span className="text-[8px] text-zinc-600 uppercase">{m.label}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={closeModal}
          className="w-full h-12 mt-6 rounded-xl bg-blue-600 text-white text-xs font-black uppercase tracking-[0.2em] hover:bg-blue-500 transition-all"
        >
          Cerrar Análisis
        </button>
      </motion.div>
    </AnimatePresence>
  );
}