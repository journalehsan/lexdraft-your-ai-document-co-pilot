export type BlockType = 'paragraph' | 'heading' | 'list' | 'code' | 'quote' | 'divider';

export interface Block {
  id: string;
  type: BlockType;
  content: string;
  hash: string;
}

export interface MarkdownSection {
  id: string;
  type: 'heading' | 'paragraph';
  level?: 1 | 2 | 3;
  title?: string;
  content: string;
  startLine: number;
  endLine: number;
}

export interface DocumentVersion {
  id: string;
  markdown: string;
  sections: MarkdownSection[];
  version: number;
  timestamp: string;
}

export interface MarkdownDiff {
  added: MarkdownSection[];
  removed: MarkdownSection[];
  modified: {
    from: MarkdownSection;
    to: MarkdownSection;
  }[];
}

export type PatchOpType = 'replace_block' | 'insert_after' | 'delete_block';

export interface PatchOp {
  op: PatchOpType;
  blockId: string;
  block?: Block;
  position?: number;
}

export interface Document {
  id: string;
  fileId: string;
  blocks: Block[];
  markdown: string;
  sections: MarkdownSection[];
  versions: DocumentVersion[];
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentSnapshot {
  id: string;
  documentId: string;
  blocks: Block[];
  markdown: string;
  sections: MarkdownSection[];
  version: number;
  timestamp: string;
}

export interface PendingPatch {
  ops: PatchOp[];
  createdAt: string;
}

export interface DocumentState {
  document: Document | null;
  versions: DocumentVersion[];
  pendingPatch: PendingPatch | null;
}
