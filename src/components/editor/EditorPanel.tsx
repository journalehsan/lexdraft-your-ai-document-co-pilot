import { useEffect, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useDocuments } from '@/stores/DocumentStore';

export function EditorPanel() {
  const { documentState, updateBlock, addBlock, deleteBlock } = useDocuments();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [documentState.document?.blocks]);

  if (!documentState.document) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        <p className="text-sm">Select a file to edit</p>
      </div>
    );
  }

  const handleBlockChange = (blockId: string, content: string) => {
    updateBlock(blockId, content);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, blockId: string) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addBlock(blockId, 'paragraph', '');
    } else if (e.key === 'Backspace' && (e.target as HTMLTextAreaElement).value === '' && documentState.document!.blocks.length > 1) {
      e.preventDefault();
      deleteBlock(blockId);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="px-4 py-2 border-b border-border bg-card">
        <h2 className="text-sm font-medium">Editor</h2>
        <p className="text-xs text-muted-foreground">Edit your document</p>
      </div>

      <ScrollArea className="flex-1" ref={scrollRef}>
        <div className="max-w-3xl mx-auto p-4 space-y-2">
          {documentState.document.blocks.map((block) => (
            <Textarea
              key={block.id}
              value={block.content}
              onChange={(e) => handleBlockChange(block.id, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, block.id)}
              className={`min-h-[32px] resize-none font-mono text-sm ${
                block.type === 'heading' ? 'font-bold text-lg' : ''
              }`}
              placeholder={block.type === 'heading' ? 'Heading...' : 'Type something...'}
              rows={1}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
