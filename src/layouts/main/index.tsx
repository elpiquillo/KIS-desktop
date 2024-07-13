import { Box } from '@mui/material';
import React from 'react';
import Sidebar from './sidebar';
import Main from './main';
// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: Props) {
  return (
    <Box
      sx={{
        minHeight: 1,
        display: 'flex',
        flexDirection: { xs: 'column', lg: 'row' },
      }}
    >
      <Sidebar />
      <Main>{children}</Main>
    </Box>
  );
}
