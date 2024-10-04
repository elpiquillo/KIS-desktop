import { useEffect } from "react";
import { useSidebarState } from "src/store/sidebarState";

export const useLoadSidebarState = () => {
  const { setSidebarOpen } = useSidebarState();

  useEffect(() => {
    // Check if there is a saved value in localStorage
    const saved = localStorage.getItem('sidebarOpen');
    if (saved !== null) {
      // If a value exists, update the Zustand store with the saved state
      setSidebarOpen(JSON.parse(saved));
    }
  }, [setSidebarOpen]);
};