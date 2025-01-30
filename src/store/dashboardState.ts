import DashboardAccessInterface from 'src/types/dashboard-access-interface';
import { DashboardContent } from 'src/types/dashboard-interface';
import { MenuData } from 'src/types/dashboard-menu-interface';
import { create } from 'zustand';

interface DashboardState {
  dashboard?: DashboardContent;
  dashboardsAll?: DashboardAccessInterface[];
  dashboardMenu?: MenuData;
  setDashboardsAll: (value: DashboardAccessInterface[] | undefined) => void;
  setDashboard: (value: DashboardContent | undefined) => void;
  setDashboardMenu: (value: MenuData | undefined) => void;
}

export const useDashboardState = create<DashboardState>()((set) => ({
  dashboardsAll: undefined,
  dashboard: undefined,
  dashboardMenu: undefined,
  setDashboardsAll: (value) => set(() => ({ dashboardsAll: value })),
  setDashboard: (value) => set(() => ({ dashboard: value })),
  setDashboardMenu: (value) => set(() => ({ dashboardMenu: value })),
}));
