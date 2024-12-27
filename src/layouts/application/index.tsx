import { useState } from 'react';
import {
  Avatar,
  Box,
  Card,
  CardHeader,
  Chip,
  Divider,
  Grid,
  Typography,
  useTheme,
} from '@mui/material';

import Label from 'src/components/label';
import { useLocation, useNavigation, useParams } from 'react-router-dom';
import { useDashboardState } from 'src/store/dashboardState';
import { useThemeMode } from 'src/theme/ThemeModeContext';

import ApplicationMenuSidebar from './sidebar';

type Props = {
  children: React.ReactNode;
};

export default function ApplicationLayout({ children }: Props) {
  const [sidebarWidth, setSidebarWidth] = useState<number>(0);
  const theme = useTheme();
  const { paletteMode } = useThemeMode();

  const handleSidebarResize = (newWidth: number) => {
    setSidebarWidth(newWidth);
  };
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
      <ApplicationMenuSidebar onSidebarResize={handleSidebarResize} />
      <Card
        sx={{
          width: `calc(100% - ${sidebarWidth}px)`,
          maxWidth: '100vw',
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          background: paletteMode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
          border: 'none',
        }}
      >
        <CardHeader
          sx={{ px: 2.5, py: 1.8 }}
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

        <Divider sx={{ borderStyle: 'dashed' }} />

        {children}
      </Card>
    </Grid>
  );
}
