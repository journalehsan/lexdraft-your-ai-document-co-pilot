import { cn } from '@/lib/utils';
import { ChatMessage } from '@/data/mockData';
import { Bot, User } from 'lucide-react';

interface ChatBubbleProps {
  message: ChatMessage;
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn('flex gap-3', isUser ? 'flex-row-reverse' : 'flex-row')}
    >
      {/* Avatar */}
      <div
        className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
          isUser ? 'bg-secondary' : 'bg-primary'
        )}
      >
        {isUser ? (
          <User className="h-4 w-4 text-secondary-foreground" />
        ) : (
          <Bot className="h-4 w-4 text-primary-foreground" />
        )}
      </div>

      {/* Message Content */}
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-3',
          isUser
            ? 'bg-primary text-primary-foreground rounded-tr-sm'
            : 'bg-card border border-border rounded-tl-sm'
        )}
      >
        <div className="text-sm whitespace-pre-wrap leading-relaxed">
          {message.content.split('\n').map((line, i) => {
            // Handle bold text
            const parts = line.split(/(\*\*[^*]+\*\*)/g);
            return (
              <p key={i} className={i > 0 ? 'mt-2' : ''}>
                {parts.map((part, j) => {
                  if (part.startsWith('**') && part.endsWith('**')) {
                    return (
                      <strong key={j} className="font-semibold">
                        {part.slice(2, -2)}
                      </strong>
                    );
                  }
                  return part;
                })}
              </p>
            );
          })}
        </div>
        <span
          className={cn(
            'text-xs mt-2 block',
            isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
          )}
        >
          {message.timestamp}
        </span>
      </div>
    </div>
  );
}
