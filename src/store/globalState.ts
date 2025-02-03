import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface GlobalState {
  showAllApplications: Boolean;
  setShowAllApplications: (value: Boolean | false) => void;
}

export const useGlobalState = create<GlobalState>()(
  persist(
    (set) => ({
      showAllApplications: true,
      setShowAllApplications: (value) => set(() => ({ showAllApplications: value })),
    }),
    {
      name: 'show-all-applications', // Name of the storage (localStorage key)
      storage: createJSONStorage(() => localStorage), // Specify storage type
      partialize: (state) => ({ showAllApplications: state.showAllApplications }), // Specify which state to persist
    }
  )
);
