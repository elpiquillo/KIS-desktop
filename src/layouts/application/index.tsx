import { useState } from 'react';
import { Grid } from '@mui/material';

import ApplicationMenuSidebar from './sidebar';

type Props = {
  children: React.ReactNode;
};

export default function ApplicationLayout({ children }: Props) {
  const [sidebarWidth, setSidebarWidth] = useState<number>(0);

  const handleSidebarResize = (newWidth: number) => {
    setSidebarWidth(newWidth);
  };

  return (
    <Grid sx={{ display: 'flex', flexWrap: 'nowrap' }} container height="100%" maxWidth="100vw">
      <ApplicationMenuSidebar onSidebarResize={handleSidebarResize} />
      <Grid item sx={{ width: `calc(100% - ${sidebarWidth}px)`, maxWidth: '100vw' }}>
        {children}
      </Grid>
    </Grid>
  );
}
