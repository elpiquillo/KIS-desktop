import { IconButton, Box, Button, useTheme, Typography, Fade } from '@mui/material';
import { Trans } from 'react-i18next';
import { t } from 'i18next';

import Iconify from '../iconify';

interface CustomToolbarProps {
  selectedRowCount: number;
  onClose: () => void;
  onDelete: () => void;
}

function TableCustomToolbar({ selectedRowCount, onClose, onDelete }: CustomToolbarProps) {
  const theme = useTheme();

  if (selectedRowCount === 0) {
    return null;
  }

  return (
    <Fade in>
      <Box
        ml={2}
        width={450}
        height={50}
        borderRadius={1}
        sx={{
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)', // Add box shadow
          position: 'fixed',
          bottom: '5%',
          left: '50%',
          transform: 'translate(-50%, 0)',
          background: theme.palette.background.default,
          display: 'flex',
          alignItems: 'center', // Center vertically
          justifyContent: 'space-between', // Distribute space between items
          padding: '0 10px', // Add horizontal padding for better alignment
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            size="small"
            aria-label={t('global.cancel')}
            onClick={onClose}
          >
            <Iconify icon="material-symbols:close" />
          </IconButton>

          <Typography variant="subtitle2" color={theme.palette.background.paper} ml={1}>
            <Trans
              i18nKey="database.dataPage.xRowsSelected"
              values={{ number: selectedRowCount }}
            />
          </Typography>
        </Box>

        <Button
          sx={{ color: theme.palette.background.paper }}
          variant='outlined'
          onClick={onDelete}
          startIcon={<Iconify icon="material-symbols:delete-outline" />}
        >
          {t('global.deleteSelection')}
        </Button>
      </Box>
    </Fade>
  );
}

export default TableCustomToolbar;
