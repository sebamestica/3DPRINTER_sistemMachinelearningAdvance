import { FlaskConical, Box, ClipboardCheck, ArrowRight, Target, Share2, Layers, LayoutGrid } from 'lucide-react';
import { ParametersPanel } from '../components/controls/ParametersPanel';
import { CubeAssemblyScene } from '../components/visualization/CubeAssemblyScene';
import { RecommendationCard } from '../components/cards/RecommendationCard';
import { DecisionAssistantCard } from '../components/decision/DecisionAssistantCard';
import { MetricExplanationPanel } from '../components/decision/MetricExplanationPanel';
import { useCubeAnalysis } from '../hooks/useCubeAnalysis';
import { AdvancedNavButton } from '../components/layout/AdvancedNavButton';
import { defaultParameters } from '../data/defaultParameters';
import { buildDecisionAssessment } from '../lib/decisionRules';
import { useCandidateManager } from '../hooks/useCandidateManager';

export function DesignWorkbenchSection() {
  const { parameters, results, recommendation, isUpdating, updateParameters, setParameters } = useCubeAnalysis();
  const { candidates, saveCandidate } = useCandidateManager();

  // Engine: Build technical assessment based on current state
  const assessment = buildDecisionAssessment(parameters, results);

  const handleSave = () => {
    const label = prompt("Nombre local del candidato:", `Cubo-${parameters.geometry}-${parameters.infill}%`);
    if (label) saveCandidate(parameters, results, label);
  };

  return (
    <section id="workbench" className="relative flex flex-col gap-12 py-16 sm:py-24 px-6 md:px-12 bg-black overflow-hidden backdrop-blur-2xl">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 h-[1000px] w-[1000px] -translate-y-1/2 translate-x-1/2 rounded-full bg-blue-600/[0.02] blur-[200px] pointer-events-none" />
      
      <div className="container mx-auto max-w-7xl flex flex-col gap-12 sm:gap-16 relative z-10">
        
        {/* Header - Optimized Centering & Mobile Layout */}
        <div className="flex flex-col md:flex-row md:items-end justify-between items-center text-center md:text-left gap-8 md:gap-10 border-b border-white/[0.03] pb-10 sm:pb-14">
          <div className="flex flex-col gap-4 sm:gap-6 max-w-3xl items-center md:items-start">
             <div className="flex items-center gap-4">
                <div className="h-[2px] w-12 sm:w-20 bg-gradient-to-r from-blue-500 to-transparent" />
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.5em] text-blue-500/90 italic">Structural Labs v4.2</span>
             </div>
             <h2 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-white uppercase leading-[0.85]">
               Decision <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400">Hub</span>
             </h2>
             <p className="max-w-2xl text-base sm:text-lg lg:text-xl font-medium leading-relaxed text-zinc-500 px-4 md:px-0">
                Transforme datos técnicos en decisión experta. Optimice el <span className="text-white border-b border-white/20 font-bold">Prototipe Estructural</span> de 5cm mediante diagnósticos basados en IA y reglas heurísticas.
             </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-5 min-w-[280px]">
             <AdvancedNavButton />
             <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/[0.02] border border-white/5 text-[10px] font-black text-zinc-400 uppercase tracking-widest shadow-inner">
               <ClipboardCheck className="h-3.5 w-3.5 text-emerald-500" /> 
               Candidatos: <span className="text-white ml-1">{candidates.length}</span>
             </div>
          </div>
        </div>

        {/* 
            The Workbench Workbench Responsive Grid
            Mobile: 1. Preview, 2. Config, 3. Assistant
            Desktop: 1. Config, 2. Preview, 3. Assistant
        */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          
          {/* Column 1: Config (Paso 1 & 2) */}
          <div className="lg:col-span-3 order-2 lg:order-1 flex flex-col gap-8 h-full">
            <div className="rounded-[2.5rem] border border-blue-500/10 bg-blue-500/5 p-7 flex flex-col gap-5 shadow-inner">
               <div className="flex items-center gap-2.5 text-[10px] font-black text-blue-400 uppercase tracking-widest">
                  <Target className="h-4 w-4 bg-blue-500/20 p-0.5 rounded" /> Paso 1: Objetivo Principal
               </div>
               <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5">
                  {['strength', 'absorption', 'balance'].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => updateParameters({ analysisMode: mode as any })}
                      className={`flex-1 rounded-2xl border py-4 text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2 ${
                        parameters.analysisMode === mode
                          ? "bg-blue-600 border-blue-400 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                          : "bg-white/[0.03] border-white/5 text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      {mode === 'strength' ? 'Resistencia' : mode === 'absorption' ? 'Absorción' : 'Equilibrio'}
                    </button>
                  ))}
               </div>
            </div>

            <div className="flex-1">
              <ParametersPanel 
                parameters={parameters} 
                onUpdate={updateParameters} 
                isUpdating={isUpdating}
                onReset={() => setParameters(defaultParameters)}
              />
            </div>
          </div>

          {/* Column 2: 3D Visualization (Paso 3) */}
          <div className="lg:col-span-5 order-1 lg:order-2 min-h-[450px] lg:h-auto">
             <div className="absolute top-8 left-8 z-20 flex flex-col gap-2 pointer-events-none hidden sm:flex">
                <div className="flex items-center gap-2.5 text-[10px] font-black text-zinc-500 bg-black/60 backdrop-blur-xl px-4 py-2 rounded-full border border-white/5 uppercase tracking-widest shadow-2xl">
                   <LayoutGrid className="h-3 w-3 text-blue-500" /> Entorno Virtual / 5x5x5 cm
                </div>
             </div>
             
             <CubeAssemblyScene parameters={parameters} />
             
             {/* Dynamic Indicators for mobile/desktop overlap */}
             <div className="absolute bottom-8 left-0 right-0 z-20 px-8 flex items-end justify-between pointer-events-none gap-4">
                <div className="flex gap-2.5 mb-2">
                   {['Solid', 'Gyroid', 'Honeycomb'].map((g) => (
                      <div key={g} className={`h-1.5 rounded-full transition-all duration-500 ${parameters.geometry === g.toLowerCase() ? 'w-8 bg-blue-500 shadow-glow' : 'w-4 bg-white/10'}`} />
                   ))}
                </div>
                <div className="bg-black/40 backdrop-blur px-4 py-2 rounded-xl border border-white/10 text-[10px] font-mono text-zinc-500 flex flex-col items-end gap-1">
                   <span>LOD_RES: {results.compressiveStrength} MPa</span>
                   <span className="text-[8px] opacity-40 uppercase">Ref: Vertical Load Axis</span>
                </div>
             </div>
          </div>

          {/* Column 3: Decision & Diagnostic (Paso 4) */}
          <div className="lg:col-span-4 order-3 flex flex-col gap-8">
             <div className="flex-1">
                <DecisionAssistantCard assessment={assessment} />
             </div>
             
             <button 
               onClick={handleSave}
               className="group relative flex w-full items-center justify-between gap-6 rounded-[2.5rem] border border-emerald-500/20 bg-emerald-500/5 px-8 lg:px-10 py-7 text-xs sm:text-sm font-black text-emerald-400 transition-all hover:bg-emerald-500/10 hover:border-emerald-500/40 hover:shadow-[0_0_40px_rgba(16,185,129,0.15)] active:scale-[0.98] shadow-2xl overflow-hidden"
             >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center gap-4 relative z-10">
                  <div className="p-3 rounded-2xl bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors">
                    <ClipboardCheck className="h-5 w-5" />
                  </div>
                  <span className="uppercase tracking-[0.2em] text-[10px] sm:text-xs">Guardar Candidato</span>
                </div>
                <ArrowRight className="h-5 w-5 opacity-30 group-hover:opacity-100 group-hover:translate-x-1.5 transition-all relative z-10" />
             </button>
          </div>
        </div>

        {/* Steps 5 & 6: Detailed Interpretation & Pool Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 mt-8 sm:mt-12">
           {/* Detailed Interpretation */}
           <div className="lg:col-span-8 flex flex-col gap-10 lg:gap-14">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                   <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
                     <FlaskConical className="h-5 w-5" />
                   </div>
                   <div className="flex flex-col">
                      <h3 className="text-xs font-black uppercase tracking-widest text-white">Interpretación Técnica</h3>
                      <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mt-0.5">Diagnóstico basado en ejes de compresión vertical</p>
                   </div>
                </div>
                <RecommendationCard recommendation={recommendation} />
              </div>
              
              {candidates.length > 0 && (
                <div className="rounded-[3rem] border border-white/5 bg-zinc-950 p-8 sm:p-14 flex flex-col gap-12 sm:gap-16 shadow-3xl">
                   <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8">
                     <div className="space-y-3">
                        <h4 className="text-4xl sm:text-5xl font-black text-white uppercase tracking-tighter leading-none">Pool de Diseño</h4>
                        <div className="flex items-center gap-3">
                           <div className="h-px w-8 bg-blue-500" />
                           <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">Escenario: {parameters.material} | Objetivo: {parameters.analysisMode}</p>
                        </div>
                     </div>
                     <button className="inline-flex items-center justify-center gap-3 rounded-2xl bg-white/[0.03] border border-white/5 px-8 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:bg-white/5 hover:text-white transition-all shadow-lg active:scale-95">
                       <Share2 className="h-4 w-4" /> Exportar Reporte {candidates.length > 1 ? 'Grupal' : ''}
                     </button>
                   </div>
                   
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                      {candidates.map(candidate => (
                        <div key={candidate.id} className="p-7 sm:p-9 rounded-[2.5rem] border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10 transition-all group relative overflow-hidden flex flex-col h-full shadow-2xl">
                           <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Box className="h-4 w-4 text-zinc-700" />
                           </div>
                           
                           <div className="flex items-center justify-between mb-6 text-[9px] font-black uppercase tracking-widest border-b border-white/[0.03] pb-4">
                              <span className="text-blue-500">{candidate.geometry}</span>
                              <span className={`px-2.5 py-1 rounded-full ${candidate.assessment.status === 'strong' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-800 text-zinc-500'}`}>
                                {candidate.assessment.status}
                              </span>
                           </div>
                           <h5 className="text-lg sm:text-xl font-bold text-zinc-200 mb-8 grow leading-[1.1]">{candidate.label}</h5>
                           
                           <div className="grid grid-cols-1 gap-2 pt-6 border-t border-white/5">
                              <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 mb-2">
                                 <span>RESISTENCIA:</span>
                                 <span className="text-white font-bold">{candidate.metrics.strength} MPa</span>
                              </div>
                              <div className="h-10 w-full flex items-center justify-center rounded-xl bg-blue-600/10 text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all transition-duration-500 cursor-pointer">
                                 <span className="text-[10px] font-black uppercase tracking-widest">Ver Detalles</span>
                              </div>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              )}
           </div>

           {/* Analytical Sidebar (Step 5: Reference) */}
           <div className="lg:col-span-4 flex flex-col gap-10 lg:gap-14">
              <div className="flex items-center gap-4">
                 <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-400">
                   <Layers className="h-5 w-5" />
                 </div>
                 <div className="flex flex-col">
                    <h3 className="text-xs font-black uppercase tracking-widest text-white">Guía Metodológica</h3>
                    <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mt-0.5">Referencia de parámetros físicos</p>
                 </div>
              </div>
              <MetricExplanationPanel />
           </div>
        </div>
      </div>
    </section>
  );
}
