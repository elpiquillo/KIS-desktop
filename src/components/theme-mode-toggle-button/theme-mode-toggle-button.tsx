// src/components/ThemeToggleButton.tsx
import { useThemeMode } from 'src/theme/ThemeModeContext';
import { t } from 'i18next';

import { Box, Button, Typography } from '@mui/material';
import Iconify from '../iconify';

interface ToogleModeInterface {
  title: string;
}

export default function ThemeModeToggleButton({ title }: ToogleModeInterface) {
  const { paletteMode, togglePaletteMode } = useThemeMode();

  return (
    <Box
      display="flex"
      alignItems="center"
    >
      <Typography variant="subtitle2">{title}</Typography>
      <Button
        onClick={togglePaletteMode}
        variant="outlined"
        sx={{ ml: 1, mb: 1, mt: 1 }}
        startIcon={
          paletteMode === 'light' ?
            <Iconify icon="material-symbols-light:nights-stay" width={24} height={24} /> :
            <Iconify icon="fluent:weather-sunny-high-20-filled" width={24} height={24} />
        }
      >
        {paletteMode === 'light' ? t('settings.darkMode') : t('settings.lightMode')}
      </Button>
    </Box>
  );
};
