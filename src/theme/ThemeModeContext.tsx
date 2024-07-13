// src/theme/ThemeModeContext.tsx

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { PaletteMode } from '@mui/material';

interface ThemeModeContextType {
  paletteMode: PaletteMode;
  togglePaletteMode: () => void;
}

const ThemeModeContext = createContext<ThemeModeContextType | undefined>(undefined);

export const ThemeModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [paletteMode, setPaletteMode] = useState<PaletteMode>(() => {
    const storedMode = localStorage.getItem('paletteMode');
    return storedMode === 'dark' ? 'dark' : 'light';
  });

  const togglePaletteMode = useCallback(() => {
    setPaletteMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('paletteMode', newMode);
      return newMode;
    });
  }, []);

  useEffect(() => {
    localStorage.setItem('paletteMode', paletteMode);
  }, [paletteMode]);

  return (
    <ThemeModeContext.Provider value={{ paletteMode, togglePaletteMode }}>
      {children}
    </ThemeModeContext.Provider>
  );
};

export const useThemeMode = (): ThemeModeContextType => {
  const context = useContext(ThemeModeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within a ThemeModeProvider');
  }
  return context;
};
