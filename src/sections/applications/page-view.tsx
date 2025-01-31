import SimpleBar from 'simplebar-react';
import { Box, useTheme } from '@mui/material';
import { useThemeMode } from 'src/theme/ThemeModeContext';
import { useDashboardState } from 'src/store/dashboardState';
import ContainerView from './container-view';

export default function PageView() {
  const theme = useTheme();
  const dashboard = useDashboardState((s) => s.dashboard);
  const structure = dashboard?.pages.pages[0].structure;
  const { paletteMode } = useThemeMode();

  return (
    <SimpleBar style={{ maxHeight: 'calc(100vh - 105px)' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          p: 2,
          gap: 2,
          flexGrow: 1,
          background: paletteMode === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
        }}
      >
        {structure?.map((container) => <ContainerView container={container} sx={{ p: 2 }} />)}
      </Box>
    </SimpleBar>
  );
}
