import { cn } from '@/lib/utils';
import { AgentStep, agentSteps } from '@/data/mockData';

interface AgentStepsPillsProps {
  currentStep: AgentStep;
  isAnimating?: boolean;
}

export function AgentStepsPills({ currentStep, isAnimating = false }: AgentStepsPillsProps) {
  const currentIndex = agentSteps.indexOf(currentStep);

  return (
    <div className="flex items-center gap-1 py-2 px-3 bg-muted/30 rounded-lg">
      <span className="text-xs text-muted-foreground mr-2">Agent steps:</span>
      <div className="flex items-center gap-1">
        {agentSteps.map((step, index) => {
          const isActive = index === currentIndex;
          const isCompleted = index < currentIndex;
          const isPending = index > currentIndex;

          return (
            <div key={step} className="flex items-center">
              <div
                className={cn(
                  'px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-300',
                  isActive && 'bg-primary text-primary-foreground animate-pulse',
                  isCompleted && 'bg-primary/20 text-primary',
                  isPending && 'bg-muted text-muted-foreground'
                )}
              >
                {step}
              </div>
              {index < agentSteps.length - 1 && (
                <div
                  className={cn(
                    'w-4 h-px mx-0.5 transition-colors',
                    isCompleted ? 'bg-primary/40' : 'bg-border'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
