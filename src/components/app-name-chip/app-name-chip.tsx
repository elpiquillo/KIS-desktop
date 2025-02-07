import { alpha, Avatar, Chip, Typography, useTheme } from '@mui/material';
import { useResponsive } from 'src/hooks/use-responsive';

export default function AppNameChip({
  application_name,
  application_logo,
}: {
  application_name: string;
  application_logo: string;
}) {
  const theme = useTheme();
  const lgUp = useResponsive('up', 'lg');

  return (
    <Chip
      variant={lgUp ? 'outlined' : 'filled'}
      sx={{
        maxWidth: 'calc(100% - 40px)',
        ...(!lgUp && {
          backgroundColor: alpha(theme.palette.background.default, 0.3),
          textAlign: 'left',
          justifyContent: 'flex-start',
          pl: 0.5,
          ml: 1,
          width: 'calc(100vw - 130px)',
          alignContent: 'left',
          height: 40,
        }),
      }}
      avatar={
        <Avatar
          variant="square"
          alt={application_name}
          src={application_logo}
          sx={{ background: theme.palette.background.paper }}
        />
      }
      label={
        <Typography
          variant="body2"
          noWrap
          sx={{
            maxWidth: '130px', // Set a maximum width for the text
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: 'block',
          }}
        >
          {application_name}
        </Typography>
      }
    />
  );
}
