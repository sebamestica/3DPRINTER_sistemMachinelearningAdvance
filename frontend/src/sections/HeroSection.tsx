import { ChevronRight, Activity, Cpu, Hexagon, FlaskConical } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-black overflow-hidden pt-36 pb-32">
      {/* Background Cyber-Aesthetics */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         <div className="absolute top-0 left-1/4 w-[1px] h-full bg-gradient-to-b from-blue-500/0 via-blue-500/10 to-transparent" />
         <div className="absolute top-0 right-1/4 w-[1px] h-full bg-gradient-to-b from-blue-500/0 via-blue-500/10 to-transparent" />
         <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/5 to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
         {/* Elevated Technical Badge */}
         <div className="flex items-center gap-4 border border-white/10 rounded-full px-6 py-3 bg-zinc-900/40 backdrop-blur-2xl mb-12 group hover:border-blue-500/50 transition-all duration-700 shadow-2xl">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 animate-pulse">
               <FlaskConical className="h-3.5 w-3.5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500 group-hover:text-white transition-colors">
               Structural Modeling Unit v4.0
            </span>
         </div>

         {/* Hero Title - Refined for PC/Mobile */}
         <div className="space-y-6 mb-12">
            <h1 className="text-5xl sm:text-8xl lg:text-9xl font-black tracking-tighter text-white uppercase leading-[0.85] max-w-6xl mx-auto drop-shadow-2xl">
               Decision <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-400 via-indigo-400 to-emerald-400">Support</span> <br />
               <span className="text-white/90">Estructural</span>
            </h1>
            
            <p className="max-w-3xl text-lg sm:text-xl lg:text-2xl font-medium leading-relaxed text-zinc-400 px-4">
               Plataforma de visualización técnica y diagnóstico para <span className="text-white border-b border-blue-500/30">Cúbos 5x5x5 cm</span>. 
               Diseñe, evalúe y seleccione configuraciones óptimas mediante ingeniería asistida.
            </p>
         </div>

         {/* Actionable CTAs */}
         <div className="flex flex-col sm:flex-row items-center gap-6 mb-24">
            <a 
              href="#workbench"
              className="group flex items-center justify-center gap-4 rounded-[2rem] bg-blue-600 px-12 py-6 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-blue-500 hover:scale-[1.03] shadow-[0_0_30px_rgba(37,99,235,0.3)] active:scale-95"
            >
               Iniciar Análisis de Diseño <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
            </a>
            <a 
              href="#gallery"
              className="group flex items-center justify-center gap-4 rounded-[2rem] border border-white/5 bg-white/[0.03] px-12 py-6 text-xs font-black uppercase tracking-widest text-zinc-400 transition-all hover:text-white hover:border-white/20 hover:bg-white/10 active:scale-95"
            >
               Catálogo de Geometrías <Hexagon className="h-4 w-4 opacity-50 group-hover:rotate-90 group-hover:opacity-100 transition-all duration-700" />
            </a>
         </div>

         {/* Technical Features Grid - 100% Responsive */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-16 w-full max-w-5xl border-t border-white/5 pt-16">
            <div className="flex flex-col items-center gap-5 group">
               <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-zinc-900 border border-white/5 text-blue-500 group-hover:bg-blue-500/10 transition-all shadow-inner">
                  <Activity className="h-6 w-6" />
               </div>
               <div className="flex flex-col items-center gap-1.5">
                  <div className="text-[11px] font-black text-white uppercase tracking-widest">Asistente Técnico</div>
                  <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter opacity-60">Diagnóstico heurístico en tiempo real</div>
               </div>
            </div>
            
            <div className="flex flex-col items-center gap-5 group">
               <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-zinc-900 border border-white/5 text-indigo-400 group-hover:bg-indigo-500/10 transition-all shadow-inner">
                  <Cpu className="h-6 w-6" />
               </div>
               <div className="flex flex-col items-center gap-1.5">
                  <div className="text-[11px] font-black text-white uppercase tracking-widest">Contraste de Producibilidad</div>
                  <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter opacity-60">Evaluación de candidatos fabricables</div>
               </div>
            </div>
            
            <div className="flex flex-col items-center gap-5 group">
               <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-zinc-900 border border-white/5 text-emerald-400 group-hover:bg-emerald-500/10 transition-all shadow-inner">
                  <Hexagon className="h-6 w-6" />
               </div>
               <div className="flex flex-col items-center gap-1.5">
                  <div className="text-[11px] font-black text-white uppercase tracking-widest">Bibliotecas Topológicas</div>
                  <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter opacity-60">Ocho arquitecturas internas validadas</div>
               </div>
            </div>
         </div>
      </div>

      {/* Ground Glow Indicator */}
      <div className="absolute bottom-0 left-0 w-full h-[100px] bg-gradient-to-t from-blue-600/[0.03] to-transparent pointer-events-none" />
    </section>
  );
}
