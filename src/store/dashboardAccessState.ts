import { create } from 'zustand';
import DashboardAccessInterface from 'src/types/dashboard-access-interface';
import { sortApplicationsByFavorite } from 'src/utils/sortApplications';

interface DashboardAccessState {
  applications: DashboardAccessInterface[];
  setApplications: (value: DashboardAccessInterface[]) => void;
  updateDashboardAccess: (value: DashboardAccessInterface) => void;
}

export const useDashboardAccessState = create<DashboardAccessState>()((set) => ({
  applications: [],
  setApplications: (value) => set(() => ({ applications: sortApplicationsByFavorite(value) })),
  updateDashboardAccess: (value: any) => {
    set((state) => ({
      applications: state.applications.map((application) => {
        if (application.id.id === value.id) {
          return {
            ...application,
            id: {
              id: value.id,
              display: value.display,
              favorite: value.favorite,
            },
            favorite: value.favorite,
          };
        }
        return application;
      }),
    }));
  },
}));
