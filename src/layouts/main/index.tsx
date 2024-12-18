import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import { useLoadSidebarState } from 'src/hooks/use-load-sidebar-state';
import { useSidebarState } from 'src/store/sidebarState';

import Sidebar from './sidebar';
import Main from './main';
import Header from './header';
// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: Props) {
  const { sidebarOpen } = useSidebarState();
  useLoadSidebarState();

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
        height: boxHeight, // Full viewport height
      }}
    >
      <Header />
      <Box
        sx={{
          flex: 1, // Takes the remaining height after Header
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
        }}
      >
        {sidebarOpen && <Sidebar />}
        <Main>{children}</Main>
      </Box>
    </Box>
  );
}
