import { create } from 'zustand';

import ApplicationInterface from 'src/types/application-interface';

interface ApplicationState {
  applications: ApplicationInterface[];
  setApplications: (value: ApplicationInterface[]) => void;
}

export const useApplicationState = create<ApplicationState>()((set) => ({
  applications: [],
  setApplications: (value) => set(() => ({ applications: value })),
}));
