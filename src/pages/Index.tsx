import { useState } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { TopBar } from '@/components/layout/TopBar';
import { LeftSidebar } from '@/components/layout/LeftSidebar';
import { BottomBar } from '@/components/layout/BottomBar';
import { ChatPanel } from '@/components/chat/ChatPanel';
import { PreviewPanel } from '@/components/preview/PreviewPanel';
import { projects, Project, ProjectFile } from '@/data/mockData';

const Index = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(projects[0]);
  const [selectedFile, setSelectedFile] = useState<ProjectFile | null>(projects[0].files[0]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
    setSelectedFile(project.files[0]);
  };

  const handleSelectFile = (file: ProjectFile) => {
    setSelectedFile(file);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Top Bar */}
      <TopBar />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          {/* Left Sidebar */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={35}>
            <LeftSidebar
              selectedProject={selectedProject}
              selectedFile={selectedFile}
              onSelectProject={handleSelectProject}
              onSelectFile={handleSelectFile}
            />
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
                  <PreviewPanel isGenerating={isGenerating} />
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
