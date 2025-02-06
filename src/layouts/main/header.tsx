import { Avatar, Divider, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { Link } from 'react-router-dom';
import AppNameChip from 'src/components/app-name-chip/app-name-chip';
import Iconify from 'src/components/iconify';

import { useResponsive } from 'src/hooks/use-responsive';
import { useSidebarState } from 'src/store/sidebarState';
import AccountPopover from './account-popover';

export default function Header() {
  const { sidebarOpen, setSidebarOpen } = useSidebarState();
  const lgUp = useResponsive('up', 'lg');

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (lgUp) {
    return (
      <Box
        id="header"
        width="100%"
        sx={{
          userSelect: 'none',
          WebkitAppRegion: 'drag',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            sx={{
              ml: 10,
              WebkitAppRegion: 'no-drag',
              '&:focus, &:focus-visible': {
                outline: 'none',
                backgroundColor: 'transparent',
              },
            }}
            aria-label="collapse applications menu"
            onClick={() => handleToggleSidebar()}
          >
            <Iconify
              icon={sidebarOpen ? 'hugeicons:sidebar-left-01' : 'hugeicons:sidebar-left'}
              color={(theme) => theme.palette.text.primary}
            />
          </IconButton>
          <Divider orientation="vertical" variant="middle" flexItem />

          <Box
            component={Link}
            to="/"
            sx={{
              WebkitAppRegion: 'no-drag',
              '&:focus, &:focus-visible': {
                outline: 'none',
                backgroundColor: 'transparent',
              },
            }}
          >
            <IconButton
              sx={{
                WebkitAppRegion: 'no-drag',
                '&:focus, &:focus-visible': {
                  outline: 'none',
                  backgroundColor: 'transparent',
                },
              }}
              aria-label="collapse applications menu"
            >
              <Iconify icon="fluent:apps-20-filled" color={(theme) => theme.palette.text.primary} />
            </IconButton>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box id="header" width="100%" sx={{ mt: 0.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton
          sx={{
            ml: 1,
            WebkitAppRegion: 'no-drag',
            '&:focus, &:focus-visible': {
              outline: 'none',
              backgroundColor: 'transparent',
            },
          }}
          aria-label="collapse applications menu"
          onClick={() => handleToggleSidebar()}
        >
          <Iconify
            icon={sidebarOpen ? 'hugeicons:sidebar-left-01' : 'hugeicons:sidebar-left'}
            color={(theme) => theme.palette.text.primary}
            width={25}
          />
        </IconButton>

        <AppNameChip application_name="Application Name" application_logo="/static/logo.svg" />

        <Box sx={{ ml: 'auto', mr: 1 }}>
          <IconButton
            component={Link}
            to="/"
            size="large"
            sx={{
              mr: 1,
              WebkitAppRegion: 'no-drag',
              '&:focus, &:focus-visible': {
                outline: 'none',
                backgroundColor: 'transparent',
              },
            }}
            aria-label="collapse applications menu"
            onClick={() => handleToggleSidebar()}
          >
            <Iconify
              icon="fluent:apps-20-filled"
              color={(theme) => theme.palette.text.primary}
              width={28}
            />
          </IconButton>
          <AccountPopover />
        </Box>
      </Box>
    </Box>
  );
}
