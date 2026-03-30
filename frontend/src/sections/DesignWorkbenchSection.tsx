import { Activity, ShieldCheck, TrendingUp, FlaskConical, Scale } from 'lucide-react';
import { ParametersPanel } from '../components/controls/ParametersPanel';
import { CubeAssemblyScene } from '../components/visualization/CubeAssemblyScene';
import { RecommendationCard } from '../components/cards/RecommendationCard';
import { MetricCard } from '../components/ui/MetricCard';
import { useCubeAnalysis } from '../hooks/useCubeAnalysis';
import { AdvancedNavButton } from '../components/layout/AdvancedNavButton';
import { defaultParameters } from '../data/defaultParameters';

export function DesignWorkbenchSection() {
  const { parameters, results, recommendation, isUpdating, updateParameters, setParameters } = useCubeAnalysis();

  return (
    <section id="workbench" className="relative flex flex-col gap-12 py-24 px-6 md:px-12 bg-black overflow-hidden backdrop-blur-2xl">
      {/* Background Ambience / Cyber Gradients */}
      <div className="absolute top-0 right-0 h-[800px] w-[800px] -translate-y-1/2 translate-x-1/2 rounded-full bg-blue-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 h-[600px] w-[600px] translate-y-1/2 -translate-x-1/2 rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none" />

      <div className="container mx-auto max-w-7xl flex flex-col gap-12 relative z-10">
        
        {/* Header with Laboratory CTA */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="flex flex-col gap-4 max-w-3xl">
             <div className="flex items-center gap-3">
                <div className="h-[2px] w-12 bg-blue-500/50" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400">Design Studio v3.0</span>
             </div>
             <h2 className="text-5xl font-black tracking-tight text-white uppercase sm:text-6xl lg:text-7xl">
               Decision <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Workbench</span>
             </h2>
             <p className="max-w-xl text-lg font-medium leading-relaxed text-zinc-400">
                Configure y evalúe la arquitectura interna del <span className="text-white border-b border-blue-500/30">Cubo de 5x5x5 cm</span>. 
                Obtenga predicciones estructurales preliminares para guiar su prototipado físico.
             </p>
          </div>
          
          <div className="flex shrink-0">
             <AdvancedNavButton />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          {/* 1. Configuration Panel */}
          <div className="lg:col-span-3 order-2 lg:order-1 h-full">
            <ParametersPanel 
              parameters={parameters} 
              onUpdate={updateParameters} 
              isUpdating={isUpdating}
              onReset={() => setParameters(defaultParameters)}
            />
          </div>

          {/* 2. 3D Structural Preview */}
          <div className="lg:col-span-6 order-1 lg:order-2">
             <CubeAssemblyScene parameters={parameters} />
          </div>

          {/* 3. Prediction Outcomes */}
          <div className="lg:col-span-3 order-3 flex flex-col gap-6">
             <MetricCard 
                label="Resistencia" 
                value={results.compressiveStrength} 
                unit="MPa" 
                icon={<Activity className="h-4 w-4" />} 
                trend="neutral"
                description="Resistencia máxima estimada bajo carga vertical."
                color="group-hover:bg-blue-500"
             />
             <MetricCard 
                label="Deformación" 
                value={results.relativeDeformation} 
                unit="mm" 
                icon={<TrendingUp className="h-4 w-4" />} 
                trend="down"
                description="Acortamiento vertical relativo del cubo completo."
                color="group-hover:bg-indigo-500"
             />
             <MetricCard 
                label="Confianza" 
                value={(results.confidence * 100).toFixed(0)} 
                unit="%" 
                icon={<ShieldCheck className="h-4 w-4" />} 
                trend="up"
                description="Nivel de certidumbre del motor de predicción actual."
                color="group-hover:bg-emerald-500"
             />
          </div>
        </div>

        {/* 4. Strategic Recommendation & Analytical Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">
           {/* Primary Recommendation */}
           <div className="lg:col-span-8">
              <RecommendationCard recommendation={recommendation} />
           </div>

           {/* Analytical Indices */}
           <div className="lg:col-span-4 rounded-[2rem] border border-white/5 bg-zinc-900/20 p-8 flex flex-col backdrop-blur-sm">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-8 flex items-center gap-2">
                <Scale className="h-3 w-3" /> Distribución Estructural
              </h3>
              
              <div className="space-y-9">
                 <div className="space-y-4">
                    <div className="flex justify-between text-[11px] font-bold text-zinc-300 uppercase tracking-tight items-baseline">
                       <span>Isotropía / Distribución</span>
                       <span className="text-blue-400 text-sm">{(results.distributionIndex * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-2 w-full bg-zinc-800/50 rounded-full overflow-hidden p-[2px] border border-white/5">
                       <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.3)] transition-all duration-1000 ease-out" style={{ width: `${results.distributionIndex * 100}%` }} />
                    </div>
                 </div>

                 <div className="space-y-4">
                    <div className="flex justify-between text-[11px] font-bold text-zinc-300 uppercase tracking-tight items-baseline">
                       <span>Concentración de Esfuerzo</span>
                       <span className="text-orange-500 text-sm">{(results.concentrationIndex * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-2 w-full bg-zinc-800/50 rounded-full overflow-hidden p-[2px] border border-white/5">
                       <div className="h-full bg-gradient-to-r from-orange-600 to-orange-400 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.3)] transition-all duration-1000 ease-out" style={{ width: `${results.concentrationIndex * 100}%` }} />
                    </div>
                 </div>

                 <div className="space-y-4">
                    <div className="flex justify-between text-[11px] font-bold text-zinc-300 uppercase tracking-tight items-baseline">
                       <span>Absorción Conceptual</span>
                       <span className="text-indigo-400 text-sm">{(results.energyAbsorptionIndex * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-2 w-full bg-zinc-800/50 rounded-full overflow-hidden p-[2px] border border-white/5">
                       <div className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.3)] transition-all duration-1000 ease-out" style={{ width: `${results.energyAbsorptionIndex * 100}%` }} />
                    </div>
                 </div>
              </div>

              <div className="mt-12 pt-6 border-t border-white/5 group bg-white/[0.02] -mx-4 px-4 rounded-xl">
                 <div className="flex items-start gap-4 text-zinc-500 text-[10px] font-medium leading-relaxed italic group-hover:text-zinc-400 transition-colors">
                    <FlaskConical className="h-4 w-4 shrink-0 text-blue-500/50 mt-0.5" />
                    <span>Interpretación basada en modelos heurísticos validados experimentalmente para probetas cúbicas 5×5×5 cm.</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </section>
  );
}
