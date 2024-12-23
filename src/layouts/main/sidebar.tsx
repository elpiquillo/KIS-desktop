import { hideScroll } from 'src/theme/css';

import Box, { BoxProps } from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';

import { NavAppSection } from 'src/components/nav-app-section';
import { useDashboardAccessState } from 'src/store/dashboardAccessState';
import { useGetDashboardAccessesAll } from 'src/apis/dashboard-access';

import { NAV } from '../config-layout';

import AccountPopover from './account-popover';

// ----------------------------------------------------------------------

export default function Sidebar({ sx }: BoxProps) {
  const applications = useDashboardAccessState((s) =>
    s.applications.filter((app) => app.id.display && app.favorite)
  );
  const { data } = useGetDashboardAccessesAll(
    applications === undefined || applications.length === 0
  );

  return (
    <Card
      sx={{
        flexShrink: 0, // Sidebar keeps its width
        flexGrow: 1, // Ensures it stretches to fill the parent's height
        height: '100%', // Ensures full height matching Main
        display: 'flex',
        flexDirection: 'column',
        width: { lg: NAV.W_MINI },
        ...sx,
      }}
    >
      <Stack
        sx={{
          flex: 1,
          justifyContent: 'space-between',
          pt: 2,
          pb: 2,
          height: '100%', // Matches the Card's height
          position: 'relative', // Avoid breaking layout
          width: NAV.W_MINI, // Sidebar width
          ...hideScroll.x,
        }}
      >
        <NavAppSection applications={applications || data} />
        <Box sx={{ flex: 1 }} />
        <Box sx={{ mx: 'auto' }}>
          <AccountPopover />
        </Box>
      </Stack>
    </Card>
  );
}
