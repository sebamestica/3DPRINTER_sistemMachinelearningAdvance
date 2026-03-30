/**
 * EXPERIMENTAL DESIGN MODULE
 * Technical Sample Management and Matrix Generation
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, Shuffle, CheckCircle2, AlertCircle, 
  Beaker, Grid3X3, Layers, Box, Settings2, Download 
} from 'lucide-react';
import type { MaterialType, ArchitectureType, OrientationType } from '../../../domain/product/types';
import type { ExperimentVariant, TestMatrix } from '../../../domain/lab/types';
import { useUIStore } from '../../../store';

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substring(2, 9);

export function ExperimentalDesignPanel() {
  const { addToast } = useUIStore();
  
  // 1. CONFIGURATION STATE
  const [config, setConfig] = useState<Omit<TestMatrix, 'id' | 'createdAt'>>({
    name: 'Standard Compression Matrix',
    materials: ['PLA'],
    architectures: ['gyroid'],
    infills: [20, 40, 60],
    strutThicknesses: [0.12, 0.15],
    orientations: ['xyz'],
    samplesPerVariant: 5
  });

  // 2. GENERATION LOGIC (MEMOIZED)
  const variants: ExperimentVariant[] = useMemo(() => {
    const list: ExperimentVariant[] = [];
    
    config.materials.forEach(mat => {
      config.architectures.forEach(arch => {
        config.infills.forEach(inf => {
          config.strutThicknesses.forEach(strut => {
            config.orientations.forEach(orient => {
              list.push({
                id: generateId(),
                label: `${mat}_${arch}_${inf}%_${strut}mm`,
                material: mat,
                architecture: arch,
                infill: inf,
                strutThickness: strut,
                orientation: orient,
                sampleCount: config.samplesPerVariant,
                status: 'pending'
              });
            });
          });
        });
      });
    });
    
    return list;
  }, [config]);

  const handleExport = () => {
    addToast({
      type: 'success',
      message: `Exportando ${variants.length} configuraciones de ensayo (CSV/JSON)`
    });
  };

  return (
    <div className="flex flex-col gap-8">
      
      {/* 1. HEADER SECTION */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center">
            <Beaker className="h-6 w-6 text-purple-500" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white uppercase tracking-tight">Diseño Experimental (DoE)</h2>
            <p className="text-xs text-zinc-600 uppercase tracking-widest mt-0.5">Generación de Matrices de Prototipado v3.0</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-zinc-900 border border-white/5 rounded-xl flex items-center gap-3">
             <span className="text-[10px] font-black text-zinc-600 uppercase">Total Combinaciones:</span>
             <span className="text-sm font-black text-purple-500 tabular-nums">{variants.length}</span>
          </div>
          <button 
            onClick={handleExport}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-all shadow-xl"
          >
             <Download className="h-3.5 w-3.5" /> Export Matrix
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-full">
        
        {/* 2. PARAMETERS CONFIGRATION (SIDE) */}
        <div className="lg:col-span-1 space-y-6 max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
           
           {/* Section 1: Materials */}
           <div className="space-y-4 p-5 bg-zinc-950 border border-white/5 rounded-2xl">
              <div className="flex items-center gap-2 text-zinc-500 border-b border-white/5 pb-3 mb-4">
                 <Settings2 className="h-3.5 w-3.5" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Parámetros de Entrada</span>
              </div>

              <div className="space-y-4">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Materiales (Multi)</label>
                <div className="flex flex-wrap gap-2">
                   {['PLA', 'ABS', 'PETG', 'TPU'].map(m => (
                     <button 
                       key={m}
                       onClick={() => setConfig(prev => ({
                         ...prev,
                         materials: prev.materials.includes(m as MaterialType) 
                           ? prev.materials.filter(x => x !== m) 
                           : [...prev.materials, m as MaterialType]
                       }))}
                       className={`px-3 py-1.5 rounded-lg border text-[9px] font-black transition-all ${
                         config.materials.includes(m as any) ? 'bg-purple-600/10 border-purple-500/50 text-white' : 'bg-white/[0.01] border-white/5 text-zinc-700'
                       }`}
                     >
                        {m}
                     </button>
                   ))}
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Arquitecturas</label>
                <div className="grid grid-cols-2 gap-2">
                   {['gyroid', 'honeycomb', 'lattice', 'octet', 'solid'].map(arch => (
                     <button 
                       key={arch}
                       onClick={() => setConfig(prev => ({
                         ...prev,
                         architectures: prev.architectures.includes(arch as ArchitectureType) 
                           ? prev.architectures.filter(x => x !== arch) 
                           : [...prev.architectures, arch as ArchitectureType]
                       }))}
                       className={`px-3 py-2 rounded-lg border text-[9px] font-black uppercase transition-all ${
                         config.architectures.includes(arch as any) ? 'bg-purple-600/10 border-purple-500/50 text-white' : 'bg-white/[0.01] border-white/5 text-zinc-700 hover:text-zinc-500'
                       }`}
                     >
                        {arch}
                     </button>
                   ))}
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Muestras / Configuración</label>
                <div className="flex items-center gap-4 bg-black/40 p-4 rounded-xl border border-white/5">
                   <input 
                     type="range" min="1" max="25" step="1"
                     value={config.samplesPerVariant}
                     onChange={(e) => setConfig(prev => ({ ...prev, samplesPerVariant: parseInt(e.target.value) }))}
                     className="flex-1 accent-purple-600 h-1.5 bg-zinc-900 rounded-full"
                   />
                   <span className="text-xl font-black text-white italic">{config.samplesPerVariant}</span>
                </div>
              </div>
           </div>

           <div className="p-4 rounded-2xl bg-blue-600/5 border border-blue-500/10 flex items-start gap-4">
              <AlertCircle className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
              <p className="text-[10px] font-black leading-relaxed text-zinc-400">
                 Note: The matrix increases exponentially by factors (Mat x Arch x Inf x Orient). Consider model costs.
              </p>
           </div>
        </div>

        {/* 3. GENERATED MATRIX TABLE (MAIN) */}
        <div className="lg:col-span-3 bg-zinc-950 border border-white/5 rounded-3xl overflow-hidden flex flex-col">
           <header className="px-8 py-5 border-b border-white/5 bg-zinc-900/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <Grid3X3 className="h-4 w-4 text-zinc-600" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Variantes Generadas (Cartesian Cross)</span>
              </div>
              <div className="flex items-center gap-2">
                 <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[9px] font-bold text-emerald-500 uppercase">Engine: Stable</span>
              </div>
           </header>

           <div className="flex-1 overflow-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                 <thead className="sticky top-0 bg-zinc-900/90 backdrop-blur-3xl z-10">
                    <tr className="text-[9px] font-black uppercase tracking-widest text-zinc-600 border-b border-white/5">
                       <th className="px-8 py-4">ID_HASH</th>
                       <th className="px-4 py-4">Material</th>
                       <th className="px-4 py-4">Architecture</th>
                       <th className="px-4 py-4">Infill (%)</th>
                       <th className="px-4 py-4">Strut (mm)</th>
                       <th className="px-4 py-4">Orient</th>
                       <th className="px-8 py-4 text-right">Status</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-white/[0.02]">
                    {variants.map((v, i) => (
                      <motion.tr 
                        key={v.id}
                        initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.002 }}
                        className="group hover:bg-white/[0.02] transition-colors"
                      >
                         <td className="px-8 py-4 text-[9px] font-mono text-zinc-700 group-hover:text-blue-500 transition-colors uppercase">{v.id}</td>
                         <td className="px-4 py-4">
                            <span className="px-2 py-1 rounded bg-orange-500/10 text-orange-400 text-[10px] font-black uppercase">{v.material}</span>
                         </td>
                         <td className="px-4 py-4 text-[11px] font-black text-white italic uppercase tracking-tighter">{v.architecture}</td>
                         <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                               <div className="h-1.5 w-12 bg-white/5 rounded-full overflow-hidden">
                                  <div className="h-full bg-blue-500/50" style={{ width: `${v.infill}%` }} />
                               </div>
                               <span className="text-[10px] font-bold text-zinc-400">{v.infill}%</span>
                            </div>
                         </td>
                         <td className="px-4 py-4 text-[10px] font-mono text-zinc-500">{v.strutThickness}</td>
                         <td className="px-4 py-4 text-[9px] font-black uppercase text-zinc-600">{v.orientation}</td>
                         <td className="px-8 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                               <CheckCircle2 className="h-3 w-3 text-zinc-800" />
                               <span className="text-[9px] font-black uppercase text-zinc-800">Pending</span>
                            </div>
                         </td>
                      </motion.tr>
                    ))}
                    {variants.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-8 py-20 text-center text-[11px] font-black uppercase tracking-widest text-zinc-800 italic">
                           -- Sin combinaciones generadas. Seleccione parámetros técnicos. --
                        </td>
                      </tr>
                    )}
                 </tbody>
              </table>
           </div>
           
           <footer className="p-4 bg-black/40 border-t border-white/5 flex items-center justify-between">
              <span className="text-[9px] font-black text-zinc-700 uppercase italic">
                 Generated on: {new Date().toLocaleDateString()} // Experimental Design Suite
              </span>
              <button className="flex items-center gap-2 text-[9px] font-black text-zinc-500 hover:text-white uppercase transition-colors">
                 <Shuffle className="h-3 w-3" /> Clear Matrix
              </button>
           </footer>
        </div>
      </div>
    </div>
  );
}