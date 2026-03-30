import { Database, Cpu, Activity, LayoutDashboard, Share2, ClipboardCheck } from 'lucide-react';

export function MethodologySection() {
  const steps = [
    { title: 'Entrada de Parámetros', icon: Database, desc: 'Configuración de material, infill, temperatura y patrón.' },
    { title: 'Cálculo Heurístico', icon: Cpu, desc: 'Algoritmo que estima resistencia y deformación basándose en perfiles geométricos.' },
    { title: 'Modelado 3D', icon: Share2, desc: 'Representación visual del cubo y su patrón interno bajo compresión.' },
    { title: 'Resultados Técnicos', icon: Activity, desc: 'Métricas de MPa, distribución de carga y absorción de energía.' },
    { title: 'Mapa Crítico', icon: LayoutDashboard, desc: 'Identificación visual de zonas de estrés y deformación vertical.' },
    { title: 'Veredicto de Decisión', icon: ClipboardCheck, desc: 'Recomendación final sobre la viabilidad del prototipo.' }
  ];

  return (
    <section className="py-24 px-6 md:px-12 bg-zinc-950 border-y border-white/5 relative overflow-hidden">
      <div className="container mx-auto max-w-7xl flex flex-col gap-16 relative z-10">
        <div className="flex flex-col gap-4 text-center items-center">
           <div className="inline-flex items-center gap-3">
              <div className="h-px w-12 bg-primary/50" />
              <span className="text-xs font-black uppercase tracking-[0.4em] text-primary">Flujo Metodológico</span>
           </div>
           <h2 className="text-5xl font-black tracking-tight text-white uppercase sm:text-6xl">Lógica de Evaluación</h2>
           <p className="max-w-xl text-lg font-medium leading-relaxed text-zinc-500">
              Transformación de parámetros de fabricación en hallazgos técnicos para soporte a la decisión.
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 rounded-3xl overflow-hidden shadow-2xl">
           {steps.map((step, i) => (
              <div key={i} className="bg-zinc-950 p-12 flex flex-col gap-6 hover:bg-zinc-900 transition-all duration-500 border border-white/5">
                 <div className="flex items-center justify-between">
                    <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-zinc-900 border border-white/5 text-primary">
                                               <step.icon className="h-5 w-5" />
                    </div>
                    <div className="text-[10px] font-black text-zinc-700 tracking-widest uppercase">Paso 0{i + 1}</div>
                 </div>
                 <h3 className="text-xl font-black text-white uppercase tracking-tight">{step.title}</h3>
                 <p className="text-sm font-medium leading-relaxed text-zinc-500 uppercase tracking-tighter">
                    {step.desc}
                 </p>
              </div>
           ))}
        </div>
      </div>
    </section>
  );
}
