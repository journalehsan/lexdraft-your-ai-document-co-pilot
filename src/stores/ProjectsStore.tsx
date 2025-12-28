import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthStore';
import { projects as initialProjectsData } from '@/data/mockData';

export interface File {
  id: string;
  name: string;
  type: 'md' | 'tex';
  status: 'Draft' | 'Reviewed' | 'Final';
  lastModified: string;
}

export interface Project {
  id: string;
  name: string;
  files: File[];
  isArchived?: boolean;
}

interface ProjectsContextType {
  projects: Project[];
  selectedProjectId: string | null;
  selectedFileId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  setSelectedFileId: (id: string | null) => void;
  addProject: (name: string) => void;
  renameProject: (id: string, name: string) => void;
  archiveProject: (id: string) => void;
  unarchiveProject: (id: string) => void;
  addFile: (projectId: string, name: string, type: 'md' | 'tex') => void;
  renameFile: (projectId: string, fileId: string, name: string) => void;
  deleteFile: (projectId: string, fileId: string) => void;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export function ProjectsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const userId = user?.id || 'guest';

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem(`lexdraft_projects_${userId}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse projects', e);
      }
    }
    // Transform mock data to our interface
    return initialProjectsData.map(p => ({
      id: p.id,
      name: p.name,
      files: p.files.map(f => ({
        id: f.id,
        name: f.name,
        type: (f.name.endsWith('.tex') ? 'tex' : 'md') as 'md' | 'tex',
        status: f.status as 'Draft' | 'Reviewed' | 'Final',
        lastModified: '2025-12-28'
      })),
      isArchived: false
    })) as Project[];
  });

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(projects[0]?.id || null);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(projects[0]?.files[0]?.id || null);

  useEffect(() => {
    localStorage.setItem(`lexdraft_projects_${userId}`, JSON.stringify(projects));
  }, [projects, userId]);

  const addProject = (name: string) => {
    const newProject: Project = {
      id: crypto.randomUUID(),
      name,
      files: [],
    };
    setProjects(prev => [...prev, newProject]);
    setSelectedProjectId(newProject.id);
  };

  const renameProject = (id: string, name: string) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, name } : p));
  };

  const archiveProject = (id: string) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, isArchived: true } : p));
  };

  const unarchiveProject = (id: string) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, isArchived: false } : p));
  };

  const addFile = (projectId: string, name: string, type: 'md' | 'tex') => {
    const newFile: File = {
      id: crypto.randomUUID(),
      name: name.endsWith(`.${type}`) ? name : `${name}.${type}`,
      type,
      status: 'Draft',
      lastModified: new Date().toISOString().split('T')[0],
    };
    setProjects(prev => prev.map(p => 
      p.id === projectId ? { ...p, files: [...p.files, newFile] } : p
    ));
    setSelectedFileId(newFile.id);
  };

  const renameFile = (projectId: string, fileId: string, name: string) => {
    setProjects(prev => prev.map(p => 
      p.id === projectId 
        ? { ...p, files: p.files.map(f => f.id === fileId ? { ...f, name } : f) } 
        : p
    ));
  };

  const deleteFile = (projectId: string, fileId: string) => {
    setProjects(prev => prev.map(p => 
      p.id === projectId 
        ? { ...p, files: p.files.filter(f => f.id !== fileId) } 
        : p
    ));
    if (selectedFileId === fileId) setSelectedFileId(null);
  };

  return (
    <ProjectsContext.Provider value={{ 
      projects, selectedProjectId, selectedFileId,
      setSelectedProjectId, setSelectedFileId,
      addProject, renameProject, archiveProject, unarchiveProject,
      addFile, renameFile, deleteFile 
    }}>
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectsContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectsProvider');
  }
  return context;
}
