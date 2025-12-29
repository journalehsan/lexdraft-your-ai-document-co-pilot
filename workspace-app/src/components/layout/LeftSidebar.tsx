import { Plus, Search, FileText, FolderOpen, ChevronRight, MoreVertical, Edit2, Archive, ArchiveRestore, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useProjects, Project, File as ProjectFile } from '@/stores/ProjectsStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

export function LeftSidebar() {
  const { 
    projects, selectedProjectId, selectedFileId,
    setSelectedProjectId, setSelectedFileId,
    addProject, renameProject, archiveProject, unarchiveProject,
    addFile, renameFile, deleteFile 
  } = useProjects();

  const [searchQuery, setSearchQuery] = useState('');
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isRenameProjectModalOpen, setIsRenameProjectModalOpen] = useState(false);
  const [isNewFileModalOpen, setIsNewFileModalOpen] = useState(false);
  const [isRenameFileModalOpen, setIsRenameFileModalOpen] = useState(false);
  const [isDeleteFileModalOpen, setIsDeleteFileModalOpen] = useState(false);

  const [projectName, setProjectName] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState<'md' | 'tex'>('md');
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);

  const activeProjects = projects.filter(p => !p.isArchived && p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const archivedProjects = projects.filter(p => p.isArchived && p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const getStatusBadge = (status: ProjectFile['status']) => {
    const variants: Record<string, { className: string }> = {
      Draft: { className: 'bg-amber-500/10 text-amber-600 border-amber-500/20' },
      Reviewed: { className: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
      Final: { className: 'bg-green-500/10 text-green-600 border-green-500/20' },
    };
    return (
      <Badge variant="outline" className={cn('text-[10px] px-1.5 py-0 h-4 font-medium', variants[status].className)}>
        {status}
      </Badge>
    );
  };

  const handleAddProject = () => {
    if (projectName.trim()) {
      addProject(projectName);
      setProjectName('');
      setIsNewProjectModalOpen(false);
    }
  };

  const handleRenameProject = () => {
    if (activeProjectId && projectName.trim()) {
      renameProject(activeProjectId, projectName);
      setProjectName('');
      setIsRenameProjectModalOpen(false);
    }
  };

  const handleAddFile = () => {
    if (activeProjectId && fileName.trim()) {
      addFile(activeProjectId, fileName, fileType);
      setFileName('');
      setIsNewFileModalOpen(false);
    }
  };

  const handleRenameFile = () => {
    if (activeProjectId && activeFileId && fileName.trim()) {
      renameFile(activeProjectId, activeFileId, fileName);
      setFileName('');
      setIsRenameFileModalOpen(false);
    }
  };

  const handleDeleteFile = () => {
    if (activeProjectId && activeFileId) {
      deleteFile(activeProjectId, activeFileId);
      setIsDeleteFileModalOpen(false);
    }
  };

  const ProjectItem = ({ project }: { project: Project }) => (
    <div className="mb-1">
      <div className={cn(
        'w-full p-2 rounded-md transition-colors flex items-center gap-2 group',
        selectedProjectId === project.id ? 'bg-accent text-accent-foreground' : 'hover:bg-muted/50'
      )}>
        <button 
          onClick={() => setSelectedProjectId(selectedProjectId === project.id ? null : project.id)}
          className="flex flex-1 items-center gap-2 min-w-0"
        >
          <FolderOpen className="h-4 w-4 shrink-0 text-primary" />
          <p className="text-sm font-medium truncate flex-1 text-left">{project.name}</p>
          <ChevronRight className={cn('h-3.5 w-3.5 shrink-0 transition-transform text-muted-foreground', selectedProjectId === project.id && 'rotate-90')} />
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100"><MoreVertical className="h-3 w-3" /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => { setActiveProjectId(project.id); setProjectName(project.name); setIsRenameProjectModalOpen(true); }}><Edit2 className="h-3 w-3 mr-2" /> Rename</DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setActiveProjectId(project.id); setIsNewFileModalOpen(true); }}><Plus className="h-3 w-3 mr-2" /> New File</DropdownMenuItem>
            <DropdownMenuItem onClick={() => project.isArchived ? unarchiveProject(project.id) : archiveProject(project.id)}>
              {project.isArchived ? <ArchiveRestore className="h-3 w-3 mr-2" /> : <Archive className="h-3 w-3 mr-2" />}
              {project.isArchived ? 'Restore' : 'Archive'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {selectedProjectId === project.id && (
        <div className="ml-4 mt-1 border-l border-border pl-2 space-y-0.5">
          {project.files.map((file) => (
            <div key={file.id} className={cn(
              'group w-full flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors text-sm',
              selectedFileId === file.id ? 'bg-primary/10 text-primary' : 'hover:bg-muted/50 text-foreground/80'
            )}>
              <button onClick={() => setSelectedFileId(file.id)} className="flex-1 flex items-center gap-2 min-w-0">
                <FileText className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate font-mono text-xs flex-1 text-left">{file.name}</span>
                {getStatusBadge(file.status)}
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-5 w-5 opacity-0 group-hover:opacity-100 p-0"><MoreVertical className="h-3 w-3" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => { setActiveProjectId(project.id); setActiveFileId(file.id); setFileName(file.name); setIsRenameFileModalOpen(true); }}><Edit2 className="h-3 w-3 mr-2" /> Rename</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { setActiveProjectId(project.id); setActiveFileId(file.id); setIsDeleteFileModalOpen(true); }} className="text-destructive"><Trash2 className="h-3 w-3 mr-2" /> Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <aside className="w-full border-r border-border bg-card flex flex-col h-full">
      <div className="p-3 border-b border-border">
        <Button className="w-full gap-2" size="sm" onClick={() => setIsNewProjectModalOpen(true)}>
          <Plus className="h-4 w-4" /> New Project
        </Button>
      </div>

      <div className="p-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input placeholder="Search projects..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-8 h-8 text-sm bg-background" />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {activeProjects.map(project => <ProjectItem key={project.id} project={project} />)}
          {archivedProjects.length > 0 && (
            <div className="mt-4">
              <p className="text-[10px] font-bold text-muted-foreground uppercase px-2 mb-2 tracking-wider">Archived</p>
              {archivedProjects.map(project => <ProjectItem key={project.id} project={project} />)}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Modals */}
      <Dialog open={isNewProjectModalOpen} onOpenChange={setIsNewProjectModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>New Project</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><Label>Project Name</Label><Input value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="e.g. Sales Agreement" /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setIsNewProjectModalOpen(false)}>Cancel</Button><Button onClick={handleAddProject}>Create Project</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isRenameProjectModalOpen} onOpenChange={setIsRenameProjectModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Rename Project</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><Label>New Name</Label><Input value={projectName} onChange={(e) => setProjectName(e.target.value)} /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setIsRenameProjectModalOpen(false)}>Cancel</Button><Button onClick={handleRenameProject}>Rename</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isNewFileModalOpen} onOpenChange={setIsNewFileModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>New File</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><Label>File Name</Label><Input value={fileName} onChange={(e) => setFileName(e.target.value)} placeholder="e.g. section-1" /></div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={fileType} onValueChange={(v) => setFileType(v as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="md">Markdown (.md)</SelectItem><SelectItem value="tex">LaTeX (.tex)</SelectItem></SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setIsNewFileModalOpen(false)}>Cancel</Button><Button onClick={handleAddFile}>Create File</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isRenameFileModalOpen} onOpenChange={setIsRenameFileModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Rename File</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><Label>New Name</Label><Input value={fileName} onChange={(e) => setFileName(e.target.value)} /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setIsRenameFileModalOpen(false)}>Cancel</Button><Button onClick={handleRenameFile}>Rename</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteFileModalOpen} onOpenChange={setIsDeleteFileModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete File</DialogTitle></DialogHeader>
          <p className="py-4 text-sm text-muted-foreground">Are you sure you want to delete this file? This action cannot be undone.</p>
          <DialogFooter><Button variant="outline" onClick={() => setIsDeleteFileModalOpen(false)}>Cancel</Button><Button variant="destructive" onClick={handleDeleteFile}>Delete</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </aside>
  );
}
