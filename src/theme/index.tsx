// src/theme/index.tsx

import { useEffect, useMemo } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider as MuiThemeProvider, ThemeOptions } from '@mui/material/styles';
import { palette } from './palette';
import { shadows } from './shadows';
import { typography } from './typography';
import { customShadows } from './custom-shadows';
import { componentsOverrides } from './overrides';
import { GlobalStyles } from '@mui/material';
import { ThemeModeProvider, useThemeMode } from './ThemeModeContext';
import themesColor from 'src/utils/themes-color';
import useThemeStore from 'src/store/themeModeState';

type Props = {
  children: React.ReactNode;
};

function CustomThemeProvider({ children }: Props) {
  const { paletteMode } = useThemeMode();
  const { themeName } = useThemeStore();

  useEffect(() => {
    if (themeName && themesColor[themeName as keyof typeof themesColor]) {
      document.body.style.background =
        themesColor[themeName as keyof typeof themesColor].app_background;
    }
  }, [paletteMode, localStorage, themeName]);

  const memoizedValue = useMemo<ThemeOptions>(
    () => ({
      palette: palette(paletteMode),
      shadows: shadows(paletteMode),
      customShadows: customShadows(paletteMode),
      shape: { borderRadius: 12 },
      typography,
    }),
    [paletteMode]
  );

  const theme = createTheme(memoizedValue);

  theme.components = componentsOverrides(theme);

  const bgGradient = paletteMode === 'light' ? themesColor.sunrise : themesColor.midnight_glowDark;

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          body: {
            background: bgGradient,
            height: '100vh',
            margin: 0,
            padding: 0,
          },
        }}
      />
      {children}
    </MuiThemeProvider>
  );
}

export default function ThemeProvider({ children }: Props) {
  return (
    <ThemeModeProvider>
      <CustomThemeProvider>{children}</CustomThemeProvider>
    </ThemeModeProvider>
  );
}
