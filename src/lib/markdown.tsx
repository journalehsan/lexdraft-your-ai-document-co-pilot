import { Block } from '@/types/document';

export function renderBlock(block: Block): React.ReactNode {
  switch (block.type) {
    case 'heading':
      return (
        <h1 className="text-2xl font-serif font-bold mt-6 mb-4 text-foreground">
          {block.content}
        </h1>
      );

    case 'list':
      return (
        <li className="ml-4 my-2 text-sm leading-relaxed text-foreground/90 list-disc">
          {block.content}
        </li>
      );

    case 'code':
      return (
        <pre className="my-2 p-4 bg-muted rounded-lg text-sm font-mono overflow-x-auto">
          <code>{block.content}</code>
        </pre>
      );

    case 'quote':
      return (
        <blockquote className="my-2 pl-4 border-l-4 border-primary italic text-sm text-foreground/80">
          {block.content}
        </blockquote>
      );

    case 'divider':
      return <hr className="my-4 border-border" />;

    case 'paragraph':
    default: {
      const parts = block.content.split(/(\*\*[^*]+\*\*)/g);
      return (
        <p className="my-2 text-sm leading-relaxed text-foreground/90">
          {parts.map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={j} className="font-semibold text-foreground">
                  {part.slice(2, -2)}
                </strong>
              );
            }
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
  }
}

export function renderBlocks(blocks: Block[]): React.ReactNode[] {
  return blocks.map((block) => (
    <div key={block.id}>
      {renderBlock(block)}
    </div>
  ));
}

export function blocksToText(blocks: Block[]): string {
  return blocks
    .map(block => block.content)
    .join('\n');
}
