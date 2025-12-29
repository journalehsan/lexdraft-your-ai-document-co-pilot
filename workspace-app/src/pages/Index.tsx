import { useState, useEffect, useMemo, useCallback } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { TopBar } from '@/components/layout/TopBar';
import { LeftSidebar } from '@/components/layout/LeftSidebar';
import { BottomBar } from '@/components/layout/BottomBar';
import { ChatPanel } from '@/components/chat/ChatPanel';
import { PreviewPanel } from '@/components/preview/PreviewPanel';
import { useProjects } from '@/stores/ProjectsStore';
import { useDocuments } from '@/stores/DocumentStore';

const Index = () => {
  const { selectedProjectId, selectedFileId } = useProjects();
  const {
    selectedFileId: docSelectedFileId,
    setSelectedFileId: setDocSelectedFileId,
    documentState,
    setMarkdown,
    getMarkdown
  } = useDocuments();
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (selectedFileId !== docSelectedFileId) {
      setDocSelectedFileId(selectedFileId);
    }
  }, [selectedFileId, docSelectedFileId, setDocSelectedFileId]);

  const documentContent = useMemo(() => {
    if (documentState.document) {
      return documentState.document.markdown;
    }
    return getMarkdown();
  }, [documentState.document, getMarkdown]);

  const handleContentChange = useCallback((content: string) => {
    setMarkdown(content);
  }, [setMarkdown]);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Top Bar */}
      <TopBar />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          {/* Left Sidebar */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={35}>
            <LeftSidebar />
          </ResizablePanel>

          <ResizableHandle withHandle className="bg-border hover:bg-primary/20 transition-colors" />

          {/* Main Split View */}
          <ResizablePanel defaultSize={80} minSize={50}>
            <div className="flex-1 flex flex-col overflow-hidden h-full">
              <ResizablePanelGroup direction="horizontal" className="flex-1">
                {/* Chat Panel */}
                <ResizablePanel defaultSize={45} minSize={30}>
                  <ChatPanel />
                </ResizablePanel>

                {/* Resizable Handle */}
                <ResizableHandle withHandle className="bg-border hover:bg-primary/20 transition-colors" />

                {/* Preview Panel */}
                <ResizablePanel defaultSize={55} minSize={30}>
                  <PreviewPanel
                    isGenerating={isGenerating}
                    selectedFileId={selectedFileId}
                    documentContent={documentContent}
                    onContentChange={handleContentChange}
                  />
                </ResizablePanel>
              </ResizablePanelGroup>

              {/* Bottom Bar */}
              <BottomBar />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default Index;
