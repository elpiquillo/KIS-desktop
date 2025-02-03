import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define the type for the store
interface ThemeStore {
  themeName: string; // Specific theme name
  setThemeName: (name: string) => void; // Function to set the theme name
}
// Create the store
const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      themeName: 'default', // Default theme name
      setThemeName: (name) => set({ themeName: name }),
    }),
    {
      name: 'theme-storage', // Key in localStorage
    }
  )
);

export default useThemeStore;
