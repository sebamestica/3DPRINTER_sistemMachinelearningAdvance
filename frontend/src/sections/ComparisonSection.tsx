import { Target, TrendingUp, Zap, Box, Share2, Download } from 'lucide-react';
import { GEOMETRIES } from '../data/geometries';
import { analyzeConfiguration } from '../lib/scoring';
import type { InputParameters } from '../types/model';

export function ComparisonSection() {
  const caseA: InputParameters = { 
    material: 'PLA', 
    geometry: 'solid', 
    infill: 90, 
    layerHeight: 0.2, 
    speed: 50, 
    temperature: 210, 
    compressionLevel: 50, 
    analysisMode: 'strength',
    shellThickness: 0.2,
    internalPadding: 0.1,
    transparency: 0.5,
    visualMode: 'solid'
  };

  const caseB: InputParameters = { 
    material: 'PLA', 
    geometry: 'gyroid', 
    infill: 40, 
    layerHeight: 0.2, 
    speed: 50, 
    temperature: 205, 
    compressionLevel: 50, 
    analysisMode: 'strength',
    shellThickness: 0.18,
    internalPadding: 0.2,
    transparency: 0.35,
    visualMode: 'transparent'
  };

  const resultsA = analyzeConfiguration(caseA);
  const resultsB = analyzeConfiguration(caseB);

  return (
    <section id="comparison" className="py-24 px-6 md:px-12 bg-black border-t border-white/5 relative overflow-hidden">
      {/* Structural Decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-px w-[80vw] bg-gradient-to-r from-transparent via-blue-500/10 to-transparent" />

      <div className="container mx-auto max-w-7xl relative z-10 flex flex-col gap-16">
        <div className="flex flex-col gap-4 text-center items-center max-w-2xl mx-auto">
           <div className="inline-flex items-center gap-3">
              <div className="h-px w-12 bg-blue-500/50" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">Comparación Estructural</span>
           </div>
           <h2 className="text-5xl font-black tracking-tight text-white uppercase sm:text-6xl">Contraste de Cubos</h2>
           <p className="max-w-xl text-lg font-medium leading-relaxed text-zinc-500">
              Evalúe el impacto de la arquitectura interna en el desempeño del <span className="text-white border-b border-white/10">Cubo 5x5x5</span>.
           </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-px bg-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/5">
           {/* Option A */}
           <div className="bg-zinc-950 p-10 flex flex-col gap-10">
              <div className="flex items-center justify-between">
                 <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Configuración A</span>
                    <h3 className="text-3xl font-black text-white uppercase tracking-tight">Estructura Sólida</h3>
                 </div>
                 <div className="h-14 w-14 flex items-center justify-center rounded-2xl bg-zinc-900 border border-white/5 text-blue-500 shadow-inner">
                    <Zap className="h-7 w-7" />
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 {[
                   { label: 'Geometría', val: GEOMETRIES.find(g => g.type === caseA.geometry)?.name, icon: <Box className="h-3 w-3" /> },
                   { label: 'Relleno', val: `${caseA.infill}%` },
                   { label: 'Resistencia', val: `${resultsA.compressiveStrength} MPa`, highlight: true },
                   { label: 'Eficiencia', val: 'Baja' }
                 ].map((item, i) => (
                    <div key={i} className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 group hover:bg-white/[0.04] transition-colors">
                       <div className="text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-1 flex items-center gap-1.5">
                         {item.icon} {item.label}
                       </div>
                       <div className={`text-sm font-bold uppercase ${item.highlight ? "text-blue-500" : "text-zinc-300"}`}>{item.val}</div>
                    </div>
                 ))}
              </div>

              <div className="space-y-6 bg-black/40 rounded-3xl p-8 border border-white/5">
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Distribución de Carga</span>
                    <span className="text-xs font-black text-white">{(resultsA.distributionIndex * 100).toFixed(0)}%</span>
                 </div>
                 <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden p-[1px]">
                    <div className="h-full bg-gradient-to-r from-blue-700 to-blue-500 rounded-full" style={{ width: `${resultsA.distributionIndex * 100}%` }} />
                 </div>
                 <p className="text-[10px] leading-relaxed text-zinc-500 font-medium uppercase tracking-tight italic">
                    Prioriza masa total. <span className="text-zinc-400">Ineficiencia material significativa.</span>
                 </p>
              </div>
           </div>

           {/* Option B */}
           <div className="bg-zinc-950 p-10 flex flex-col gap-10">
              <div className="flex items-center justify-between">
                 <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Configuración B</span>
                    <h3 className="text-3xl font-black text-white uppercase tracking-tight">Arquitectura Gyroid</h3>
                 </div>
                 <div className="h-14 w-14 flex items-center justify-center rounded-2xl bg-zinc-900 border border-white/5 text-indigo-400 shadow-inner">
                    <TrendingUp className="h-7 w-7" />
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 {[
                   { label: 'Geometría', val: GEOMETRIES.find(g => g.type === caseB.geometry)?.name, icon: <Box className="h-3 w-3" /> },
                   { label: 'Relleno', val: `${caseB.infill}%` },
                   { label: 'Resistencia', val: `${resultsB.compressiveStrength} MPa`, highlight: true },
                   { label: 'Eficiencia', val: 'Óptima' }
                 ].map((item, i) => (
                    <div key={i} className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 group hover:bg-white/[0.04] transition-colors">
                       <div className="text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-1 flex items-center gap-1.5">
                         {item.icon} {item.label}
                       </div>
                       <div className={`text-sm font-bold uppercase ${item.highlight ? "text-indigo-400" : "text-zinc-300"}`}>{item.val}</div>
                    </div>
                 ))}
              </div>

              <div className="space-y-6 bg-black/40 rounded-3xl p-8 border border-white/5">
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Distribución de Carga</span>
                    <span className="text-xs font-black text-white">{(resultsB.distributionIndex * 100).toFixed(0)}%</span>
                 </div>
                 <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden p-[1px]">
                    <div className="h-full bg-gradient-to-r from-indigo-700 to-indigo-500 rounded-full" style={{ width: `${resultsB.distributionIndex * 100}%` }} />
                 </div>
                 <p className="text-[10px] leading-relaxed text-zinc-500 font-medium uppercase tracking-tight italic">
                    Distribución isotrópica. <span className="text-indigo-400">Máximo desempeño por unidad de masa.</span>
                 </p>
              </div>
           </div>
        </div>

        {/* Comparison Result / Conclusion */}
        <div className="max-w-5xl mx-auto w-full rounded-[2rem] border border-white/5 bg-zinc-900/40 p-4 pl-10 pr-6 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-xl shadow-2xl">
           <div className="flex items-center gap-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                 <Target className="h-5 w-5" />
              </div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 leading-relaxed">
                 CONCLUSIÓN TÉCNICA: <span className="text-white">La Opción B (Gyroid) presenta una arquitectura interna más eficiente para distribución de carga vertical en el cubo 5x5x5 cm.</span>
              </p>
           </div>
           
           <div className="flex items-center gap-3">
              <button className="flex h-11 items-center gap-2 rounded-xl bg-white/5 px-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:bg-white/10 hover:text-white transition-all">
                 <Share2 className="h-3.5 w-3.5" />
              </button>
              <button className="flex h-11 items-center gap-3 rounded-xl bg-blue-600 px-6 text-[10px] font-black uppercase tracking-widest text-white hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/20 active:scale-95 transition-all">
                 <Download className="h-3.5 w-3.5" /> REPORTE
              </button>
           </div>
        </div>
      </div>
    </section>
  );
}
