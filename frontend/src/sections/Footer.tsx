import { Globe, Share2, Mail, ExternalLink, Activity } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="relative mt-20 border-t border-white/5 bg-black pb-12 pt-16 text-center overflow-hidden">
      <div className="absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 border border-white/5 shadow-2xl text-primary">
            <Activity className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-xl font-black tracking-tight text-white uppercase">CUBE-RESISTENCE v2.0</h2>
          <p className="mt-2 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">
             Unidad de Ingeniería & Análisis Estructural 3D
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-lg grid-cols-1 gap-12 text-center sm:grid-cols-2">
          <div className="space-y-4">
             <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Documentación Técnica</h3>
             <ul className="flex flex-col gap-2">
                <li><a href="#" className="group flex items-center justify-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors">Norma ASTM C109 <ExternalLink className="h-3 w-3 group-hover:text-primary transition-colors" /></a></li>
                <li><a href="#" className="group flex items-center justify-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors">Cualificación de Materiales <ExternalLink className="h-3 w-3 group-hover:text-primary transition-colors" /></a></li>
                <li><a href="#" className="group flex items-center justify-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors">Metodología de Análisis <ExternalLink className="h-3 w-3 group-hover:text-primary transition-colors" /></a></li>
             </ul>
          </div>

          <div className="space-y-4 text-center">
             <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Recursos Académicos</h3>
             <ul className="flex flex-col gap-2">
                <li><a href="#" className="group flex items-center justify-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"><Globe className="h-3.5 w-3.5 group-hover:text-primary transition-colors" /> Repositorio GitHub</a></li>
                <li><a href="#" className="group flex items-center justify-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"><Share2 className="h-3.5 w-3.5 group-hover:text-primary transition-colors" /> Publicación Técnica</a></li>
                <li><a href="#" className="group flex items-center justify-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"><Mail className="h-3.5 w-3.5 group-hover:text-primary transition-colors" /> Contacto de Ingeniería</a></li>
             </ul>
          </div>
        </div>

        <div className="mt-20 flex flex-col items-center justify-center gap-6 border-t border-white/5 pt-12 text-center">
          <p className="max-w-xl text-[10px] leading-relaxed text-zinc-700 italic font-medium uppercase tracking-tighter">
             Este frontend es una herramienta de previsualización técnica para la toma de decisiones preliminares. Los resultados son estimaciones basadas en lógica heurística y no reemplazan ensayos de laboratorio certificados o simulaciones por Elementos Finitos (FEA).
          </p>
          <div className="flex items-center gap-2 text-zinc-800 text-[10px] font-black uppercase tracking-widest overflow-hidden h-4">
             <span>© {currentYear} SEBASTIÁN AMÉSTICA</span>
             <div className="h-1 w-1 rounded-full bg-zinc-800" />
             <span>ANTIGRAVITY ENGINEERING UNIT</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
