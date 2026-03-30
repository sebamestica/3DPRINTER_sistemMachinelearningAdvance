import { Link } from 'react-router-dom';
import { FlaskConical } from 'lucide-react';

export function AdvancedNavButton() {
  return (
    <Link
      to="/advanced"
      className="group relative inline-flex items-center gap-3 overflow-hidden rounded-2xl border border-blue-500/30 bg-blue-500/10 px-6 py-4 text-sm font-bold text-blue-200 transition-all hover:border-blue-400/50 hover:bg-blue-500/20 hover:text-white hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] shadow-lg active:scale-95"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <FlaskConical className="h-5 w-5 group-hover:rotate-12 transition-transform" />
      
      <div className="flex flex-col items-start leading-none">
        <span className="uppercase tracking-widest text-[10px] text-blue-400/80 mb-1">Inspección Técnica</span>
        <span>Abrir Laboratorio Avanzado</span>
      </div>

      <span className="ml-2 opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
    </Link>
  );
}
