import { ChevronRight, Hexagon, Package, Target } from 'lucide-react';
import type { CubeParameters } from '../../types/design';

interface LeftPanelProps {
  parameters: CubeParameters;
  updateParams: (p: Partial<CubeParameters>) => void;
}

export function LeftPanel({ parameters, updateParams }: LeftPanelProps) {
  const GroupTitle = ({ icon: Icon, title, mod }: any) => (
    <div className="flex items-center justify-between pb-4 border-b border-white/5 pt-10 first:pt-0 group cursor-default">
       <div className="flex items-center gap-3">
          <div className="h-6 w-6 rounded-lg bg-white/5 flex items-center justify-center text-zinc-600 group-hover:text-blue-500 transition-colors">
             <Icon className="h-3.5 w-3.5" />
          </div>
          <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white/50 group-hover:text-white transition-colors">{title}</span>
       </div>
       <span className="text-[9px] font-bold text-zinc-800 uppercase tracking-widest">{mod}</span>
    </div>
  );

  return (
    <div className="p-10 space-y-12">
       
       {/* 1. ARCHITECTURE GROUP */}
       <div className="space-y-8 animate-in slide-in-from-left duration-500">
          <GroupTitle icon={Hexagon} title="Arquitectura Interna" mod="MOD_0.1" />
          <div className="grid grid-cols-2 gap-3">
             {['solid', 'gyroid', 'honeycomb', 'lattice', 'cubic', 'diamond', 'octet'].map(geo => (
               <button
                 key={geo}
                 onClick={() => updateParams({ geometry: geo as any })}
                 className={`py-4 px-3 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                   parameters.geometry === geo ? "bg-blue-600/10 border-blue-500/50 text-white shadow-xl" : "bg-white/[0.01] border-white/5 text-zinc-700 hover:text-zinc-500 hover:bg-white/[0.03]"
                 }`}
               >
                 {geo}
               </button>
             ))}
          </div>

          {/* Sliders with better feedback */}
          <div className="space-y-8 mt-10">
             <div className="space-y-4">
                <div className="flex justify-between items-baseline group">
                   <div className="flex flex-col">
                      <label className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Escala de Celda (mm)</label>
                      <span className="text-[9px] font-medium text-zinc-600 italic">Factor de resolución geométrica</span>
                   </div>
                   <span className="text-sm font-black text-blue-500 tabular-nums px-3 py-1 bg-blue-500/10 rounded-xl">{parameters.cellSize.toFixed(2)}x</span>
                </div>
                <input 
                  type="range" min="0.5" max="4" step="0.1"
                  value={parameters.cellSize}
                  onChange={(e) => updateParams({ cellSize: parseFloat(e.target.value) })}
                  className="w-full accent-blue-500 h-2 bg-zinc-900 rounded-full cursor-pointer appearance-none"
                />
             </div>

             <div className="space-y-4">
                <div className="flex justify-between items-baseline group">
                   <div className="flex flex-col">
                      <label className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Grosor de Puntal (Strut)</label>
                      <span className="text-[9px] font-medium text-zinc-600 italic">Dimensionado de miembros estructurales</span>
                   </div>
                   <span className="text-sm font-black text-blue-500 tabular-nums px-3 py-1 bg-blue-500/10 rounded-xl">{parameters.strutThickness.toFixed(2)}cm</span>
                </div>
                <input 
                  type="range" min="0.05" max="0.6" step="0.02"
                  value={parameters.strutThickness}
                  onChange={(e) => updateParams({ strutThickness: parseFloat(e.target.value) })}
                  className="w-full accent-blue-500 h-2 bg-zinc-900 rounded-full cursor-pointer appearance-none"
                />
             </div>
          </div>
       </div>

       {/* 2. MANUFACTURING GROUP */}
       <div className="space-y-8 pt-10 border-t border-white/5 animate-in slide-in-from-left duration-700">
          <GroupTitle icon={Package} title="Parámetros de Fabricación" mod="MAT_LAB" />
          
          <div className="space-y-10">
             <div className="space-y-5">
                <div className="flex justify-between items-center bg-orange-600/5 border border-orange-500/10 p-6 rounded-3xl">
                   <div className="flex flex-col">
                      <label className="text-[11px] font-black text-orange-500 uppercase tracking-widest">Infill Global (%)</label>
                      <span className="text-[10px] font-medium text-zinc-700 italic">Compacidad total del prototipo</span>
                   </div>
                   <span className="text-2xl font-black text-white tabular-nums drop-shadow-lg">{parameters.infill.toFixed(0)}%</span>
                </div>
                <input 
                  type="range" min="10" max="100" step="5"
                  value={parameters.infill}
                  onChange={(e) => updateParams({ infill: parseInt(e.target.value) })}
                  className="w-full accent-orange-600 h-2 bg-zinc-900 rounded-full cursor-pointer appearance-none"
                />
             </div>

             <div className="grid grid-cols-4 gap-2">
                {['PLA', 'ABS', 'PETG', 'TPU'].map(mat => (
                  <button
                    key={mat}
                    onClick={() => updateParams({ material: mat as any })}
                    className={`flex-1 py-3 rounded-xl border text-[10px] font-black uppercase transition-all shadow-sm ${
                      parameters.material === mat ? "bg-orange-500/10 border-orange-500/60 text-orange-400" : "bg-white/[0.01] border-white/5 text-zinc-700 hover:text-zinc-500"
                    }`}
                  >
                    {mat}
                  </button>
                ))}
             </div>
          </div>
       </div>

       {/* 3. VALIDATION / TARGET GROUP */}
       <div className="space-y-8 pt-10 border-t border-white/5 animate-in slide-in-from-left duration-1000">
          <GroupTitle icon={Target} title="Protocolo de Validación" mod="ANALYSIS_42" />
          <div className="space-y-4">
             {['compression', 'tensile', 'flexion'].map(mode => (
               <button
                 key={mode}
                 onClick={() => updateParams({ mode: mode as any })}
                 className={`w-full group p-5 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-between hover:bg-zinc-800 transition-all ${
                   parameters.mode === mode ? "border-l-4 border-l-blue-500 bg-blue-500/[0.02] text-white" : "text-zinc-600"
                 }`}
               >
                  <span className="text-[11px] font-black uppercase tracking-widest">{mode} Analysis Engine</span>
                  <ChevronRight className="h-4 w-4 opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
               </button>
             ))}
          </div>
       </div>
       
       <div className="h-20" /> {/* Spacer */}
    </div>
  );
}
