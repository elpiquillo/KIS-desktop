import DashboardAccessInterface from 'src/types/dashboard-access-interface';
import { create } from 'zustand';

interface DashboardAccessState {
  applications: DashboardAccessInterface[];
  setApplications: (value: DashboardAccessInterface[]) => void;
  updateDashboardAccess: (value: DashboardAccessInterface) => void;
}

export const useDashboardAccessState = create<DashboardAccessState>()((set) => ({
  applications: [],
  setApplications: (value) => set(() => ({ applications: value })),
  updateDashboardAccess: (value) =>
    set((state) => ({
      applications: state.applications.map((app) => (app.id.id === value?.id.id ? value : app)),
    })),
}));
