import { Box, useTheme } from '@mui/material';
import SimpleBar from 'simplebar-react';
import { useResponsive } from 'src/hooks/use-responsive';
import { useDashboardState } from 'src/store/dashboardState';
import { useThemeMode } from 'src/theme/ThemeModeContext';
import ContainerView from './container-view';

export default function PageView() {
  const theme = useTheme();
  const dashboard = useDashboardState((s) => s.dashboard);
  const structure = dashboard?.pages.pages[0].structure;
  const lgUp = useResponsive('up', 'lg');
  const smDown = useResponsive('down', 'sm');
  const { paletteMode } = useThemeMode();

  return (
    <SimpleBar
      style={{
        ...(lgUp && {
          maxHeight: 'calc(100vh - 105px)',
        }),
        ...(smDown && {
          maxHeight: 'calc(100vh - 210px)',
        }),
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          p: 2,
          gap: 2,
          flexGrow: 1,
          background:
            paletteMode === 'light' ? theme.palette.background.paper : theme.palette.grey[900],
        }}
      >
        {structure?.map((container) => <ContainerView container={container} sx={{ p: 2 }} />)}
      </Box>
    </SimpleBar>
  );
}
