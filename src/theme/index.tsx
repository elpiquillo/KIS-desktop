// src/theme/index.tsx

import { useMemo } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider as MuiThemeProvider, ThemeOptions } from '@mui/material/styles';
import { palette } from './palette';
import { shadows } from './shadows';
import { typography } from './typography';
import { customShadows } from './custom-shadows';
import { componentsOverrides } from './overrides';
import { GlobalStyles } from '@mui/material';
import { ThemeModeProvider, useThemeMode } from './ThemeModeContext';

type Props = {
  children: React.ReactNode;
};

function CustomThemeProvider({ children }: Props) {
  const { paletteMode } = useThemeMode();

  const memoizedValue = useMemo<ThemeOptions>(
    () => ({
      palette: palette(paletteMode),
      shadows: shadows(paletteMode),
      customShadows: customShadows(paletteMode),
      shape: { borderRadius: 8 },
      typography,
    }),
    [paletteMode]
  );

  const theme = createTheme(memoizedValue);

  theme.components = componentsOverrides(theme);

  const bgGradient =
    paletteMode === 'light'
      ? 'linear-gradient(to top, #c1dfc4 0%, #deecdd 100%);'
      : 'linear-gradient(135deg, #212b36 0%, #38495c 50%, #212b36 100%);';

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
