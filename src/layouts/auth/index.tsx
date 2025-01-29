import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';

import { t } from 'i18next';
import Logo from 'src/components/logo';
import { useResponsive } from 'src/hooks/use-responsive';


// ----------------------------------------------------------------------

type Props = {
  image?: string;
  children: React.ReactNode;
};

export default function AuthLayout({ children, image }: Props) {
  const mdUp = useResponsive('up', 'md');

  const renderContent = (
    <Stack
      sx={{
        width: 1,
        mx: 'auto',
        maxWidth: 560,
        px: { xs: 2, md: 8 },
        backgroundColor: (theme) => theme.palette.background.paper,
      }}
    >
      <Logo
        sx={{
          mt: { xs: 2, md: 8 },
          mb: { xs: 10, md: 8 },
        }}
      />

      <Card
        sx={{
          py: { xs: 5, md: 0 },
          px: { xs: 3, md: 0 },
          boxShadow: { md: 'none' },
          overflow: { md: 'unset' },
          border: 'none',
          // bgcolor: { md: 'background.default' },
        }}
      >
        {children}
      </Card>
    </Stack>
  );

  const renderSection = (
    <Stack
      flexGrow={1}
      sx={{
        position: 'relative',
        backgroundColor: (theme) => theme.palette.background.paper,
      }}
    >
      <Box
        component="img"
        alt="auth"
        src={image || '/assets/background/overlay_3.jpg'}
        sx={{
          backgroundColor: '#59bf95',
          top: 16,
          left: 16,
          objectFit: 'cover',
          position: 'absolute',
          width: 'calc(100% - 32px)',
          height: 'calc(100% - 32px)',
          borderRadius: 1,
        }}
      />
      {/* <Box
        component="video"
        src="https://cdn.dribbble.com/userupload/9824066/file/original-23fac588460b0d94e2a1c89c194c295d.mp4"
        autoPlay
        loop
        muted
        sx={{
          backgroundColor: '#59bf95',
          top: 16,
          left: 16,
          objectFit: 'cover',
          position: 'absolute',
          width: 'calc(100% - 32px)',
          height: 'calc(100% - 32px)',
          borderRadius: 1
        }}
      /> */}
    </Stack>
  );

  return (
    <Stack
      component="main"
      direction="row"
      sx={{
        minHeight: '100vh',
        position: 'relative',
        '&:before': {
          width: 1,
          height: 1,
          zIndex: -1,
          content: "''",
          position: 'absolute',
          backgroundSize: 'cover',
          opacity: { xs: 0.24, md: 0 },
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          backgroundImage: 'url(/assets/background/overlay_4.jpg)',
        },
      }}
    >
      {renderContent}

      {mdUp && renderSection}
    </Stack>
  );
}
