import Box, { BoxProps } from '@mui/material/Box';
import Card from '@mui/material/Card';
import 'simplebar-react/dist/simplebar.min.css';

import { useResponsive } from 'src/hooks/use-responsive';

import { NAV, HEADER } from '../config-layout';

// ----------------------------------------------------------------------

const SPACING = 8;

export default function Main({ children, sx, ...other }: BoxProps) {
  const lgUp = useResponsive('up', 'lg');

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        minHeight: 1,
        display: 'flex',
        flexDirection: 'column',
        py: `${HEADER.H_MOBILE + SPACING}px`,
        ...(lgUp && {
          px: 1,
          pl: 0.2,
          py: 1,
          // width: `calc(100% - ${NAV.W_VERTICAL}px)`,
          // ...(isNavMini && {
            width: `calc(100% - ${NAV.W_MINI}px)`,
          // }),
        }),
        ...sx,
      }}
      {...other}
    >
      <Card sx={{ borderRadius: 1, height: '100%', background: '#f9fafbb0' }}>
        {children}
      </Card>
    </Box>
  );
}
