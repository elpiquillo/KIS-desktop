import { create } from 'zustand';

interface SidebarState {
  sidebarOpen?: Boolean;
  setSidebarOpen: (value: Boolean) => void;
}

export const useSidebarState = create<SidebarState>()((set) => ({
  sidebarOpen: undefined, // default state
  setSidebarOpen: (value) => {
    set(() => ({ sidebarOpen: value }));
  },
}));
