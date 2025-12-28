import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatBubble } from './ChatBubble';
import { AgentStepsPills } from './AgentStepsPills';
import { sampleChatMessages, AgentStep } from '@/data/mockData';

export function ChatPanel() {
  const [messages, setMessages] = useState(sampleChatMessages);
  const [inputValue, setInputValue] = useState('');
  const [currentStep, setCurrentStep] = useState<AgentStep>('Draft');
  const [isGenerating, setIsGenerating] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMessage = {
      id: `m${Date.now()}`,
      role: 'user' as const,
      content: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, newMessage]);
    setInputValue('');
    setIsGenerating(true);

    // Simulate agent steps progression
    const steps: AgentStep[] = ['Ask questions', 'Research', 'Draft', 'Refine'];
    let stepIndex = 0;

    const interval = setInterval(() => {
      if (stepIndex < steps.length) {
        setCurrentStep(steps[stepIndex]);
        stepIndex++;
      } else {
        clearInterval(interval);
        setIsGenerating(false);

        // Add a simulated response
        const response = {
          id: `m${Date.now() + 1}`,
          role: 'assistant' as const,
          content: 'I\'ve updated the document based on your input. You can see the changes in the Preview panel. Would you like me to refine any specific section?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, response]);
      }
    }, 1200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Chat Header */}
      <div className="px-4 py-3 border-b border-border bg-card">
        <h2 className="text-sm font-medium">Chat</h2>
        <p className="text-xs text-muted-foreground">Collaborate with AI to draft your document</p>
      </div>

      {/* Agent Steps */}
      <div className="px-4 py-2 border-b border-border">
        <AgentStepsPills currentStep={currentStep} isAnimating={isGenerating} />
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatBubble key={message.id} message={message} />
          ))}
          {isGenerating && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-primary-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-primary-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-primary-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
              <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-pulse" />
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border bg-card">
        <div className="flex gap-2 items-end">
          <Button variant="ghost" size="icon" className="shrink-0 h-10 w-10">
            <Paperclip className="h-4 w-4" />
          </Button>
          <Textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe what you want to draft..."
            className="min-h-[44px] max-h-32 resize-none bg-background"
            rows={1}
          />
          <Button
            onClick={handleSend}
            disabled={!inputValue.trim() || isGenerating}
            className="shrink-0 gap-2"
          >
            <Send className="h-4 w-4" />
            Generate
          </Button>
        </div>
      </div>
    </div>
  );
}
