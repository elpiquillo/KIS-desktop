import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { t } from 'i18next';
import React from 'react';

interface ModalProps {
  eventInfo: any;
  open: boolean;
  onClose: () => void;
}

export default function EventModal({ eventInfo, open, onClose }: ModalProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{t('applications.details')}</DialogTitle>

      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <TextField
          label={t('applications.calendar.titleEvent')}
          value={eventInfo.title}
          size="small"
          sx={{ mt: 1 }}
          disabled
        />
        <TextField
          label={t('applications.calendar.descriptionEvent')}
          value={eventInfo.description}
          size="small"
          disabled
        />
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label={t('applications.calendar.start')}
              value={dayjs(eventInfo.start_date)}
              disabled
              slotProps={{
                textField: { size: 'small' },
              }}
            />
            <DatePicker
              label={t('applications.calendar.end')}
              value={dayjs(eventInfo.end_date)}
              disabled
              slotProps={{
                textField: { size: 'small' },
              }}
            />
          </LocalizationProvider>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined" color="inherit">
          {t('global.close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
