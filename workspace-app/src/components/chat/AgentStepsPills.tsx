import { cn } from '@/lib/utils';
import { AgentStep, agentSteps } from '@/data/mockData';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface AgentStepsPillsProps {
  currentStep: AgentStep;
  isAnimating?: boolean;
}

const statusMessages = [
  { icon: '🔍', text: 'Researching Delaware stock purchase precedents…' },
  { icon: '📚', text: 'Reviewing standard representations & warranties…' },
  { icon: '⚖️', text: 'Analyzing indemnification clauses…' },
  { icon: '📝', text: 'Drafting closing conditions…' },
];

export function AgentStepsPills({ currentStep, isAnimating = false }: AgentStepsPillsProps) {
  const currentIndex = agentSteps.indexOf(currentStep);
  const statusMessage = statusMessages[currentIndex % statusMessages.length];

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1 py-2 px-3 bg-muted/30 rounded-lg overflow-hidden">
        <span className="text-xs text-muted-foreground mr-2 shrink-0">Agent steps:</span>
        <ScrollArea className="w-full">
          <div className="flex items-center gap-1 pb-2">
            {agentSteps.map((step, index) => {
              const isActive = index === currentIndex;
              const isCompleted = index < currentIndex;
              const isPending = index > currentIndex;

              return (
                <div key={step} className="flex items-center shrink-0">
                  <div
                    className={cn(
                      'px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-300 whitespace-nowrap',
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
                        'w-4 h-px mx-0.5 transition-colors shrink-0',
                        isCompleted ? 'bg-primary/40' : 'bg-border'
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" className="h-1.5" />
        </ScrollArea>
      </div>
      
      {/* Status line */}
      <div className="px-3 py-1.5 bg-muted/20 rounded-md border border-border/50">
        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
          <span className="animate-pulse">{statusMessage.icon}</span>
          <span className="truncate">{statusMessage.text}</span>
        </p>
      </div>
    </div>
  );
}
