import { ApplicationCard } from '@/types/application';
import { create } from 'zustand';

type ApplicationStore = {
  applications: ApplicationCard[];
  setApplications: (applications: ApplicationCard[]) => void;
  updateApplication: (updated: ApplicationCard) => void;
  removeApplication: (id: string) => void;
  moveApplication: (id: string, status: ApplicationCard['status']) => void;
};

export const useApplicationStore = create<ApplicationStore>((set) => ({
  applications: [],

  setApplications: (applications) => set({ applications }),

  updateApplication: (updated) =>
    set((state) => ({
      applications: state.applications.map((app) => (app.id === updated.id ? updated : app)),
    })),

  removeApplication: (id) =>
    set((state) => ({
      applications: state.applications.filter((app) => app.id !== id),
    })),

  moveApplication: (id, status) =>
    set((state) => ({
      applications: state.applications.map((app) => (app.id === id ? { ...app, status } : app)),
    })),
}));
