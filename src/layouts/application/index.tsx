import { Box, Card, CardHeader, Grid, useTheme } from '@mui/material';
import { useCollapseDashboardMenu } from 'src/store/collapseDashboardMenu';

import Label from 'src/components/label';
import { useParams } from 'react-router-dom';
import { useDashboardState } from 'src/store/dashboardState';
import { useThemeMode } from 'src/theme/ThemeModeContext';

import ApplicationMenuSidebar from './sidebar';

type Props = {
  children: React.ReactNode;
};

export default function ApplicationLayout({ children }: Props) {
  const theme = useTheme();
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
      <ApplicationMenuSidebar />
      <Card
        sx={{
          width: collapseAppMenu ? '100%' : 'calc(100% - 200px)',
          maxWidth: '100vw',
          ml: -2,
          background: paletteMode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
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
