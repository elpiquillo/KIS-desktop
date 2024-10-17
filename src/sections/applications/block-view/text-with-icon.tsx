import { Box, Card, IconButton } from '@mui/material';
import '../../../assets/fonts/style.css';

interface Props {
  blockInfo: any;
}

export default function TextWithIconView({ blockInfo }: Props) {
  const { data } = blockInfo.blocs[0];

  return (
    <Card
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: 3,
        // boxShadow: 2,
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Box sx={{ typography: 'subtitle2' }}>{data.description}</Box>
        <Box sx={{ mt: 1.5, mb: 1, typography: 'h4' }}>{data.title}</Box>
      </Box>
      <IconButton
        disableRipple
        sx={{
          backgroundColor: 'grey.200',
          borderRadius: '50%',
          background: (theme) => theme.palette.primary.dark,
          '&:hover': {
            cursor: 'auto',
          },
          '&:focus': {
            outline: 'none',
          },
        }}
      >
        <i className={data.icon} style={{ fontSize: 24, padding: 3, color: 'white' }}>
          <span className="path1" />
          <span className="path2" />
        </i>
      </IconButton>
    </Card>
  );
}
