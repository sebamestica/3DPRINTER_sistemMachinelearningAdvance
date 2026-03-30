import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CubeAssemblyScene } from '../components/visualization/CubeAssemblyScene';
import { useAdvancedAnalysis } from '../hooks/useAdvancedAnalysis';
import { 
  ArrowLeft, Activity, TrendingUp, Eye, Cpu, 
  Package, Target, AlertCircle, CheckCircle2, ChevronRight, Share2, 
  CornerRightDown, Info, Zap, Shield, Microscope, ChevronLeft, Hexagon, HelpCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { buildDecisionAssessment } from '../lib/decisionRules';

export function AdvancedLabPage() {
  const { parameters, advancedConfig, metrics, results, updateAdvanced, updateBase } = useAdvancedAnalysis();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'architecture' | 'manufacturing'>('architecture');

  // Structural Decision Engine
  const assessment = useMemo(() => buildDecisionAssessment(parameters, results as any), [parameters, results]);

  // Insights based on parameter values
  const getInsight = (param: string) => {
    switch(param) {
      case 'cellulose': return 'Reduce el tamaño del poro interno. Aumenta la rigidez pero puede hacer la pieza quebradiza.';
      case 'strut': return 'Aumenta el grosor de los pilares internos. Impacto directo en la carga MPa máxima.';
      case 'infill': return 'Densidad global de material. El factor crítico que determina el peso y coste.';
      default: return 'Parámetro de configuración geométrica para control de mallas estructurales.';
    }
  };

  return (
    <div className="h-screen w-screen bg-[#050505] text-zinc-300 font-sans selection:bg-blue-500/30 overflow-hidden flex flex-col antialiased">
      
      {/* 1. MASTER HEADER HUD */}
      <header className="h-16 shrink-0 bg-black/40 backdrop-blur-3xl border-b border-white/[0.05] flex items-center justify-between px-8 z-50">
        <div className="flex items-center gap-10">
          <Link to="/" className="group flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-all">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> 
            <span className="hidden md:inline">Dashboard</span>
          </Link>
          <div className="h-6 w-px bg-white/10" />
          <div className="flex items-center gap-4">
             <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                <Microscope className="h-5 w-5 text-white" />
             </div>
             <div>
                <h1 className="text-sm font-black uppercase tracking-widest text-white leading-none">Advanced Structural Inspector</h1>
                <p className="text-[10px] font-bold text-zinc-600 uppercase mt-1 tracking-[0.3em]">Module: Laboratorio de Análisis de Capas v4.5</p>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
           <button 
             onClick={() => alert('Prueba de Carga: Inicializando motores de simulación...')}
             className="h-10 px-6 flex items-center gap-3 rounded-xl bg-blue-600 text-white text-[11px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20 active:scale-95"
           >
              <Zap className="h-4 w-4 fill-current" /> Run Simulation
           </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        
        {/* 2. SIDEBAR - DOCKED TOOLS (LEFT) */}
        <AnimatePresence initial={false}>
          {sidebarOpen && (
            <motion.aside 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 440, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="h-full shrink-0 border-r border-white/5 bg-[#080808] flex flex-col z-40 relative shadow-2xl"
            >
               {/* Fixed Tabs for Control Groups */}
               <div className="flex border-b border-white/5 bg-black/20">
                  {['architecture', 'manufacturing'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab as any)}
                      className={`flex-1 py-5 text-[10px] font-black uppercase tracking-[0.3em] transition-all relative ${
                        activeTab === tab ? "text-blue-500 bg-blue-500/[0.02]" : "text-zinc-600 hover:text-zinc-400"
                      }`}
                    >
                      {tab}
                      {activeTab === tab && <motion.div layoutId="adv-tab" className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500" />}
                    </button>
                  ))}
               </div>

               <div className="p-10 space-y-12 overflow-y-auto custom-scrollbar flex-1 pb-40">
                  {activeTab === 'architecture' ? (
                    <div className="space-y-10">
                       <section className="space-y-6">
                          <header className="flex items-center justify-between pb-4 border-b border-white/5">
                             <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-white flex items-center gap-3">
                                <Hexagon className="h-4 w-4 text-blue-500" /> Geometría Base
                             </h4>
                             <span className="text-[9px] font-bold text-zinc-700 uppercase">MOD_01</span>
                          </header>
                          <div className="grid grid-cols-2 gap-3">
                             {['solid', 'gyroid', 'honeycomb', 'lattice'].map(geo => (
                               <button
                                 key={geo}
                                 onClick={() => updateBase({ geometry: geo as any })}
                                 className={`py-4 px-6 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                                   parameters.geometry === geo ? "bg-blue-600/10 border-blue-500/40 text-white shadow-[0_0_20px_rgba(37,99,235,0.1)]" : "bg-white/[0.02] border-white/5 text-zinc-600 hover:text-zinc-400"
                                 }`}
                               >
                                 {geo}
                               </button>
                             ))}
                          </div>
                       </section>

                       <section className="space-y-8">
                          <header className="flex items-center gap-3">
                             <label className="text-[11px] font-black text-zinc-500 uppercase tracking-widest">Ajustes Estructurales</label>
                             <Info className="h-3.5 w-3.5 text-zinc-800" />
                          </header>

                          {/* Complex Range Control */}
                          <div className="space-y-6">
                             <div className="p-5 rounded-3xl bg-white/[0.01] border border-white/5 space-y-4 hover:border-blue-500/20 transition-all group">
                                <div className="flex justify-between items-center px-1">
                                   <div className="space-y-1">
                                      <span className="text-[10px] font-black text-white/90 uppercase tracking-tight">Escala de Celda</span>
                                      <p className="text-[10px] text-zinc-600 group-hover:text-zinc-400 transition-colors">{getInsight('cellulose')}</p>
                                   </div>
                                   <span className="text-sm font-black text-blue-500 tabular-nums px-3 py-1 bg-blue-500/10 rounded-xl">{advancedConfig.cellSize.toFixed(2)}x</span>
                                </div>
                                <input 
                                  type="range" min="0.5" max="3" step="0.1"
                                  value={advancedConfig.cellSize}
                                  onChange={(e) => updateAdvanced({ cellSize: parseFloat(e.target.value) })}
                                  className="w-full accent-blue-500 h-2 bg-zinc-900 rounded-full cursor-pointer"
                                />
                             </div>

                             <div className="p-5 rounded-3xl bg-white/[0.01] border border-white/5 space-y-4 hover:border-blue-500/20 transition-all group">
                                <div className="flex justify-between items-center px-1">
                                   <div className="space-y-1">
                                      <span className="text-[10px] font-black text-white/90 uppercase tracking-tight">Grosor de Pilar (Strut)</span>
                                      <p className="text-[10px] text-zinc-600 group-hover:text-zinc-400 transition-colors">{getInsight('strut')}</p>
                                   </div>
                                   <span className="text-sm font-black text-blue-500 tabular-nums px-3 py-1 bg-blue-500/10 rounded-xl">{advancedConfig.strutThickness.toFixed(2)}cm</span>
                                </div>
                                <input 
                                  type="range" min="0.05" max="0.5" step="0.02"
                                  value={advancedConfig.strutThickness}
                                  onChange={(e) => updateAdvanced({ strutThickness: parseFloat(e.target.value) })}
                                  className="w-full accent-blue-500 h-2 bg-zinc-900 rounded-full cursor-pointer"
                                />
                             </div>
                          </div>
                       </section>
                    </div>
                  ) : (
                    <div className="space-y-10 animate-in slide-in-from-right duration-300">
                       <section className="space-y-6">
                         <header className="flex items-center justify-between pb-4 border-b border-white/5">
                             <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-white flex items-center gap-3">
                                <Package className="h-4 w-4 text-orange-500" /> Ciencia de Materiales
                             </h4>
                             <span className="text-[9px] font-bold text-zinc-700 uppercase">MAT_LAB</span>
                          </header>
                          <div className="grid grid-cols-2 gap-3">
                             {['PLA', 'ABS', 'PETG', 'TPU'].map(mat => (
                               <button
                                 key={mat}
                                 onClick={() => updateBase({ material: mat as any })}
                                 className={`py-4 px-6 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                                   parameters.material === mat ? "bg-orange-500/10 border-orange-500/40 text-orange-400" : "bg-white/[0.02] border-white/5 text-zinc-600"
                                 }`}
                               >
                                 {mat}
                               </button>
                             ))}
                          </div>
                       </section>

                       <section className="p-7 rounded-3xl bg-orange-500/5 border border-orange-500/10 space-y-6">
                           <div className="flex justify-between items-center">
                              <label className="text-[11px] font-black text-orange-400 uppercase tracking-[0.2em]">Infill Global (%)</label>
                              <span className="text-2xl font-black text-white tabular-nums">{(parameters.infill).toFixed(0)}%</span>
                           </div>
                           <input 
                             type="range" min="10" max="100" step="5"
                             value={parameters.infill}
                             onChange={(e) => updateBase({ infill: parseInt(e.target.value) })}
                             className="w-full accent-orange-500 h-2 bg-zinc-900 rounded-full cursor-pointer"
                           />
                           <p className="text-[10px] text-zinc-600 uppercase font-bold leading-relaxed">
                              Impacto: {getInsight('infill')}
                           </p>
                       </section>
                    </div>
                  )}
                  
                  {/* Rendering Tools Grid */}
                  <section className="space-y-6 pt-10 border-t border-white/5">
                     <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-6">Visual Analysis HUD</h4>
                     <div className="grid grid-cols-2 gap-3">
                        {[
                          { id: 'showWireframe', label: 'Wireframe Mod', icon: Eye },
                          { id: 'showEdges', label: 'Edge Highlight', icon: LayoutGrid },
                          { id: 'showNodes', label: 'Node View', icon: Target },
                          { id: 'showHeatOverlay', label: 'Strain Overlay', icon: Activity }
                        ].map(f => (
                          <button
                            key={f.id}
                            onClick={() => updateAdvanced({ [f.id as any]: !advancedConfig[f.id as keyof typeof advancedConfig] })}
                            className={`flex flex-col items-center gap-3 py-6 rounded-2xl border text-[9px] font-black uppercase tracking-widest transition-all ${
                              advancedConfig[f.id as keyof typeof advancedConfig] ? "bg-emerald-600/10 border-emerald-500/30 text-emerald-400 shadow-glow" : "bg-white/[0.01] border-white/5 text-zinc-700"
                            }`}
                          >
                             <f.icon className="h-4 w-4" />
                             {f.label}
                          </button>
                        ))}
                     </div>
                  </section>
               </div>

               {/* Absolute Lower Status */}
               <div className="mt-auto p-8 border-t border-white/5 bg-black/40 backdrop-blur">
                  <button 
                    onClick={() => alert('Configuración enviada a fabricación.')}
                    className="w-full h-14 bg-white text-black text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-blue-500 hover:text-white transition-all flex items-center justify-between px-8 group active:scale-[0.98] shadow-2xl"
                  >
                     <span>Deploy Protocol</span>
                     <Share2 className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                  </button>
               </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* 3. MAIN CENTER VIEWPORT (HERO) */}
        <main className="flex-1 flex flex-col relative bg-[#020202] overflow-hidden">
           
           {/* Sidebar Toggle */}
           <button 
             onClick={() => setSidebarOpen(!sidebarOpen)}
             className="absolute left-6 top-1/2 -translate-y-1/2 h-24 w-4 bg-zinc-900/80 border border-white/10 rounded-full z-50 text-zinc-600 hover:text-white hover:border-blue-500 transition-all flex items-center justify-center group"
           >
             {sidebarOpen ? <ChevronLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" /> : <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />}
           </button>

           {/* DYNAMIC KPI OVERLAY (DOCK NEXT TO GRAPHICS) */}
           <div className="absolute top-10 right-10 z-20 flex flex-col gap-6 items-end">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-8 rounded-[3rem] bg-black/80 backdrop-blur-3xl border border-white/10 shadow-3xl min-w-[320px] space-y-8"
              >
                 <div className="space-y-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">Carga Crítica de Yield</span>
                    <div className="flex items-baseline gap-4">
                       <span className="text-6xl md:text-7xl font-black text-white italic tracking-tighter tabular-nums drop-shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                         {results.compressiveStrength}
                       </span>
                       <span className="text-3xl font-black text-blue-500 italic uppercase">MPa</span>
                    </div>
                 </div>

                 <div className="h-px w-full bg-white/5" />

                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                       <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Def. Relativa</span>
                       <div className="text-2xl font-black text-white tabular-nums tracking-tighter">{results.relativeDeformation} <span className="text-xs text-zinc-500">mm</span></div>
                    </div>
                    <div className="space-y-1 border-l border-white/5 pl-6">
                       <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Eficiencia</span>
                       <div className="text-2xl font-black text-emerald-500 tabular-nums tracking-tighter">{(results.compressiveStrength / (metrics.occupiedVolumeRatio * 100)).toFixed(2)}</div>
                    </div>
                 </div>
              </motion.div>

              {/* Status Indicator Panel */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`px-8 py-5 rounded-3xl border text-[11px] font-black uppercase tracking-widest transition-all bg-black/80 backdrop-blur-xl shadow-2xl flex items-center gap-4 ${
                  assessment.status === 'strong' ? 'border-emerald-500/40 text-emerald-400' : 
                  assessment.status === 'promising' ? 'border-blue-500/40 text-blue-400' : 'border-orange-500/40 text-orange-400'
                }`}
              >
                 <div className="h-3 w-3 rounded-full bg-current animate-pulse shadow-[0_0_12px_currentColor]" />
                 {assessment.headline}
              </motion.div>
           </div>

           {/* Viewport HUD - Technical Info */}
           <div className="absolute top-10 left-10 z-20 space-y-4">
              <div className="bg-black/60 backdrop-blur-2xl px-6 py-4 rounded-[2rem] border border-white/10 space-y-2">
                 <h2 className="text-[10px] font-black tracking-[0.5em] text-zinc-500 uppercase">Prototipo Estructural</h2>
                 <div className="flex items-center gap-6">
                    <div className="flex flex-col">
                       <span className="text-xl font-black text-white uppercase italic tracking-tighter">Cubo 5x5x5 cm</span>
                       <span className="text-[9px] font-bold text-blue-500 uppercase leading-none tracking-widest">L Escala 1:1</span>
                    </div>
                    <div className="h-8 w-px bg-white/10" />
                    <div className="flex flex-col">
                       <span className="text-xl font-black text-white uppercase italic tracking-tighter">{parameters.geometry}</span>
                       <span className="text-[9px] font-bold text-zinc-600 uppercase leading-none tracking-widest">Architecture</span>
                    </div>
                 </div>
              </div>

              {/* Secondary Metric HUD Widgets */}
              <div className="grid grid-cols-2 gap-4">
                 {[
                   { label: 'Vol Ocupado', val: (metrics.occupiedVolumeRatio * 100).toFixed(1) + '%', sub: 'Fill Ratio %' },
                   { label: 'Continuidad', val: (metrics.structuralContinuity * 100).toFixed(1) + '%', sub: 'Load Path Continuity' }
                 ].map((m, i) => (
                   <motion.div key={i} whileHover={{ y: -4 }} className="p-6 rounded-[2rem] bg-black/40 backdrop-blur border border-white/[0.03] space-y-1">
                      <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{m.label}</span>
                      <div className="text-2xl font-black text-white tabular-nums tracking-tighter">{m.val}</div>
                      <span className="text-[7px] font-bold text-zinc-800 uppercase tracking-[0.2em]">{m.sub}</span>
                   </motion.div>
                 ))}
              </div>
           </div>

           {/* The Stage */}
           <div className="flex-1 relative cursor-crosshair">
              <CubeAssemblyScene parameters={{
                ...parameters,
                visualMode: advancedConfig.showWireframe ? 'wireframe' : 'transparent',
                transparency: advancedConfig.transparency
              }} />
              
              {/* CROSSHAIR Technical Overlay */}
              <div className="absolute inset-x-0 bottom-12 flex justify-center pointer-events-none">
                 <div className="flex items-stretch divide-x divide-white/[0.05] bg-black/80 backdrop-blur-3xl border border-white/20 rounded-full h-16 px-10 shadow-3xl pointer-events-auto">
                    {[
                      { icon: <CornerRightDown className="h-4 w-4" />, val: metrics.nodeDensity.toFixed(2), label: 'Node Dens' },
                      { icon: <Cpu className="h-4 w-4" />, val: (metrics.geometricComplexity * 10).toFixed(1), label: 'Geom Comp' },
                      { icon: <Package className="h-4 w-4" />, val: metrics.estimatedMaterialUsage.toFixed(1) + 'x', label: 'Material usage' }
                    ].map((item, idx) => (
                      <div key={idx} className="px-10 flex items-center gap-5 group cursor-default">
                         <div className="h-9 w-9 flex items-center justify-center rounded-xl bg-white/5 text-zinc-600 group-hover:text-blue-500 transition-colors">
                            {item.icon}
                         </div>
                         <div className="flex flex-col">
                            <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest leading-none mb-1.5">{item.label}</span>
                            <span className="text-xl font-black text-white leading-none tabular-nums tracking-tighter">{item.val}</span>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>

              {/* Viewport Labels Overlay GRID */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.05]">
                 <pattern id="grid-adv" width="60" height="60" patternUnits="userSpaceOnUse">
                    <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5"/>
                 </pattern>
                 <rect width="100%" height="100%" fill="url(#grid-adv)" />
              </svg>
           </div>
        </main>
      </div>
    </div>
  );
}

const LayoutGrid = () => <Target className="h-4 w-4" />;
