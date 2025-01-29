import { Paper } from '@mui/material';
import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Iconify from '../iconify';

// ----------------------------------------------------------------------

type EmptyAreaProps = {
  legend?: string;
  filled?: boolean;
  icon?: string;
};

export default function EmptyArea({
  legend,
  filled,
  icon,
  ...other
}: EmptyAreaProps) {
  return (
    <Box
      sx={{
        padding: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%'
      }}
    >
      <Paper
        variant={filled ? 'elevation' : 'outlined'}
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          height: 200,
          borderRadius: 1,
          borderStyle: 'dashed',
          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
        }}
      >
        <Iconify icon={icon || ''} color="text.secondary" />
        <Typography variant="caption" align="center" color="text.secondary" sx={{ mt: 1 }}>
          {legend}
        </Typography>
      </Paper>
    </Box>
  );
}
