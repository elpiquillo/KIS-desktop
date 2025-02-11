import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';

import { useResponsive } from 'src/hooks/use-responsive';
import { useSidebarState } from 'src/store/sidebarState';

import Header from './header';
import Main from './main';
import Sidebar from './sidebar';
// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: Props) {
  const { sidebarOpen } = useSidebarState();
  const lgUp = useResponsive('up', 'lg');
  const smDown = useResponsive('down', 'sm');
  const [boxHeight, setBoxHeight] = useState('100vh');

  useEffect(() => {
    const updateHeight = () => {
      const headerHeight = document.getElementById('header')?.offsetHeight || 0;
      const windowHeight = window.innerHeight;
      setBoxHeight(`${windowHeight - headerHeight}px`);
    };

    // Initial height and event listener
    updateHeight();
    window.addEventListener('resize', updateHeight);

    // Cleanup event listener
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: smDown ? 'calc(100vh - 75px)' : '100vh',
      }}
    >
      {lgUp && <Header />}
      <Box
        sx={{
          display: 'flex',
          flex: 1, // Take remaining space after Header
          flexDirection: 'row',
        }}
      >
        {lgUp && sidebarOpen && (
          <Sidebar
            sx={{
              background: 'none',
              boxShadow: 0,
              flexShrink: 0, // Fixed width
              flexGrow: 1, // Fills the parent's height
              mb: 1,
            }}
          />
        )}
        <Main>{children}</Main>
      </Box>
      {!lgUp && <Header />}
    </Box>
  );
}
