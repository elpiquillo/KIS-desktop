import Box, { BoxProps } from '@mui/material/Box';
import Card from '@mui/material/Card';

import 'simplebar-react/dist/simplebar.min.css';

import { useResponsive } from 'src/hooks/use-responsive';
import { useSidebarState } from 'src/store/sidebarState';

import { NAV, HEADER } from '../config-layout';

// ----------------------------------------------------------------------

const SPACING = 8;

export default function Main({ children, sx, ...other }: BoxProps) {
  const lgUp = useResponsive('up', 'lg');
  const { sidebarOpen } = useSidebarState();

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        minHeight: 1,
        display: 'flex',
        flexDirection: 'column',
        py: { xs: 0.5, md: `${HEADER.H_MOBILE + SPACING}px` },
        px: { xs: 0.5 },
        pl: { xs: 0.5 },
        pr: { xs: 0.7 },
        ...(lgUp && {
          pr: 0.5,
          pb: 0.5,
          px: 0,
          pt: 0,
          pl: sidebarOpen ? 0 : 0.7,
          py: 0,
          // width: `calc(100% - ${NAV.W_VERTICAL}px)`,
          // ...(isNavMini && {
          width: `calc(100% - ${NAV.W_MINI}px)`,
          // }),
        }),
        ...sx,
      }}
      {...other}
    >
      <Card sx={{ height: '100%', background: 'none', border: 'none', boxShadow: 1 }}>
        {children}
      </Card>
    </Box>
  );
}
