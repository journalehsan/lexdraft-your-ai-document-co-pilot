import { createContext, useContext, useEffect, useState } from 'react';
import { Document, DocumentState, PendingPatch, PatchOp, Block } from '@/types/document';
import { createDocument, applyPatch, createSnapshot, blocksToMarkdown, markdownToBlocks } from '@/lib/patch';
import { sampleDocumentContent } from '@/data/mockData';

const STORAGE_KEY = 'lexdraft_documents';
const SCHEMA_VERSION = 1;

interface DocumentsContextType {
  documents: Record<string, Document>;
  selectedFileId: string | null;
  documentState: DocumentState;
  setSelectedFileId: (id: string | null) => void;
  updateBlock: (blockId: string, content: string) => void;
  addBlock: (afterBlockId: string | null, type: Block['type'], content: string) => void;
  deleteBlock: (blockId: string) => void;
  setPendingPatch: (patch: PendingPatch | null) => void;
  applyPendingPatch: () => void;
  resetToSnapshot: (snapshotId: string) => void;
  getMarkdown: () => string;
  setMarkdown: (markdown: string) => void;
}

const DocumentsContext = createContext<DocumentsContextType | undefined>(undefined);

interface StorageData {
  version: number;
  documents: Record<string, Document>;
}

export function DocumentsProvider({ children }: { children: React.ReactNode }) {
  const [documents, setDocuments] = useState<Record<string, Document>>({});
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [documentState, setDocumentState] = useState<DocumentState>({
    document: null,
    snapshots: [],
    pendingPatch: null
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data: StorageData = JSON.parse(saved);
        if (data.version === SCHEMA_VERSION) {
          setDocuments(data.documents);
        }
      } catch (e) {
        console.error('Failed to parse documents', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      version: SCHEMA_VERSION,
      documents
    }));
  }, [documents]);

  useEffect(() => {
    if (selectedFileId) {
      let doc = documents[selectedFileId];

      if (!doc) {
        doc = createDocument(selectedFileId, sampleDocumentContent);
        setDocuments(prev => ({ ...prev, [selectedFileId]: doc }));
      }

      setDocumentState(prev => ({
        ...prev,
        document: doc,
        snapshots: prev.snapshots
      }));
    } else {
      setDocumentState({
        document: null,
        snapshots: [],
        pendingPatch: null
      });
    }
  }, [selectedFileId, documents]);

  const updateBlock = (blockId: string, content: string) => {
    if (!documentState.document) return;

    const newBlock = { ...documentState.document.blocks.find(b => b.id === blockId)!, content };
    const patch: PatchOp = { op: 'replace_block', blockId, block: newBlock };

    const updatedDoc = applyPatch(documentState.document, [patch]);
    const snapshot = createSnapshot(updatedDoc);

    setDocuments(prev => ({ ...prev, [selectedFileId!]: updatedDoc }));
    setDocumentState(prev => ({
      document: updatedDoc,
      snapshots: [...prev.snapshots, snapshot],
      pendingPatch: null
    }));
  };

  const addBlock = (afterBlockId: string | null, type: Block['type'], content: string) => {
    if (!documentState.document) return;

    const newBlock = {
      id: crypto.randomUUID(),
      type,
      content,
      hash: content.length.toString()
    };

    let patch: PatchOp;

    if (afterBlockId) {
      patch = { op: 'insert_after', blockId: afterBlockId, block: newBlock };
    } else {
      patch = { op: 'insert_after', blockId: documentState.document.blocks[documentState.document.blocks.length - 1]?.id || '', block: newBlock };
    }

    const updatedDoc = applyPatch(documentState.document, [patch]);
    const snapshot = createSnapshot(updatedDoc);

    setDocuments(prev => ({ ...prev, [selectedFileId!]: updatedDoc }));
    setDocumentState(prev => ({
      document: updatedDoc,
      snapshots: [...prev.snapshots, snapshot],
      pendingPatch: null
    }));
  };

  const deleteBlock = (blockId: string) => {
    if (!documentState.document) return;

    const patch: PatchOp = { op: 'delete_block', blockId };

    const updatedDoc = applyPatch(documentState.document, [patch]);
    const snapshot = createSnapshot(updatedDoc);

    setDocuments(prev => ({ ...prev, [selectedFileId!]: updatedDoc }));
    setDocumentState(prev => ({
      document: updatedDoc,
      snapshots: [...prev.snapshots, snapshot],
      pendingPatch: null
    }));
  };

  const setPendingPatch = (patch: PendingPatch | null) => {
    setDocumentState(prev => ({ ...prev, pendingPatch: patch }));
  };

  const applyPendingPatch = () => {
    if (!documentState.document || !documentState.pendingPatch) return;

    const updatedDoc = applyPatch(documentState.document, documentState.pendingPatch.ops);
    const snapshot = createSnapshot(updatedDoc);

    setDocuments(prev => ({ ...prev, [selectedFileId!]: updatedDoc }));
    setDocumentState(prev => ({
      document: updatedDoc,
      snapshots: [...prev.snapshots, snapshot],
      pendingPatch: null
    }));
  };

  const resetToSnapshot = (snapshotId: string) => {
    const snapshot = documentState.snapshots.find(s => s.id === snapshotId);
    if (!snapshot || !documentState.document) return;

    const restoredDoc = {
      ...documentState.document,
      blocks: snapshot.blocks.map(b => ({ ...b })),
      version: snapshot.version,
      updatedAt: new Date().toISOString()
    };

    setDocuments(prev => ({ ...prev, [selectedFileId!]: restoredDoc }));
    setDocumentState(prev => ({
      document: restoredDoc,
      snapshots: prev.snapshots,
      pendingPatch: null
    }));
  };

  const getMarkdown = (): string => {
    if (!documentState.document) return '';
    return blocksToMarkdown(documentState.document.blocks);
  };

  const setMarkdown = (markdown: string) => {
    if (!documentState.document) return;

    const newBlocks = markdownToBlocks(markdown);
    const updatedDoc = {
      ...documentState.document,
      blocks: newBlocks,
      version: documentState.document.version + 1,
      updatedAt: new Date().toISOString()
    };

    setDocuments(prev => ({ ...prev, [selectedFileId!]: updatedDoc }));
    setDocumentState(prev => ({
      ...prev,
      document: updatedDoc
    }));
  };

  return (
    <DocumentsContext.Provider value={{
      documents,
      selectedFileId,
      documentState,
      setSelectedFileId,
      updateBlock,
      addBlock,
      deleteBlock,
      setPendingPatch,
      applyPendingPatch,
      resetToSnapshot,
      getMarkdown,
      setMarkdown
    }}>
      {children}
    </DocumentsContext.Provider>
  );
}

export function useDocuments() {
  const context = useContext(DocumentsContext);
  if (context === undefined) {
    throw new Error('useDocuments must be used within a DocumentsProvider');
  }
  return context;
}
