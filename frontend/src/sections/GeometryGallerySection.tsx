import { GEOMETRIES } from '../data/geometries';
import { Hexagon, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';

export function GeometryGallerySection() {
  return (
    <section id="gallery" className="py-24 px-6 md:px-12 bg-zinc-950 border-t border-white/5 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 right-0 h-[400px] w-full bg-gradient-to-b from-white/5 to-transparent blur-3xl opacity-20 pointer-events-none" />

      <div className="container mx-auto max-w-7xl relative z-10 flex flex-col gap-12">
        <div className="flex flex-col gap-4">
           <div className="flex items-center gap-3">
              <div className="h-px w-12 bg-primary/50" />
              <span className="text-xs font-black uppercase tracking-[0.4em] text-primary">Catálogo Estructural</span>
           </div>
           <h2 className="text-5xl font-black tracking-tight text-white uppercase sm:text-6xl">Librería de Geometrías</h2>
           <p className="max-w-xl text-lg font-medium leading-relaxed text-zinc-500">
              Explore los diferentes perfiles de comportamiento según el patrón interno seleccionado.
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           {GEOMETRIES.map((geo, index) => (
              <div key={geo.type} className="group flex flex-col gap-6 rounded-3xl border border-white/5 bg-zinc-900/40 p-8 transition-all hover:bg-white/5 hover:border-primary/20 hover:scale-[1.02] shadow-2xl backdrop-blur-3xl">
                 <div className="flex items-center justify-between">
                    <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-zinc-800 text-zinc-500 group-hover:bg-primary group-hover:text-white transition-all transform group-hover:rotate-12">
                       <Hexagon className="h-6 w-6" />
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-zinc-700">0{index + 1}</div>
                 </div>

                 <div className="space-y-2">
                    <h3 className="text-xl font-black text-white uppercase tracking-tight group-hover:text-primary transition-colors">{geo.name}</h3>
                    <p className="text-xs font-medium text-zinc-500 leading-relaxed uppercase tracking-tighter line-clamp-2">
                       {geo.description}
                    </p>
                 </div>

                 <div className="space-y-4 pt-4 border-t border-white/5">
                    <div className="space-y-2">
                       <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Fortalezas</h4>
                       <div className="flex flex-col gap-1.5">
                          {geo.strengths.slice(0, 2).map((s, i) => (
                             <div key={i} className="flex items-center gap-2 text-[10px] text-zinc-400 font-bold uppercase tracking-tight">
                                <CheckCircle2 className="h-3 w-3 text-green-500 shrink-0" /> {s}
                             </div>
                          ))}
                       </div>
                    </div>

                    <div className="space-y-2">
                       <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Trade-off</h4>
                       <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2 text-[10px] text-zinc-600 font-bold uppercase tracking-tight italic">
                             <AlertCircle className="h-3 w-3 text-amber-500/50 shrink-0" /> {geo.tradeOffs[0]}
                          </div>
                       </div>
                    </div>
                 </div>

                 <a href="#workbench" className="mt-auto flex items-center justify-between pt-4 group/btn">
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest group-hover/btn:text-white transition-colors">Seleccionar</span>
                    <div className="h-8 w-8 flex items-center justify-center rounded-full bg-zinc-800 text-zinc-500 group-hover/btn:bg-primary group-hover/btn:text-white transition-all">
                       <ChevronRight className="h-4 w-4" />
                    </div>
                 </a>
              </div>
           ))}
        </div>
      </div>
    </section>
  );
}
