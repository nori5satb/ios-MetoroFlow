import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Project, Section, Track } from '../types';

interface ProjectState {
  // Current project
  currentProject: Project | null;
  
  // All projects
  projects: Project[];
  
  // UI state
  selectedProjectId: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions - Project Management
  createProject: (name: string, description?: string) => Project;
  loadProject: (id: string) => void;
  saveProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  duplicateProject: (id: string) => void;
  renameProject: (id: string, newName: string) => void;
  
  // Actions - Current Project Editing
  updateCurrentProject: (updates: Partial<Project>) => void;
  addSection: (section: Section) => void;
  updateSection: (sectionId: string, updates: Partial<Section>) => void;
  deleteSection: (sectionId: string) => void;
  addTrack: (track: Track) => void;
  updateTrack: (trackId: string, updates: Partial<Track>) => void;
  deleteTrack: (trackId: string) => void;
  
  // Actions - UI
  setSelectedProjectId: (id: string | null) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

const createNewProject = (name: string, description?: string): Project => {
  const now = new Date();
  return {
    id: `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name,
    description,
    bpm: 120,
    timeSignature: { numerator: 4, denominator: 4 },
    sections: [],
    tracks: [],
    createdAt: now,
    updatedAt: now,
  };
};

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      currentProject: null,
      projects: [],
      selectedProjectId: null,
      isLoading: false,
      error: null,
      
      createProject: (name, description) => {
        const newProject = createNewProject(name, description);
        set((state) => ({
          projects: [...state.projects, newProject],
          currentProject: newProject,
          selectedProjectId: newProject.id,
        }));
        return newProject;
      },
      
      loadProject: (id) => {
        const project = get().projects.find((p) => p.id === id);
        if (project) {
          set({
            currentProject: project,
            selectedProjectId: id,
          });
        } else {
          set({ error: `Project with id ${id} not found` });
        }
      },
      
      saveProject: (project) => {
        const updatedProject = {
          ...project,
          updatedAt: new Date(),
        };
        
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === project.id ? updatedProject : p
          ),
          currentProject:
            state.currentProject?.id === project.id
              ? updatedProject
              : state.currentProject,
        }));
      },
      
      deleteProject: (id) => {
        set((state) => {
          const newProjects = state.projects.filter((p) => p.id !== id);
          const isCurrentProject = state.currentProject?.id === id;
          
          return {
            projects: newProjects,
            currentProject: isCurrentProject ? null : state.currentProject,
            selectedProjectId: isCurrentProject ? null : state.selectedProjectId,
          };
        });
      },
      
      duplicateProject: (id) => {
        const project = get().projects.find((p) => p.id === id);
        if (project) {
          const duplicatedProject = {
            ...project,
            id: `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: `${project.name} (Copy)`,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          
          set((state) => ({
            projects: [...state.projects, duplicatedProject],
          }));
        }
      },
      
      renameProject: (id, newName) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id
              ? { ...p, name: newName, updatedAt: new Date() }
              : p
          ),
          currentProject:
            state.currentProject?.id === id
              ? { ...state.currentProject, name: newName, updatedAt: new Date() }
              : state.currentProject,
        }));
      },
      
      updateCurrentProject: (updates) => {
        const { currentProject } = get();
        if (!currentProject) return;
        
        const updatedProject = {
          ...currentProject,
          ...updates,
          updatedAt: new Date(),
        };
        
        set((state) => ({
          currentProject: updatedProject,
          projects: state.projects.map((p) =>
            p.id === currentProject.id ? updatedProject : p
          ),
        }));
      },
      
      addSection: (section) => {
        const { currentProject } = get();
        if (!currentProject) return;
        
        const updatedProject = {
          ...currentProject,
          sections: [...currentProject.sections, section],
          updatedAt: new Date(),
        };
        
        get().saveProject(updatedProject);
      },
      
      updateSection: (sectionId, updates) => {
        const { currentProject } = get();
        if (!currentProject) return;
        
        const updatedProject = {
          ...currentProject,
          sections: currentProject.sections.map((s) =>
            s.id === sectionId ? { ...s, ...updates } : s
          ),
          updatedAt: new Date(),
        };
        
        get().saveProject(updatedProject);
      },
      
      deleteSection: (sectionId) => {
        const { currentProject } = get();
        if (!currentProject) return;
        
        const updatedProject = {
          ...currentProject,
          sections: currentProject.sections.filter((s) => s.id !== sectionId),
          updatedAt: new Date(),
        };
        
        get().saveProject(updatedProject);
      },
      
      addTrack: (track) => {
        const { currentProject } = get();
        if (!currentProject) return;
        
        const updatedProject = {
          ...currentProject,
          tracks: [...currentProject.tracks, track],
          updatedAt: new Date(),
        };
        
        get().saveProject(updatedProject);
      },
      
      updateTrack: (trackId, updates) => {
        const { currentProject } = get();
        if (!currentProject) return;
        
        const updatedProject = {
          ...currentProject,
          tracks: currentProject.tracks.map((t) =>
            t.id === trackId ? { ...t, ...updates } : t
          ),
          updatedAt: new Date(),
        };
        
        get().saveProject(updatedProject);
      },
      
      deleteTrack: (trackId) => {
        const { currentProject } = get();
        if (!currentProject) return;
        
        const updatedProject = {
          ...currentProject,
          tracks: currentProject.tracks.filter((t) => t.id !== trackId),
          updatedAt: new Date(),
        };
        
        get().saveProject(updatedProject);
      },
      
      setSelectedProjectId: (id) => set({ selectedProjectId: id }),
      
      setError: (error) => set({ error }),
      
      clearError: () => set({ error: null }),
    }),
    {
      name: 'project-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        projects: state.projects,
        selectedProjectId: state.selectedProjectId,
      }),
    }
  )
);