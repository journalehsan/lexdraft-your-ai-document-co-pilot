import { Plus, Search, FileText, FolderOpen, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { projects, Project, ProjectFile } from '@/data/mockData';
import { useState } from 'react';

interface LeftSidebarProps {
  selectedProject: Project | null;
  selectedFile: ProjectFile | null;
  onSelectProject: (project: Project) => void;
  onSelectFile: (file: ProjectFile) => void;
}

export function LeftSidebar({
  selectedProject,
  selectedFile,
  onSelectProject,
  onSelectFile,
}: LeftSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFileIcon = (type: ProjectFile['type']) => {
    return <FileText className="h-3.5 w-3.5" />;
  };

  return (
    <aside className="w-72 border-r border-border bg-card flex flex-col h-full">
      {/* New Project Button */}
      <div className="p-3 border-b border-border">
        <Button className="w-full gap-2" size="sm">
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 text-sm bg-background"
          />
        </div>
      </div>

      {/* Project List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredProjects.map((project) => (
            <div key={project.id} className="mb-1">
              <button
                onClick={() => onSelectProject(project)}
                className={cn(
                  'w-full text-left p-2 rounded-md transition-colors flex items-center gap-2 group',
                  selectedProject?.id === project.id
                    ? 'bg-accent text-accent-foreground'
                    : 'hover:bg-muted/50'
                )}
              >
                <FolderOpen className="h-4 w-4 shrink-0 text-primary" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{project.name}</p>
                  <p className="text-xs text-muted-foreground">{project.lastUpdated}</p>
                </div>
                <ChevronRight
                  className={cn(
                    'h-3.5 w-3.5 shrink-0 transition-transform text-muted-foreground',
                    selectedProject?.id === project.id && 'rotate-90'
                  )}
                />
              </button>

              {/* Files list (shown when project is selected) */}
              {selectedProject?.id === project.id && (
                <div className="ml-4 mt-1 border-l border-border pl-2 space-y-0.5">
                  {project.files.map((file) => (
                    <button
                      key={file.id}
                      onClick={() => onSelectFile(file)}
                      className={cn(
                        'w-full text-left px-2 py-1.5 rounded-md transition-colors flex items-center gap-2 text-sm',
                        selectedFile?.id === file.id
                          ? 'bg-primary/10 text-primary'
                          : 'hover:bg-muted/50 text-foreground/80'
                      )}
                    >
                      {getFileIcon(file.type)}
                      <span className="truncate font-mono text-xs">{file.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </aside>
  );
}
