import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface CollapseDashboardMenu {
  collapseAppMenu: Boolean;
  setCollapseAppMenu: (value: Boolean | false) => void;
}

export const useCollapseDashboardMenu = create<CollapseDashboardMenu>()(
  persist(
    (set) => ({
      collapseAppMenu: false,
      setCollapseAppMenu: (value) => set(() => ({ collapseAppMenu: value })),
    }),
    {
      name: 'dashboard-menu-display', // Name of the storage (localStorage key)
      storage: createJSONStorage(() => localStorage), // Specify storage type
      partialize: (state) => ({ collapseAppMenu: state.collapseAppMenu }), // Specify which state to persist
    }
  )
);
