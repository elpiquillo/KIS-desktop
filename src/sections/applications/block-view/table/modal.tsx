import { Button, Popover, Stack, TextField } from '@mui/material';
import { t } from 'i18next';
import React from 'react';

interface Props {
  nameColumn: string;
  open: HTMLElement | null;
  onClose: () => void;
}

export default function FilterModal({ nameColumn, open, onClose }: Props) {
  return (
    <Popover
      open={!!open}
      onClose={onClose}
      anchorEl={open}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
    >
      <Stack width={200}>
        <Stack p={1}>
          <TextField
            fullWidth
            name="filter_operator"
            size="small"
            margin="none"
            variant="outlined"
            type="text"
          />
        </Stack>
        <Stack p={1} flexDirection="row">
          <TextField
            fullWidth
            name="filter_value"
            size="small"
            margin="none"
            variant="outlined"
            type="text"
          />
        </Stack>
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={2} p={1}>
          <Button fullWidth variant="outlined">
            {t('applications.filter')}
          </Button>
          <Button fullWidth variant="outlined" color="error">
            {t('applications.delete')}
          </Button>
        </Stack>
      </Stack>
    </Popover>
  );
}
