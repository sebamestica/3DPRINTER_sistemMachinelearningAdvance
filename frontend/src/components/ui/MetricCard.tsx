import React from 'react';
import { cn } from '../../lib/utils';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  description?: string;
  color?: string;
}

export function MetricCard({ label, value, unit, icon, trend, description, color }: MetricCardProps) {
  return (
    <div className="group relative flex flex-col gap-4 overflow-hidden rounded-3xl border border-white/5 bg-zinc-900/40 p-8 transition-all hover:bg-white/5 hover:border-white/10 shadow-2xl backdrop-blur-3xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
           <div className={cn("flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 text-zinc-500 transition-colors group-hover:bg-primary group-hover:text-white group-hover:shadow-glow", color)}>
              {icon}
           </div>
           <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600 transition-colors group-hover:text-zinc-400">{label}</span>
        </div>
        {trend && (
          <div className={cn(
            "h-1.5 w-1.5 rounded-full shadow-glow",
            trend === 'up' ? "bg-green-500 shadow-green-500/40" : trend === 'down' ? "bg-red-500 shadow-red-500/40" : "bg-blue-500 shadow-blue-500/40"
          )} />
        )}
      </div>

      <div className="flex items-baseline gap-1.5 mt-2">
         <span className="text-4xl font-black tracking-tight text-white group-hover:text-primary transition-colors">{value}</span>
         {unit && <span className="text-xs font-black uppercase tracking-widest text-zinc-700">{unit}</span>}
      </div>

      {description && (
        <p className="mt-2 text-[10px] font-bold text-zinc-600 uppercase tracking-tighter leading-relaxed">
           {description}
        </p>
      )}

      {/* Background Graphic Element */}
      <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-primary/5 blur-3xl group-hover:bg-primary/10 transition-all" />
    </div>
  );
}
