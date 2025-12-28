import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Mic, X, Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatBubble } from './ChatBubble';
import { AgentStepsPills } from './AgentStepsPills';
import { sampleChatMessages, AgentStep } from '@/data/mockData';
import { toast } from 'sonner';

type ComposerState = 'idle' | 'sending' | 'queued';

export function ChatPanel() {
  const [messages, setMessages] = useState(sampleChatMessages);
  const [inputValue, setInputValue] = useState('');
  const [currentStep, setCurrentStep] = useState<AgentStep>('Draft');
  const [composerState, setComposerState] = useState<ComposerState>('idle');
  const [queuedMessages, setQueuedMessages] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  const maxTextareaHeight = 200;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const adjustTextareaHeight = useCallback((textarea: HTMLTextAreaElement) => {
    textarea.style.height = 'auto';
    const newHeight = Math.min(textarea.scrollHeight, maxTextareaHeight);
    textarea.style.height = `${newHeight}px`;
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      adjustTextareaHeight(textareaRef.current);
    }
  }, [inputValue, adjustTextareaHeight]);

  const processMessage = useCallback(async (content: string) => {
    setComposerState('sending');

    const newMessage = {
      id: `m${Date.now()}`,
      role: 'user' as const,
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMessage]);

    return new Promise<void>((resolve) => {
      const steps: AgentStep[] = ['Ask questions', 'Research', 'Draft', 'Refine'];
      let stepIndex = 0;

      const interval = setInterval(() => {
        if (stepIndex < steps.length) {
          setCurrentStep(steps[stepIndex]);
          stepIndex++;
        } else {
          clearInterval(interval);

          const response = {
            id: `m${Date.now() + 1}`,
            role: 'assistant' as const,
            content: 'I\'ve updated the document based on your input. You can see the changes in the Preview panel. Would you like me to refine any specific section?',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          setMessages((prev) => [...prev, response]);
          setComposerState('idle');
          resolve();
        }
      }, 1200);
    });
  }, []);

  useEffect(() => {
    if (composerState === 'idle' && queuedMessages.length > 0) {
      const nextMessage = queuedMessages[0];
      setQueuedMessages((prev) => prev.slice(1));
      processMessage(nextMessage);
    }
  }, [composerState, queuedMessages, processMessage]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    if (composerState === 'idle') {
      processMessage(inputValue.trim());
      setInputValue('');
      if (textareaRef.current) {
        adjustTextareaHeight(textareaRef.current);
      }
    } else {
      setQueuedMessages((prev) => [...prev, inputValue.trim()]);
      setInputValue('');
      if (textareaRef.current) {
        adjustTextareaHeight(textareaRef.current);
      }
      setComposerState('queued');
    }
  };

  const handleCancelQueue = () => {
    setQueuedMessages([]);
    setComposerState('idle');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = () => {
    setIsComposing(false);
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Voice input not supported in this browser');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onstart = () => {
      setIsListening(true);
    };

    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputValue((prev) => prev + (prev ? ' ' : '') + transcript);
      setIsListening(false);
    };

    recognitionRef.current.onerror = () => {
      setIsListening(false);
      toast.error('Voice recognition error');
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const handleToggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const isGenerating = composerState === 'sending' || composerState === 'queued';

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
        <div className="relative">
          <div className="flex items-end gap-2 rounded-lg border border-border bg-background p-2 shadow-sm">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0 h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={() => {}}
            >
              <Plus className="h-4 w-4" />
            </Button>

            <div className="flex-1 relative min-w-0">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onCompositionStart={handleCompositionStart}
                onCompositionEnd={handleCompositionEnd}
                placeholder="Describe what you want to draft..."
                className="w-full resize-none bg-transparent border-0 p-0 text-sm focus:outline-none focus:ring-0 placeholder:text-muted-foreground max-h-[200px] overflow-y-auto"
                rows={1}
                style={{ height: 'auto' }}
              />
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {isListening && (
                <span className="text-xs text-muted-foreground animate-pulse mr-1">
                  Listening...
                </span>
              )}

              {queuedMessages.length > 0 && (
                <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md text-xs">
                  <span className="text-muted-foreground">Queued ({queuedMessages.length})</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 text-muted-foreground hover:text-foreground"
                    onClick={handleCancelQueue}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={`shrink-0 h-8 w-8 ${isListening ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={handleToggleListening}
              >
                <Mic className="h-4 w-4" />
              </Button>

              <Button
                type="button"
                variant="default"
                size="icon"
                className="shrink-0 h-8 w-8"
                onClick={handleSend}
                disabled={!inputValue.trim()}
              >
                {composerState === 'sending' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Press Enter to send, Shift+Enter for newline
        </p>
      </div>
    </div>
  );
}
