import type { OnboardingStatus } from '../../hooks/useOnboardingState';

interface ProgressIndicatorProps {
  status: OnboardingStatus;
}

const steps: { label: string; id: OnboardingStatus }[] = [
  { label: 'Configuración', id: 'initial' },
  { label: 'Baseline', id: 'baseline_loaded' },
  { label: 'Análisis', id: 'analyzed' },
  { label: 'Comparación', id: 'compared' },
  { label: 'Selección', id: 'candidate_selected' }
];

export function ProgressIndicator({ status }: ProgressIndicatorProps) {
  const currentStepIndex = steps.findIndex(s => s.id === status);

  return (
    <div className="flex items-center gap-10">
      {steps.map((step, index) => {
        const isActive = index <= currentStepIndex;
        const isCurrent = index === currentStepIndex;

        return (
          <div key={step.id} className="flex items-center gap-4 group">
            <div className={`flex flex-col relative ${isActive ? 'opacity-100' : 'opacity-30'}`}>
               <span className={`text-[10px] font-black uppercase tracking-[0.4em] mb-2 ${isCurrent ? 'text-blue-500' : 'text-zinc-500'}`}>
                  0{index + 1}
               </span>
               <div className="flex flex-col">
                  <span className={`text-[12px] font-black uppercase tracking-tight ${isCurrent ? 'text-white' : 'text-zinc-600'}`}>
                    {step.label}
                  </span>
                  <div className={`h-0.5 mt-2 rounded-full transition-all duration-700 ${isActive ? 'bg-blue-500 w-full shadow-[0_0_10px_#3b82f6]' : 'bg-white/5 w-4'}`} />
               </div>
            </div>
            {index < steps.length - 1 && (
              <div className="h-px w-12 bg-white/5 mt-4" />
            )}
          </div>
        );
      })}
    </div>
  );
}
