import { Dialog, DialogTitle, IconButton } from '@mui/material';
import { t } from 'i18next';
import React from 'react';
import Iconify from 'src/components/iconify';
import { Document } from 'src/types/queries-interface';

interface Props {
  open: boolean;
  task: Document | null;
  handleClose: () => void;
}

export default function TaskModal({ open, task, handleClose }: Props) {
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle>
        {t(task ? 'applications.kanban.editTask' : 'applications.kanban.addTask')}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 15,
            top: 20,
            color: 'text.secondary',
          }}
        >
          <Iconify icon="mdi:close" />
        </IconButton>
      </DialogTitle>
    </Dialog>
  );
}
