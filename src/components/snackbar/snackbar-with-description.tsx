import React, { useState } from 'react';
import { closeSnackbar, CustomContentProps, SnackbarContent } from 'notistack';
import { Box, Card, CardContent, Collapse, IconButton, Typography, useTheme } from '@mui/material';
import Iconify from '../iconify';

interface SnackbarWithDescriptionProps extends CustomContentProps {
  title: string;
}

export const SnackbarWithDescription = React.forwardRef<
  HTMLDivElement,
  SnackbarWithDescriptionProps
>((props, ref) => {
  const { id, title, message, ...other } = props;
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  const handleCloseSnackbar = () => {
    closeSnackbar(id);
  };

  return (
    <SnackbarContent ref={ref} role="alert">
      <Card
        sx={{
          backgroundColor: 'background.paper',
          width: 300,
          border: 'none',
          borderRadius: 1,
          boxShadow: theme.customShadows.z8,
        }}
      >
        <CardContent
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px 12px',
          }}
        >
          <Typography sx={{ fontWeight: 'bold' }}>{title}</Typography>
          <Box sx={{ display: 'flex' }}>
            <IconButton size="small" onClick={() => setExpanded(!expanded)}>
              <Iconify
                icon={
                  expanded
                    ? 'material-symbols:keyboard-arrow-up-rounded'
                    : 'material-symbols:keyboard-arrow-down-rounded'
                }
                color={theme.palette.text.primary}
                width={24}
              />
            </IconButton>
            <IconButton size="small" onClick={handleCloseSnackbar}>
              <Iconify
                icon="material-symbols:close-small-rounded"
                color={theme.palette.text.primary}
                width={24}
              />
            </IconButton>
          </Box>
        </CardContent>

        <Collapse in={expanded}>
          <CardContent sx={{ backgroundColor: 'background.paper', padding: '4px 16px 12px 16px' }}>
            <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {message}
            </Typography>
          </CardContent>
        </Collapse>
      </Card>
    </SnackbarContent>
  );
});
