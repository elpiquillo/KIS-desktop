import { useState } from 'react';
import { Card, Grid } from '@mui/material';

import Label from 'src/components/label';
import { useParams } from 'react-router-dom';
import { useDashboardState } from 'src/store/dashboardState';

import ApplicationMenuSidebar from './sidebar';

type Props = {
  children: React.ReactNode;
};

export default function ApplicationLayout({ children }: Props) {
  const [sidebarWidth, setSidebarWidth] = useState<number>(0);

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
      <Card sx={{ width: `calc(100% - ${sidebarWidth}px)`, maxWidth: '100vw', ml: 0.5 }}>
        <Label title={pageName} m={2}>
          {pageName}
        </Label>
        {children}
      </Card>
    </Grid>
  );
}
