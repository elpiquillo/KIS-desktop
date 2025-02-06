import { Box, Card, CardHeader, Grid, useTheme } from '@mui/material';
import { useParams } from 'react-router-dom';
import Label from 'src/components/label';

import { useResponsive } from 'src/hooks/use-responsive';
import { useCollapseDashboardMenu } from 'src/store/collapseDashboardMenu';

import { useDashboardState } from 'src/store/dashboardState';
import { useThemeMode } from 'src/theme/ThemeModeContext';

import CollapseMenuButton from './collapseMenuButton';
import ApplicationMenuSidebar from './sidebar';

type Props = {
  children: React.ReactNode;
};

export default function ApplicationLayout({ children }: Props) {
  const theme = useTheme();
  const lgUp = useResponsive('up', 'lg');

  const { paletteMode } = useThemeMode();
  const { collapseAppMenu } = useCollapseDashboardMenu();

  const { pageId } = useParams();
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
      {lgUp && <ApplicationMenuSidebar />}
      <Card
        sx={{
          width: collapseAppMenu ? '100%' : 'calc(100% - 200px)',
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
              {!lgUp && <CollapseMenuButton />}
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
