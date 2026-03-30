import { Eye, Layers, Box, LayoutGrid } from 'lucide-react';
import type { PreviewConfig } from '../../types/design';

interface BottomDockProps {
  preview: PreviewConfig;
  updatePreview: (p: Partial<PreviewConfig>) => void;
}

export function BottomDock({ preview, updatePreview }: BottomDockProps) {
  return (
    <div className="flex-1 flex items-center justify-between gap-12">
       
       {/* 1. LAYER SLIDER (SLICER MODE) */}
       <div className="flex-1 flex items-center gap-6">
          <div className="flex flex-col items-end">
             <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Slicing Engine</span>
             <span className="text-[9px] font-bold text-zinc-800 uppercase tracking-[0.3em]">Layer Control</span>
          </div>
          <div className="flex-1 flex items-center gap-4 group">
             <Layers className="h-5 w-5 text-blue-500/50 group-hover:text-blue-500 transition-colors" />
             <input 
               type="range" min="1" max={preview.totalLayers} step="1"
               value={preview.currentLayer}
               onChange={(e) => updatePreview({ currentLayer: parseInt(e.target.value) })}
               className="flex-1 accent-blue-600 h-2 bg-zinc-900 rounded-full cursor-pointer appearance-none"
             />
             <span className="text-xl font-black text-white italic tabular-nums w-16 text-right">#{(preview.currentLayer).toString().padStart(3, '0')}</span>
          </div>
       </div>

       {/* 2. RENDERING TOGGLES */}
       <div className="flex items-center gap-3">
          {[
            { id: 'solid', icon: Box, label: 'Sólido' },
            { id: 'translucent', icon: Eye, label: 'Trans' },
            { id: 'wireframe', icon: LayoutGrid, label: 'Wire' }
          ].map(mode => (
            <button
              key={mode.id}
              onClick={() => updatePreview({ renderMode: mode.id as any })}
              className={`flex items-center gap-3 px-6 py-3 rounded-2xl border text-[9px] font-black uppercase tracking-widest transition-all ${
                preview.renderMode === mode.id ? "bg-white/5 border-white/20 text-white shadow-xl" : "bg-transparent border-transparent text-zinc-700 hover:text-zinc-500"
              }`}
            >
               <mode.icon className="h-4 w-4" />
               {mode.label}
            </button>
          ))}
       </div>

    </div>
  );
}
