import { hideScroll } from 'src/theme/css';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { NavAppSection } from 'src/components/nav-app-section';
import { useApplicationState } from 'src/store/applicationState';
import { useGetApplicationsAll } from 'src/apis/application';

import { NAV } from '../config-layout';

import AccountPopover from './account-popover';

// ----------------------------------------------------------------------

export default function Sidebar() {
  const applications = useApplicationState((s) => s.applications);
  const { data } = useGetApplicationsAll();

  return (
    <Box
      sx={{
        display: 'flex', flexDirection: 'column',
        width: { lg: NAV.W_MINI },
      }}
    >
      <Stack
        sx={{
          flex: 1, justifyContent: 'space-between',
          pb: 2,
          pt: 2,
          height: 1,
          position: 'fixed',
          width: NAV.W_MINI,
          ...hideScroll.x,
        }}
      >
        <NavAppSection applications={applications || data} />
        <Box sx={{ flex: 1 }} />
        <AccountPopover />
      </Stack>
      
    </Box>
  );
}
