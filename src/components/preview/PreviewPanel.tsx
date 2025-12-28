import { useState, useEffect, useCallback, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { TypewriterText } from './TypewriterText';
import { FileText, GitCompare, BookOpen } from 'lucide-react';
import { VditorEditor } from '@/components/editor/VditorEditor';

interface PreviewPanelProps {
  isGenerating?: boolean;
  selectedFileId?: string | null;
  documentContent?: string;
  onContentChange?: (content: string) => void;
}

export function PreviewPanel({ isGenerating = false, selectedFileId, documentContent = '', onContentChange }: PreviewPanelProps) {
  const [showTypewriter, setShowTypewriter] = useState(false);
  const [typewriterComplete, setTypewriterComplete] = useState(true);
  const [editorValue, setEditorValue] = useState(documentContent);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isGenerating) {
      setShowTypewriter(true);
      setTypewriterComplete(false);
    }
  }, [isGenerating]);

  useEffect(() => {
    setEditorValue(documentContent);
  }, [documentContent, selectedFileId]);

  const handleEditorChange = useCallback((value: string) => {
    setEditorValue(value);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      if (onContentChange) {
        onContentChange(value);
      }
    }, 500);
  }, [onContentChange]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const renderMarkdown = (content: string) => {
    return content.split('\n').map((line, index) => {
      // Headers
      if (line.startsWith('# ')) {
        return (
          <h1 key={index} className="text-2xl font-serif font-bold mt-6 mb-4 text-foreground">
            {line.slice(2)}
          </h1>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <h2 key={index} className="text-xl font-serif font-semibold mt-5 mb-3 text-foreground border-b border-border pb-2">
            {line.slice(3)}
          </h2>
        );
      }

      // Horizontal rule
      if (line === '---') {
        return <hr key={index} className="my-4 border-border" />;
      }

      // Bold text and regular paragraphs
      if (line.trim()) {
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        return (
          <p key={index} className="my-2 text-sm leading-relaxed text-foreground/90">
            {parts.map((part, j) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return (
                  <strong key={j} className="font-semibold text-foreground">
                    {part.slice(2, -2)}
                  </strong>
                );
              }
              // Handle citations
              if (part.includes('[*Citation:')) {
                const citationMatch = part.match(/\[\*Citation: ([^\]]+)\*\]/);
                if (citationMatch) {
                  return (
                    <span key={j}>
                      {part.replace(/\[\*Citation: [^\]]+\*\]/, '')}
                      <span className="text-xs text-primary italic bg-primary/10 px-1.5 py-0.5 rounded ml-1">
                        Citation: {citationMatch[1]}
                      </span>
                    </span>
                  );
                }
              }
              return part;
            })}
          </p>
        );
      }

      return <div key={index} className="h-2" />;
    });
  };

  const renderSkeleton = () => (
    <div className="space-y-4 p-6">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="h-4" />
      <Skeleton className="h-6 w-1/2" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-4 w-full" />
      <div className="h-4" />
      <Skeleton className="h-6 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-background">
      <Tabs defaultValue="preview" className="flex flex-col h-full">
        <div className="px-4 py-2 border-b border-border bg-card">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="preview" className="gap-1.5 text-xs">
              <FileText className="h-3.5 w-3.5" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="diff" className="gap-1.5 text-xs">
              <GitCompare className="h-3.5 w-3.5" />
              Diff
            </TabsTrigger>
            <TabsTrigger value="sources" className="gap-1.5 text-xs">
              <BookOpen className="h-3.5 w-3.5" />
              Sources
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="preview" className="flex-1 m-0 overflow-hidden">
          <div className="h-full w-full overflow-hidden">
            {isGenerating && !typewriterComplete ? (
              <ScrollArea className="h-full w-full">
                <div className="max-w-3xl mx-auto p-6 font-serif">
                  {renderSkeleton()}
                  <div className="p-6 border-t border-dashed border-border mt-4">
                    <p className="text-sm text-muted-foreground italic">
                      <TypewriterText
                        text="Generating document based on your requirements..."
                        speed={30}
                        onComplete={() => setTypewriterComplete(true)}
                      />
                    </p>
                  </div>
                </div>
              </ScrollArea>
            ) : (
              <div className="h-full w-full flex flex-col">
                <VditorEditor
                  value={editorValue}
                  onChange={handleEditorChange}
                  height="100%"
                />
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="diff" className="flex-1 m-0 overflow-hidden">
          <ScrollArea className="h-full w-full">
            <div className="p-6">
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="text-sm font-medium mb-3">Changes from last version</h3>
                <div className="space-y-2 font-mono text-xs">
                  <div className="flex">
                    <span className="text-destructive w-6">-</span>
                    <span className="text-destructive/80 line-through">
                      The purchase price shall be determined at closing.
                    </span>
                  </div>
                  <div className="flex">
                    <span className="text-green-600 w-6">+</span>
                    <span className="text-green-600">
                      The aggregate purchase price for all of the Shares shall be Fifty Million Dollars ($50,000,000) in cash.
                    </span>
                  </div>
                  <div className="h-2" />
                  <div className="flex">
                    <span className="text-destructive w-6">-</span>
                    <span className="text-destructive/80 line-through">
                      Closing shall occur within a reasonable timeframe.
                    </span>
                  </div>
                  <div className="flex">
                    <span className="text-green-600 w-6">+</span>
                    <span className="text-green-600">
                      The Closing shall take place sixty (60) days after the date hereof.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="sources" className="flex-1 m-0 overflow-hidden">
          <ScrollArea className="h-full w-full">
            <div className="p-6 space-y-3">
              <h3 className="text-sm font-medium mb-4">Referenced Sources</h3>
              {[
                { title: 'Delaware General Corporation Law § 251', type: 'Statute', relevance: 'High' },
                { title: 'Model Stock Purchase Agreement (ABA)', type: 'Template', relevance: 'High' },
                { title: 'SEC Form 8-K Filing Requirements', type: 'Regulation', relevance: 'Medium' },
                { title: 'Hart-Scott-Rodino Antitrust Improvements Act', type: 'Statute', relevance: 'Medium' },
              ].map((source, i) => (
                <div
                  key={i}
                  className="p-3 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium">{source.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{source.type}</p>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        source.relevance === 'High'
                          ? 'bg-primary/10 text-primary'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {source.relevance}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
