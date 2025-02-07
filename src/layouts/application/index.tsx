import { Box, Card, CardHeader, Grid, IconButton, useTheme } from '@mui/material';
import { useParams } from 'react-router-dom';
import Iconify from 'src/components/iconify';
import Label from 'src/components/label';

import { useResponsive } from 'src/hooks/use-responsive';
import { useCollapseDashboardMenu } from 'src/store/collapseDashboardMenu';
import { useDashboardAccessState } from 'src/store/dashboardAccessState';
import { useDashboardState } from 'src/store/dashboardState';
import { useSidebarState } from 'src/store/sidebarState';

import { useThemeMode } from 'src/theme/ThemeModeContext';

import ApplicationMenuSidebar from './sidebar';

type Props = {
  children: React.ReactNode;
};

export default function ApplicationLayout({ children }: Props) {
  const theme = useTheme();
  const lgUp = useResponsive('up', 'lg');

  const { paletteMode } = useThemeMode();
  const { collapseAppMenu, setCollapseAppMenu } = useCollapseDashboardMenu();
  const { sidebarOpen } = useSidebarState();

  const { pageId, applicationId } = useParams();
  const application = useDashboardAccessState((state) =>
    state.applications.find((app) => app.id.id === applicationId)
  );
  const { dashboardMenu } = useDashboardState();
  const pageName = dashboardMenu?.content.find((item) => item.menu_item_url.url === pageId)
    ?.menu_item_url.text;

  return (
    <Grid
      sx={{ display: 'flex', flexWrap: 'nowrap', background: 'none' }}
      container
      height="100%"
      maxWidth="100vw"
    >
      <ApplicationMenuSidebar />
      <Card
        sx={{
          width: collapseAppMenu || !lgUp ? '100%' : 'calc(100% - 200px)',
          maxWidth: '100vw',
          ml: lgUp ? -2 : 0,
          background:
            paletteMode === 'light' ? theme.palette.background.paper : theme.palette.grey[900],
          border: 'none',
          transition: 'width 0.3s ease-in-out',
        }}
      >
        <CardHeader
          sx={{
            px: 2.5,
            py: 1.9,
            borderBottom: '1px dashed',
            borderColor: 'divider',
          }}
          title={
            <Box>
              {!lgUp && application && (
                <IconButton
                  sx={{
                    borderRadius: 1,
                    mr: 1,
                    ml: -1,
                  }}
                  aria-label="collapse applications menu"
                  onClick={() => {
                    setCollapseAppMenu(!collapseAppMenu);
                  }}
                >
                  <Iconify
                    icon={sidebarOpen ? 'hugeicons:sidebar-left-01' : 'hugeicons:sidebar-left'}
                    color={theme.palette.text.primary}
                    width={28}
                  />
                </IconButton>
              )}

              {/* <Typography variant="button">Actions fréquentes</Typography>&nbsp;
              <Label title={pageName} mr={1} variant="soft">
                Voir les Pays
              </Label>
              <Label title={pageName} mr={1}>
                Créer un Personnage
              </Label>
              <Label title={pageName} mr={1} variant="soft">
                Gérer le planning */}
              <Label title={pageName} variant="soft" mr={1}>
                {pageName}
              </Label>
            </Box>
          }
        />

        {children}
      </Card>
    </Grid>
  );
}
