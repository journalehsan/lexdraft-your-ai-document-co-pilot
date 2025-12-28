export type BlockType = 'paragraph' | 'heading' | 'list' | 'code' | 'quote' | 'divider';

export interface Block {
  id: string;
  type: BlockType;
  content: string;
  hash: string;
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
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentSnapshot {
  id: string;
  documentId: string;
  blocks: Block[];
  version: number;
  timestamp: string;
}

export interface PendingPatch {
  ops: PatchOp[];
  createdAt: string;
}

export interface DocumentState {
  document: Document | null;
  snapshots: DocumentSnapshot[];
  pendingPatch: PendingPatch | null;
}
