import { create } from 'zustand';

interface GlobalState {
  showAllApplications: Boolean;
  setShowAllApplications: (value: Boolean | false) => void;
}

export const useGlobalState = create<GlobalState>()((set) => ({
  showAllApplications: false,
  setShowAllApplications: (value) => set(() => ({ showAllApplications: value })),
}));
