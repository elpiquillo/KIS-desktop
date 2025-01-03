import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface SidebarState {
  sidebarOpen?: Boolean;
  setSidebarOpen: (value: Boolean) => void;
}

export const useSidebarState = create<SidebarState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      setSidebarOpen: (value) => set(() => ({ sidebarOpen: value })),
    }),
    {
      name: 'sidebar-display', // Name of the storage (localStorage key)
      storage: createJSONStorage(() => localStorage), // Specify storage type
      partialize: (state) => ({ sidebarOpen: state.sidebarOpen }), // Specify which state to persist
    }
  )
);
