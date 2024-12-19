import { Divider } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { Link } from 'react-router-dom';
import Iconify from 'src/components/iconify';
import { useSidebarState } from 'src/store/sidebarState';

export default function Header() {
  const { sidebarOpen, setSidebarOpen } = useSidebarState();

  const handleToggleSidebar = () => {
    localStorage.setItem('sidebarOpen', JSON.stringify(!sidebarOpen));
    setSidebarOpen(!sidebarOpen);
  };

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
          onClick={handleToggleSidebar}
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
