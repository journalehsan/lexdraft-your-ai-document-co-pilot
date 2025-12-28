import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Block, Document, DocumentState, PendingPatch } from '@/types/document';
import { applyPatch, blocksToMarkdown, createDocument, markdownToBlocks } from '@/lib/patch';
import { addVersionSnapshot, normalizeMarkdown, parseMarkdownSections, restoreVersion as restoreVersionEntry, MAX_VERSION_HISTORY } from '@/lib/documentUtils';
import { sampleDocumentContent } from '@/data/mockData';

const STORAGE_KEY = 'lexdraft_documents';
const SCHEMA_VERSION = 2;

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
  restoreVersion: (versionId: string) => void;
}

const DocumentsContext = createContext<DocumentsContextType | undefined>(undefined);

interface StorageData {
  version: number;
  documents: Record<string, Document>;
}

const hydrateDocument = (doc: Document | null, fileId: string): Document => {
  const baseDoc = doc ?? createDocument(fileId, sampleDocumentContent);
  const markdownSource = baseDoc.markdown || (baseDoc.blocks?.length ? blocksToMarkdown(baseDoc.blocks) : sampleDocumentContent);
  const normalizedMarkdown = normalizeMarkdown(markdownSource);
  const sections = parseMarkdownSections(normalizedMarkdown);
  const blocks = baseDoc.blocks?.length ? baseDoc.blocks : markdownToBlocks(normalizedMarkdown);

  const hydrated: Document = {
    ...baseDoc,
    fileId: baseDoc.fileId || fileId,
    blocks,
    markdown: normalizedMarkdown,
    sections,
    versions: baseDoc.versions ? baseDoc.versions.slice(-MAX_VERSION_HISTORY) : [],
    version: baseDoc.version || 1,
    createdAt: baseDoc.createdAt || new Date().toISOString(),
    updatedAt: baseDoc.updatedAt || new Date().toISOString()
  };

  const versions = addVersionSnapshot(hydrated.versions, hydrated.markdown, hydrated.sections, MAX_VERSION_HISTORY, hydrated.version);
  return { ...hydrated, versions };
};

export function DocumentsProvider({ children }: { children: React.ReactNode }) {
  const [documents, setDocuments] = useState<Record<string, Document>>({});
  const [selectedFileId, setSelectedFileIdState] = useState<string | null>(null);
  const [documentState, setDocumentState] = useState<DocumentState>({
    document: null,
    versions: [],
    pendingPatch: null
  });

  const persistActiveDocument = useCallback(() => {
    if (!selectedFileId || !documentState.document) return;

    const updatedDoc = hydrateDocument(documentState.document, selectedFileId);
    const versions = addVersionSnapshot(updatedDoc.versions, updatedDoc.markdown, updatedDoc.sections, MAX_VERSION_HISTORY, updatedDoc.version);
    const docWithHistory = { ...updatedDoc, versions };

    setDocuments(prev => ({ ...prev, [selectedFileId]: docWithHistory }));
    setDocumentState(prev => ({
      ...prev,
      document: docWithHistory,
      versions: docWithHistory.versions
    }));
  }, [selectedFileId, documentState.document]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data: StorageData = JSON.parse(saved);
        if (data.version && data.version > SCHEMA_VERSION) {
          return;
        }
        const storedDocs = data.documents || {};
        const normalizedDocs: Record<string, Document> = {};

        Object.entries(storedDocs).forEach(([fileId, savedDoc]) => {
          normalizedDocs[fileId] = hydrateDocument(savedDoc, fileId);
        });

        setDocuments(normalizedDocs);
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
    if (!selectedFileId) {
      setDocumentState({
        document: null,
        versions: [],
        pendingPatch: null
      });
      return;
    }

    let doc = documents[selectedFileId];

    if (!doc) {
      doc = hydrateDocument(null, selectedFileId);
      setDocuments(prev => ({ ...prev, [selectedFileId]: doc }));
    } else if (!doc.markdown || !doc.sections || !doc.versions) {
      doc = hydrateDocument(doc, selectedFileId);
      setDocuments(prev => ({ ...prev, [selectedFileId]: doc }));
    }

    setDocumentState({
      document: doc,
      versions: doc.versions,
      pendingPatch: null
    });
  }, [selectedFileId, documents]);

  const setSelectedFileId = (id: string | null) => {
    persistActiveDocument();
    setSelectedFileIdState(id);
  };

  const updateDocumentFromMarkdown = (markdown: string): Document | null => {
    if (!documentState.document) return null;

    const normalized = normalizeMarkdown(markdown);
    if (normalized === documentState.document.markdown) {
      return documentState.document;
    }

    const sections = parseMarkdownSections(normalized);
    const blocks = markdownToBlocks(normalized);
    const updatedDoc: Document = {
      ...documentState.document,
      blocks,
      markdown: normalized,
      sections,
      version: documentState.document.version + 1,
      updatedAt: new Date().toISOString()
    };

    const versions = addVersionSnapshot(updatedDoc.versions, updatedDoc.markdown, updatedDoc.sections, MAX_VERSION_HISTORY, updatedDoc.version);
    return { ...updatedDoc, versions };
  };

  const updateDocumentFromBlocks = (blocks: Block[]): Document | null => {
    const markdown = blocksToMarkdown(blocks);
    return updateDocumentFromMarkdown(markdown);
  };

  const updateBlock = (blockId: string, content: string) => {
    if (!documentState.document || !selectedFileId) return;

    const updatedBlocks = documentState.document.blocks.map((block) =>
      block.id === blockId ? { ...block, content } : block
    );
    const updatedDoc = updateDocumentFromBlocks(updatedBlocks);
    if (!updatedDoc || updatedDoc === documentState.document) return;

    setDocuments(prev => ({ ...prev, [selectedFileId]: updatedDoc }));
    setDocumentState(prev => ({
      ...prev,
      document: updatedDoc,
      versions: updatedDoc.versions,
      pendingPatch: null
    }));
  };

  const addBlock = (afterBlockId: string | null, type: Block['type'], content: string) => {
    if (!documentState.document || !selectedFileId) return;

    const newBlock: Block = {
      id: crypto.randomUUID(),
      type,
      content,
      hash: content.length.toString()
    };

    const blocks = [...documentState.document.blocks];
    if (afterBlockId) {
      const index = blocks.findIndex(block => block.id === afterBlockId);
      blocks.splice(index + 1, 0, newBlock);
    } else {
      blocks.push(newBlock);
    }

    const updatedDoc = updateDocumentFromBlocks(blocks);
    if (!updatedDoc || updatedDoc === documentState.document) return;

    setDocuments(prev => ({ ...prev, [selectedFileId]: updatedDoc }));
    setDocumentState(prev => ({
      ...prev,
      document: updatedDoc,
      versions: updatedDoc.versions,
      pendingPatch: null
    }));
  };

  const deleteBlock = (blockId: string) => {
    if (!documentState.document || !selectedFileId) return;

    const blocks = documentState.document.blocks.filter(block => block.id !== blockId);
    const updatedDoc = updateDocumentFromBlocks(blocks);
    if (!updatedDoc || updatedDoc === documentState.document) return;

    setDocuments(prev => ({ ...prev, [selectedFileId]: updatedDoc }));
    setDocumentState(prev => ({
      ...prev,
      document: updatedDoc,
      versions: updatedDoc.versions,
      pendingPatch: null
    }));
  };

  const setPendingPatch = (patch: PendingPatch | null) => {
    setDocumentState(prev => ({ ...prev, pendingPatch: patch }));
  };

  const applyPendingPatch = () => {
    if (!documentState.document || !documentState.pendingPatch || !selectedFileId) return;

    const patched = applyPatch(documentState.document, documentState.pendingPatch.ops);
    const updatedDoc = updateDocumentFromBlocks(patched.blocks);
    if (!updatedDoc || updatedDoc === documentState.document) return;

    setDocuments(prev => ({ ...prev, [selectedFileId]: updatedDoc }));
    setDocumentState({
      document: updatedDoc,
      versions: updatedDoc.versions,
      pendingPatch: null
    });
  };

  const resetToSnapshot = (snapshotId: string) => {
    const version = documentState.versions.find(v => v.id === snapshotId);
    if (!version || !documentState.document || !selectedFileId) return;

    const restoredBlocks = markdownToBlocks(version.markdown);
    const restoredDoc: Document = {
      ...documentState.document,
      blocks: restoredBlocks,
      markdown: version.markdown,
      sections: version.sections,
      version: version.version,
      updatedAt: new Date().toISOString()
    };
    const versions = addVersionSnapshot(restoredDoc.versions, restoredDoc.markdown, restoredDoc.sections, MAX_VERSION_HISTORY, restoredDoc.version);
    const docWithHistory = { ...restoredDoc, versions };

    setDocuments(prev => ({ ...prev, [selectedFileId]: docWithHistory }));
    setDocumentState({
      document: docWithHistory,
      versions: docWithHistory.versions,
      pendingPatch: null
    });
  };

  const restoreVersion = (versionId: string) => {
    if (!documentState.document || !selectedFileId) return;
    const version = restoreVersionEntry(documentState.document.versions, versionId);
    if (!version) return;

    const restoredBlocks = markdownToBlocks(version.markdown);
    const restoredDoc: Document = {
      ...documentState.document,
      blocks: restoredBlocks,
      markdown: version.markdown,
      sections: version.sections,
      version: version.version,
      updatedAt: new Date().toISOString()
    };
    const versions = addVersionSnapshot(restoredDoc.versions, restoredDoc.markdown, restoredDoc.sections, MAX_VERSION_HISTORY, restoredDoc.version);
    const docWithHistory = { ...restoredDoc, versions };

    setDocuments(prev => ({ ...prev, [selectedFileId]: docWithHistory }));
    setDocumentState({
      document: docWithHistory,
      versions: docWithHistory.versions,
      pendingPatch: null
    });
  };

  const getMarkdown = (): string => {
    if (!documentState.document) return '';
    return documentState.document.markdown;
  };

  const setMarkdown = (markdown: string) => {
    if (!documentState.document || !selectedFileId) return;
    const updatedDoc = updateDocumentFromMarkdown(markdown);
    if (!updatedDoc || updatedDoc === documentState.document) return;

    setDocuments(prev => ({ ...prev, [selectedFileId]: updatedDoc }));
    setDocumentState(prev => ({
      ...prev,
      document: updatedDoc,
      versions: updatedDoc.versions,
      pendingPatch: null
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
      setMarkdown,
      restoreVersion
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
