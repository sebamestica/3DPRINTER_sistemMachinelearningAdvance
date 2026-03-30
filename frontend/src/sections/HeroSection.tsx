import { ChevronRight, Activity, Cpu, Hexagon } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center bg-black overflow-hidden pt-32 pb-24">
      {/* Structural Wireframe Grid Lines */}
      <div className="absolute inset-0 opacity-10">
         <div className="absolute left-0 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-white to-transparent" />
         <div className="absolute right-0 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-white to-transparent" />
         <div className="absolute left-1/4 top-0 h-full w-[.5px] bg-white/20" />
         <div className="absolute right-1/4 top-0 h-full w-[.5px] bg-white/20" />
      </div>

      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
         {/* Technical Badge */}
         <div className="flex items-center gap-4 border border-white/10 rounded-full px-5 py-2.5 bg-zinc-900/50 backdrop-blur-xl mb-10 group hover:border-primary transition-all duration-500">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-primary animate-pulse">
               <Activity className="h-3 w-3" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 group-hover:text-white transition-colors">
               Structural Resistance Analysis Unit v2.0
            </span>
         </div>

         {/* Title and Subtitle */}
         <h1 className="text-7xl font-black tracking-tight text-white uppercase sm:text-9xl leading-[0.8] mb-8 max-w-5xl">
            Soporte de <span className="text-transparent bg-clip-text bg-gradient-to-tr from-primary to-blue-400">Decisión</span> Estructural
         </h1>
         
         <p className="max-w-2xl text-xl font-medium leading-relaxed text-zinc-500 mb-12">
            Plataforma avanzada de previsualización técnica y comparación de geometrías 3D sometidas a compresión vertical. Diseñe, evalúe y decida con precisión de ingeniería.
         </p>

         {/* CTAs */}
         <div className="flex flex-col sm:flex-row items-center gap-6">
            <a 
              href="#workbench"
              className="group flex items-center gap-4 rounded-2xl bg-primary px-10 py-5 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-primary/80 hover:scale-[1.02] shadow-2xl shadow-primary/20 active:scale-95"
            >
               Configurar Análisis <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a 
              href="#gallery"
              className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-10 py-5 text-xs font-black uppercase tracking-widest text-zinc-400 transition-all hover:text-white hover:border-white/20 hover:bg-white/10"
            >
               Catálogo de Geometrías <Hexagon className="h-4 w-4" />
            </a>
         </div>

         {/* Technical Features Bar */}
         <div className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-12 w-full max-w-4xl border-t border-white/5 pt-12">
            <div className="flex flex-col items-center gap-4">
               <div className="h-10 w-10 flex items-center justify-center rounded-2xl bg-zinc-900 border border-white/5 text-primary">
                  <Activity className="h-5 w-5" />
               </div>
               <div>
                  <div className="text-xs font-black text-white uppercase tracking-widest">Análisis Heurístico</div>
                  <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-tighter mt-1">Algoritmo de respuesta estimada</div>
               </div>
            </div>
            <div className="flex flex-col items-center gap-4">
               <div className="h-10 w-10 flex items-center justify-center rounded-2xl bg-zinc-900 border border-white/5 text-blue-400">
                  <Cpu className="h-5 w-5" />
               </div>
               <div>
                  <div className="text-xs font-black text-white uppercase tracking-widest">Comparación Técnica</div>
                  <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-tighter mt-1">Evaluación lado a lado</div>
               </div>
            </div>
            <div className="flex flex-col items-center gap-4">
               <div className="h-10 w-10 flex items-center justify-center rounded-2xl bg-zinc-900 border border-white/5 text-purple-400">
                  <Hexagon className="h-5 w-5" />
               </div>
               <div>
                  <div className="text-xs font-black text-white uppercase tracking-widest">Ocho Geometrías</div>
                  <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-tighter mt-1">Bibliotecas estructurales</div>
               </div>
            </div>
         </div>
      </div>

      {/* Hero Bottom Accent */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
    </section>
  );
}
