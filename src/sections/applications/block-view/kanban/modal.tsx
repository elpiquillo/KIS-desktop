import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  useTheme,
} from '@mui/material';
import { t } from 'i18next';
import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import RhfColorCheckbox from 'src/components/hook-form/rhf-color-checkbox';
import Iconify from 'src/components/iconify';
import { error, info, success, warning } from 'src/theme/palette';
import { KanbanData } from 'src/types/application/kanban-interface';
import { Document } from 'src/types/queries-interface';

const LABELS = [
  { name: 'project_label_red', color: error.main },
  { name: 'project_label_green', color: success.main },
  { name: 'project_label_blue', color: info.main },
  { name: 'project_label_yellow', color: warning.main },
];

interface Props {
  open: boolean;
  task: Document | null;
  blockData: KanbanData['data'];
  handleClose: () => void;
}

export default function TaskModal({ open, task, blockData, handleClose }: Props) {
  const cardContent = useMemo(
    () =>
      blockData.queries_dispatch[0].destination_fields.find((field) => 'card_content' in field)
        ?.card_content,
    [blockData.queries_dispatch]
  );
  const defaultFormValues = useMemo(() => {
    if (task) {
      return task;
    }
    if (cardContent?.length) {
      const defaultValues = cardContent?.reduce(
        (acc, field) => ({ ...acc, [field.content]: '' }),
        {}
      );
      return {
        ...defaultValues,
        project_label_red: false,
        project_label_green: false,
        project_label_blue: false,
        project_label_yellow: false,
      };
    }
    return {};
  }, [cardContent, task]);

  const formMethods = useForm({
    defaultValues: defaultFormValues,
  });
  const { handleSubmit, reset } = formMethods;

  useEffect(() => {
    if (open) {
      reset(defaultFormValues);
    }
  }, [defaultFormValues, open, reset]);

  const onSubmitForm = handleSubmit(async (formData: any) => {});

  const redirectToInfo = () => {};

  const handleDeleteTask = () => {};

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <FormProvider methods={formMethods} onSubmit={onSubmitForm}>
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

        <DialogContent>
          <Grid container spacing={2} mb={1}>
            {LABELS.map((label) => (
              <Grid item xs={3} key={label.name}>
                <RhfColorCheckbox color={label.color} name={label.name} />
              </Grid>
            ))}
          </Grid>

          {cardContent?.map((field) => (
            <RHFTextField
              key={field.id}
              name={field.content}
              label={blockData.card_content.find((c) => c.id === field.id)?.title}
              margin="dense"
              variant="outlined"
            />
          ))}
        </DialogContent>

        <DialogActions>
          <Button onClick={redirectToInfo} variant="outlined" color="inherit">
            {t('global.info')}
          </Button>
          <Button onClick={handleDeleteTask} variant="outlined" color="error">
            {t('applications.delete')}
          </Button>
          <Button type="submit" variant="contained" color="success">
            {t('global.saveChanges')}
          </Button>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
