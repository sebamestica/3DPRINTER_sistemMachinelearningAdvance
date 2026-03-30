import type { VisualMode } from '../../types/visualization';

const modes: { value: VisualMode; label: string; icon: string }[] = [
  { value: 'solid', label: 'Sólido', icon: '📦' },
  { value: 'transparent', label: 'Translúcido', icon: '🫙' },
  { value: 'internal-only', label: 'Solo Estructura', icon: '🕸️' },
  { value: 'section', label: 'Seccionado', icon: '📐' },
  { value: 'exploded', label: 'Explotado', icon: '💥' },
];

interface Props {
  value: VisualMode;
  onChange: (mode: VisualMode) => void;
}

export function VisualizationModeSelector({ value, onChange }: Props) {
  return (
    <div className="space-y-3">
      <label className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500 flex items-center gap-2">
        <span>🔍</span> Modo de Visualización
      </label>

      <div className="grid grid-cols-2 gap-2">
        {modes.map((mode) => (
          <button
            key={mode.value}
            type="button"
            onClick={() => onChange(mode.value)}
            className={`group relative flex items-center gap-3 overflow-hidden rounded-xl border px-3 py-2.5 text-sm transition-all duration-300 ${
              value === mode.value
                ? 'border-blue-500/50 bg-blue-500/10 text-white shadow-[0_0_15px_rgba(59,130,246,0.15)]'
                : 'border-white/5 bg-white/5 text-zinc-400 hover:border-white/20 hover:text-white hover:bg-white/10'
            }`}
          >
             {/* Glow effect on hover/active */}
            {value === mode.value && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/15 via-transparent to-transparent pointer-events-none" />
            )}
            
            <span className="relative z-10 text-base">{mode.icon}</span>
            <span className="relative z-10 font-medium truncate">{mode.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
