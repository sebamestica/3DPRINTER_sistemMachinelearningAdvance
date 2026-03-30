import { GEOMETRIES } from '../data/geometries';
import { Hexagon, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';

export function GeometryGallerySection() {
  return (
    <section id="gallery" className="py-24 px-6 md:px-12 bg-zinc-950 border-t border-white/5 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 right-0 h-[400px] w-full bg-gradient-to-b from-blue-500/5 to-transparent blur-3xl opacity-20 pointer-events-none" />

      <div className="container mx-auto max-w-7xl relative z-10 flex flex-col gap-12 sm:gap-16">
        <div className="flex flex-col gap-4 items-center text-center md:items-start md:text-left">
           <div className="flex items-center gap-4">
              <div className="h-px w-12 bg-blue-500/50" />
              <span className="text-[10px] font-black uppercase tracking-[0.6em] text-blue-500 italic">Catálogo Estructural</span>
           </div>
           <h2 className="text-5xl font-black tracking-tighter text-white uppercase sm:text-7xl">Librería de Geometrías</h2>
           <p className="max-w-2xl text-lg font-medium leading-relaxed text-zinc-500">
              Explore los perfiles de comportamiento mecánico y topológico según la arquitectura interna seleccionada para el cubo de 5cm.
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
           {GEOMETRIES.map((geo, index) => (
              <div key={geo.type} className="group flex flex-col gap-8 rounded-[2.5rem] border border-white/5 bg-zinc-900/30 p-10 transition-all hover:bg-white/[0.04] hover:border-blue-500/20 hover:scale-[1.02] shadow-3xl backdrop-blur-3xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[40px] font-black text-white/5 tabular-nums">0{index + 1}</span>
                 </div>

                 <div className="flex items-center justify-between relative z-10">
                    <div className="h-14 w-14 flex items-center justify-center rounded-2xl bg-zinc-800/50 text-zinc-500 group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:rotate-12 shadow-inner border border-white/5">
                       <Hexagon className="h-7 w-7" />
                    </div>
                 </div>

                 <div className="space-y-4 relative z-10">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight group-hover:text-blue-400 transition-colors leading-none">{geo.name}</h3>
                    <p className="text-sm font-medium text-zinc-300/80 leading-relaxed uppercase tracking-tighter line-clamp-3 group-hover:text-zinc-200 transition-colors">
                       {geo.description}
                    </p>
                 </div>

                 <div className="space-y-6 pt-8 border-t border-white/5 relative z-10 grow">
                    <div className="space-y-3">
                       <h4 className="text-[11px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Fortalezas
                       </h4>
                       <div className="flex flex-col gap-3">
                          {geo.strengths.slice(0, 2).map((s, i) => (
                             <div key={i} className="text-[11px] text-zinc-100 font-bold uppercase tracking-tight flex items-start gap-2.5">
                                <span className="h-1 w-1 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                {s}
                             </div>
                          ))}
                       </div>
                    </div>

                    <div className="space-y-3">
                       <h4 className="text-[11px] font-black text-orange-400 uppercase tracking-widest flex items-center gap-2">
                          <AlertCircle className="h-3.5 w-3.5" /> Trade-off
                       </h4>
                       <div className="flex flex-col gap-3">
                          <div className="text-[11px] text-zinc-400 font-bold uppercase tracking-tight italic flex items-start gap-2.5">
                             <span className="h-1 w-1 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                             {geo.tradeOffs[0]}
                          </div>
                       </div>
                    </div>
                 </div>

                 <a href="#workbench" className="mt-8 flex items-center justify-between pt-6 border-t border-white/[0.03] group/btn relative z-10 transition-all">
                    <span className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em] group-hover/btn:text-white group-hover/btn:tracking-[0.3em] transition-all">Seleccionar</span>
                    <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 text-zinc-500 group-hover/btn:bg-blue-600 group-hover/btn:text-white transition-all shadow-lg active:scale-90">
                       <ChevronRight className="h-5 w-5" />
                    </div>
                 </a>
              </div>
           ))}
        </div>
      </div>
    </section>
  );
}
