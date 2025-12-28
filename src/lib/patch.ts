import { Block, Document, PatchOp, DocumentSnapshot } from '@/types/document';

export function generateHash(content: string): string {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

export function createBlock(type: Block['type'], content: string): Block {
  return {
    id: crypto.randomUUID(),
    type,
    content,
    hash: generateHash(content)
  };
}

export function markdownToBlocks(markdown: string): Block[] {
  const lines = markdown.split('\n');
  const blocks: Block[] = [];

  for (const line of lines) {
    if (line.trim() === '') {
      blocks.push(createBlock('paragraph', ''));
    } else if (line.startsWith('# ')) {
      blocks.push(createBlock('heading', line.slice(2)));
    } else if (line.startsWith('## ')) {
      blocks.push(createBlock('heading', line.slice(3)));
    } else if (line.startsWith('### ')) {
      blocks.push(createBlock('heading', line.slice(4)));
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      blocks.push(createBlock('list', line.slice(2)));
    } else if (line.startsWith('```')) {
      blocks.push(createBlock('code', line.slice(3)));
    } else if (line.startsWith('> ')) {
      blocks.push(createBlock('quote', line.slice(2)));
    } else if (line === '---') {
      blocks.push(createBlock('divider', '---'));
    } else {
      blocks.push(createBlock('paragraph', line));
    }
  }

  return blocks;
}

export function blocksToMarkdown(blocks: Block[]): string {
  return blocks
    .map(block => {
      switch (block.type) {
        case 'heading':
          return `# ${block.content}`;
        case 'list':
          return `- ${block.content}`;
        case 'code':
          return `\`\`\`${block.content}`;
        case 'quote':
          return `> ${block.content}`;
        case 'divider':
          return '---';
        default:
          return block.content;
      }
    })
    .join('\n');
}

export function applyPatch(document: Document, ops: PatchOp[]): Document {
  const newBlocks = [...document.blocks];

  for (const op of ops) {
    switch (op.op) {
      case 'replace_block': {
        const replaceIndex = newBlocks.findIndex(b => b.id === op.blockId);
        if (replaceIndex !== -1 && op.block) {
          newBlocks[replaceIndex] = op.block;
        }
        break;
      }

      case 'insert_after': {
        const insertIndex = newBlocks.findIndex(b => b.id === op.blockId);
        if (insertIndex !== -1 && op.block) {
          newBlocks.splice(insertIndex + 1, 0, op.block);
        }
        break;
      }

      case 'delete_block': {
        const deleteIndex = newBlocks.findIndex(b => b.id === op.blockId);
        if (deleteIndex !== -1) {
          newBlocks.splice(deleteIndex, 1);
        }
        break;
      }
    }
  }

  return {
    ...document,
    blocks: newBlocks,
    version: document.version + 1,
    updatedAt: new Date().toISOString()
  };
}

export function createSnapshot(document: Document): DocumentSnapshot {
  return {
    id: crypto.randomUUID(),
    documentId: document.id,
    blocks: document.blocks.map(b => ({ ...b })),
    version: document.version,
    timestamp: new Date().toISOString()
  };
}

export function createDocument(fileId: string, initialContent?: string): Document {
  const blocks = initialContent ? markdownToBlocks(initialContent) : [createBlock('paragraph', '')];

  return {
    id: crypto.randomUUID(),
    fileId,
    blocks,
    version: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}
