import { motion } from 'framer-motion';
import { CubeAssemblyScene } from '../components/visualization/CubeAssemblyScene';
import { useCubeAnalysis } from '../hooks/useCubeAnalysis';
import { FlaskConical, ArrowLeft, Ruler, Layers, ShieldCheck, Box, Activity, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MetricCard } from '../components/ui/MetricCard';

export function AdvancedLabPage() {
  const { parameters, updateParameters } = useCubeAnalysis();

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans selection:bg-blue-500/30 overflow-x-hidden pb-24">
      {/* 1. Technical Navigation Header */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-[#050505]/80 backdrop-blur-md border-b border-white/5 py-4 px-8">
        <div className="container mx-auto max-w-7xl flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> 
            Volver al Panel Principal
          </Link>
          
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-2 group cursor-default">
               <FlaskConical className="h-5 w-5 text-blue-500 group-hover:rotate-12 transition-transform" />
               <span className="text-sm font-black uppercase tracking-[0.3em] text-white">Lab Avanzado <span className="text-blue-500">v1.2</span></span>
             </div>
          </div>

          <div className="flex items-center gap-4">
             {/* Conceptual simulation indicators */}
             <div className="hidden md:flex items-center gap-4 text-[10px] font-mono text-zinc-600">
                <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-blue-500/50" /> CLIPPING: READY</span>
                <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500/50" /> FEA: STANDBY</span>
             </div>
          </div>
        </div>
      </nav>

      {/* 2. Laboratory Main Content */}
      <main className="container mx-auto max-w-7xl pt-28 px-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Technical Controls */}
        <div className="lg:col-span-4 flex flex-col gap-8">
           <div className="flex flex-col gap-1">
              <h2 className="text-3xl font-black text-white uppercase tracking-tight">Geometría <span className="text-blue-500">Analítica</span></h2>
              <p className="text-sm text-zinc-500 leading-relaxed max-w-sm">
                Inspección profunda de la arquitectura interna del sistema cúbico de 5x5x5 cm.
              </p>
           </div>

           {/* Dimensional Section */}
           <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-400 flex items-center gap-2">
                <Ruler className="h-3 w-3" /> Cotas y Superficie
              </h3>
              
              <div className="space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[9px] uppercase font-bold text-zinc-600 tracking-tighter">Espesor de Pared (cm)</label>
                       <input 
                         type="number" step="0.01" 
                         value={parameters.shellThickness}
                         onChange={(e) => updateParameters({ shellThickness: parseFloat(e.target.value) })}
                         className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white outline-none focus:border-blue-500/50"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] uppercase font-bold text-zinc-600 tracking-tighter">Padding Interno (cm)</label>
                       <input 
                         type="number" step="0.01" 
                         value={parameters.internalPadding}
                         onChange={(e) => updateParameters({ internalPadding: parseFloat(e.target.value) })}
                         className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white outline-none focus:border-blue-500/50"
                       />
                    </div>
                 </div>
              </div>
           </div>

           {/* Slicing & Visual States (Placeholder for Lab Page expansion) */}
           <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                <Layers className="h-3 w-3" /> Slicing Engine (Proximamente)
              </h3>
              <div className="h-1 bg-zinc-800/50 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "65%" }}
                  className="h-full bg-blue-500/30" 
                />
              </div>
              <p className="text-[11px] text-zinc-600 leading-relaxed italic">
                El motor de corte por capas está siendo migrado a un worker independiente para optimizar la visualización de trayectorias.
              </p>
           </div>

           {/* Structural Metadata */}
           <div className="flex flex-col gap-4 mt-auto">
              <div className="flex items-center gap-3 p-4 rounded-xl border border-white/5 bg-emerald-500/5 text-emerald-400/80 text-[10px] font-bold uppercase tracking-widest leading-none">
                 <ShieldCheck className="h-4 w-4" /> Estructura Validada Conceptualmente
              </div>
           </div>
        </div>

        {/* Right Column: Dynamic Visualization Lab */}
        <div className="lg:col-span-8 flex flex-col gap-8">
           {/* Lab Viewport */}
           <div className="relative rounded-[2.5rem] border border-white/5 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-black h-[70vh]">
              <CubeAssemblyScene parameters={{ ...parameters, visualMode: parameters.visualMode }} />
              
              {/* Overlay Tools (Conceptual) */}
              <div className="absolute top-8 right-8 flex flex-col gap-3">
                 <button className="h-10 w-10 flex items-center justify-center rounded-xl border border-white/10 bg-black/40 text-zinc-400 hover:text-white transition-all backdrop-blur-md">
                   <Box className="h-4 w-4" />
                 </button>
              </div>
           </div>

           {/* Metrics Grid */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricCard 
                label="Continuidad"
                value="B+"
                icon={<Activity className="h-4 w-4" />}
                description="Alineación relativa en trayectorias de carga vertical."
              />
              <MetricCard 
                label="Complejidad"
                value="ALTA"
                icon={<TrendingUp className="h-4 w-4" />}
                description="Densidad de polígonos y complejidad de nodos internos."
              />
              <MetricCard 
                label="Estado Modelo"
                value="MOCK"
                icon={<FlaskConical className="h-4 w-4" />}
                description="Modo de inferencia del laboratorio actual."
              />
           </div>
        </div>

      </main>
    </div>
  );
}
