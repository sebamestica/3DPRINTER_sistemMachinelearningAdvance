import { Thermometer, Layers, Box, Cpu, Package, Activity, Gauge, Briefcase, Eye, ShieldCheck, Ruler } from 'lucide-react';
import type { InputParameters, MaterialType, AnalysisMode } from '../../types/model';
import { GEOMETRIES } from '../../data/geometries';
import { VisualizationModeSelector } from './VisualizationModeSelector';

interface ParametersPanelProps {
  parameters: InputParameters;
  onUpdate: (params: Partial<InputParameters>) => void;
  isUpdating: boolean;
  onReset: () => void;
}

export function ParametersPanel({ parameters, onUpdate, isUpdating, onReset }: ParametersPanelProps) {
  const materials: MaterialType[] = ['PLA', 'ABS', 'PETG', 'TPU'];
  const analysisModes: AnalysisMode[] = ['strength', 'absorption', 'balance'];

  return (
    <div className="flex h-full flex-col gap-6 rounded-[2rem] border border-white/5 bg-zinc-900/40 p-7 shadow-2xl backdrop-blur-xl overflow-y-auto max-h-[85vh] scrollbar-hide">
      <div className="flex items-center justify-between sticky top-0 bg-zinc-900/10 backdrop-blur-sm z-10 pb-4 border-b border-white/5">
         <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400">
               <Cpu className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">Configuración del Prototipo</h3>
              <p className="text-[10px] text-zinc-500 font-medium">Parámetros de Diseño Estructural</p>
            </div>
         </div>
         <button 
           onClick={onReset}
           className="h-8 w-8 flex items-center justify-center rounded-full border border-white/5 text-zinc-500 hover:text-white hover:bg-white/5 transition-all"
           title="Reiniciar parámetros"
         >
           ↺
         </button>
      </div>

      <div className="space-y-7">
        {/* Visual Mode Selector Integrado */}
        <VisualizationModeSelector 
          value={parameters.visualMode} 
          onChange={(mode) => onUpdate({ visualMode: mode })} 
        />

        {/* Material Selection */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500">
            <Package className="h-3 w-3" /> Material de Impresión
          </label>
          <div className="grid grid-cols-4 gap-2">
            {materials.map(m => (
              <button
                key={m}
                onClick={() => onUpdate({ material: m })}
                className={`rounded-xl border px-2 py-2.5 text-[11px] font-bold transition-all ${
                  parameters.material === m 
                    ? "border-blue-500/50 bg-blue-500/20 text-white shadow-[0_0_10px_rgba(59,130,246,0.1)]" 
                    : "border-white/5 bg-white/5 text-zinc-500 hover:border-white/10 hover:text-zinc-400"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Geometry Selection */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500">
            <Box className="h-3 w-3" /> Arquitectura Interna
          </label>
          <div className="relative group">
            <select
              value={parameters.geometry}
              onChange={(e) => onUpdate({ geometry: e.target.value as any })}
              className="w-full appearance-none rounded-xl border border-white/5 bg-white/5 px-4 py-3.5 text-sm font-semibold text-white focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 outline-none transition-all cursor-pointer"
            >
              {GEOMETRIES.map(g => (
                <option key={g.type} value={g.type} className="bg-zinc-900">{g.name}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500 group-hover:text-zinc-300 transition-colors">
              ▼
            </div>
          </div>
        </div>

        {/* Main Structural Sliders */}
        <div className="space-y-6 pt-2">
          {/* Infill Density */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
              <span className="flex items-center gap-2 text-zinc-500"><Layers className="h-3 w-3" /> Densidad de Relleno (Infill)</span>
              <span className="text-blue-400">{parameters.infill}%</span>
            </div>
            <input
              type="range"
              min="10" max="100"
              value={parameters.infill}
              onChange={(e) => onUpdate({ infill: parseInt(e.target.value) })}
              className="h-1.5 w-full appearance-none rounded-lg bg-zinc-800 accent-blue-500 cursor-pointer"
            />
          </div>

          {/* Shell Thickness */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
              <span className="flex items-center gap-2 text-zinc-500"><ShieldCheck className="h-3 w-3" /> Grosor de Pared (Shell)</span>
              <span className="text-blue-400">{parameters.shellThickness} cm</span>
            </div>
            <input
              type="range"
              min="0.08" max="0.5" step="0.02"
              value={parameters.shellThickness}
              onChange={(e) => onUpdate({ shellThickness: parseFloat(e.target.value) })}
              className="h-1.5 w-full appearance-none rounded-lg bg-zinc-800 accent-blue-500 cursor-pointer"
            />
          </div>

          {/* Internal Padding */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
              <span className="flex items-center gap-2 text-zinc-500"><Ruler className="h-3 w-3" /> Separación Interna (Padding)</span>
              <span className="text-blue-400">{parameters.internalPadding} cm</span>
            </div>
            <input
              type="range"
              min="0.05" max="0.5" step="0.05"
              value={parameters.internalPadding}
              onChange={(e) => onUpdate({ internalPadding: parseFloat(e.target.value) })}
              className="h-1.5 w-full appearance-none rounded-lg bg-zinc-800 accent-blue-500 cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             {/* Temperature */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-zinc-500">
                <span><Thermometer className="h-3 w-3 inline mr-1" /> Temp.</span>
                <span className="text-blue-400">{parameters.temperature}°C</span>
              </div>
              <input
                type="range"
                min="190" max="260"
                value={parameters.temperature}
                onChange={(e) => onUpdate({ temperature: parseInt(e.target.value) })}
                className="h-1 w-full appearance-none rounded-lg bg-zinc-800 accent-blue-500 cursor-pointer"
              />
            </div>

            {/* Transparency */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-zinc-500">
                <span><Eye className="h-3 w-3 inline mr-1" /> Transp.</span>
                <span className="text-blue-400">{Math.round(parameters.transparency * 100)}%</span>
              </div>
              <input
                type="range"
                min="0" max="1" step="0.05"
                value={parameters.transparency}
                onChange={(e) => onUpdate({ transparency: parseFloat(e.target.value) })}
                className="h-1 w-full appearance-none rounded-lg bg-zinc-800 accent-blue-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Compression Level */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
              <span className="flex items-center gap-2 text-zinc-500"><Gauge className="h-3 w-3" /> Nivel de Compresión Vertical</span>
              <span className="text-orange-400">{parameters.compressionLevel}%</span>
            </div>
            <input
              type="range"
              min="0" max="100"
              value={parameters.compressionLevel}
              onChange={(e) => onUpdate({ compressionLevel: parseInt(e.target.value) })}
              className="h-1.5 w-full appearance-none rounded-lg bg-zinc-800 accent-orange-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Analysis Mode */}
        <div className="space-y-3 pt-4 border-t border-white/5">
           <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500">
              <Briefcase className="h-3 w-3" /> Modo de Análisis Estructural
           </label>
           <div className="flex gap-2">
              {analysisModes.map(mode => (
                 <button
                   key={mode}
                   onClick={() => onUpdate({ analysisMode: mode })}
                   className={`flex-1 rounded-xl border py-2.5 text-[10px] font-bold uppercase transition-all ${
                     parameters.analysisMode === mode 
                       ? "border-blue-500 bg-blue-500/20 text-white" 
                       : "border-white/5 bg-white/5 text-zinc-500 hover:text-zinc-300"
                   }`}
                 >
                   {mode === 'strength' ? 'Resistencia' : mode === 'absorption' ? 'Absorción' : 'Balance'}
                 </button>
              ))}
           </div>
        </div>
      </div>

      <button
        disabled={isUpdating}
        className={`group mt-auto flex w-full items-center justify-center gap-3 rounded-2xl px-6 py-4 text-xs font-black uppercase tracking-widest text-white transition-all shadow-xl active:scale-95 disabled:opacity-50 ${
          isUpdating ? 'bg-zinc-800' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 hover:shadow-blue-500/20'
        }`}
      >
        <Activity className={`h-4 w-4 ${isUpdating ? "animate-spin" : "group-hover:scale-110 transition-transform"}`} />
        {isUpdating ? "Recalculando Estructura..." : "Generar Análisis de Diseño"}
      </button>
    </div>
  );
}
