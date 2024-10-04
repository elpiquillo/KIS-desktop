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

  return (
    <>
      <Header />
      <Box
        sx={{
          minHeight: 1,
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
        }}
      >
        {
          sidebarOpen && (
            <Sidebar />
          )
        }
        <Main>
          {children}
        </Main>
      </Box>
    </>
  );
}
