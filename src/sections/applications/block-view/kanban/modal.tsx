import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
} from '@mui/material';
import { t } from 'i18next';
import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import RhfColorCheckbox from 'src/components/hook-form/rhf-color-checkbox';
import Iconify from 'src/components/iconify';
import { RouterLink } from 'src/routes/components';
import { useParams } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { error, info, success, warning } from 'src/theme/palette';
import { KanbanData } from 'src/types/application/kanban-interface';
import { DataQuery, Document } from 'src/types/queries-interface';

const LABELS = [
  { name: 'project_label_red', color: error.main },
  { name: 'project_label_green', color: success.main },
  { name: 'project_label_blue', color: info.main },
  { name: 'project_label_yellow', color: warning.main },
];

interface AddTaskProps {
  open: boolean;
  projectStatus: string;
  handleAddTask: (newTask: Document) => void;
  handleClose: () => void;
}

export function AddTaskModal({ open, projectStatus, handleAddTask, handleClose }: AddTaskProps) {
  const defaultFormValues = useMemo(
    () => ({
      client: '',
      ...LABELS.reduce((acc, label) => ({ ...acc, [label.name]: false }), {}),
    }),
    []
  );

  const formMethods = useForm({
    defaultValues: defaultFormValues,
  });
  const { handleSubmit, reset } = formMethods;

  const onSubmitForm = handleSubmit(async (formData: any) => {
    handleAddTask({
      project_id: new Date().valueOf().toString(),
      project_status: projectStatus,
      ...formData,
    });
    handleClose();
  });

  useEffect(() => {
    if (open) {
      reset(defaultFormValues);
    }
  }, [reset, defaultFormValues, open]);

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <FormProvider methods={formMethods} onSubmit={onSubmitForm}>
        <DialogTitle>
          {t('applications.kanban.addTask')}
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

          <RHFTextField name="client" margin="dense" variant="outlined" />
        </DialogContent>

        <DialogActions>
          <Button type="submit" variant="contained" color="success">
            {t('global.saveChanges')}
          </Button>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}

interface EditTaskProps {
  queriesRequest: DataQuery[];
  open: boolean;
  task: Document | null;
  blockData: KanbanData;
  handleSaveUpdatedTasks: (updatedTasks: Document[]) => void;
  handleClose: () => void;
}

export function EditTaskModal({
  queriesRequest,
  open,
  task,
  blockData,
  handleSaveUpdatedTasks,
  handleClose,
}: EditTaskProps) {
  const { applicationId } = useParams();

  const cardContent = useMemo(
    () =>
      blockData.queries_dispatch[0].destination_fields.find((field) => 'card_content' in field)
        ?.card_content,
    [blockData.queries_dispatch]
  );

  const formMethods = useForm({
    defaultValues: { ...task },
  });
  const { handleSubmit, reset } = formMethods;

  useEffect(() => {
    if (open) {
      reset({ ...task });
    }
  }, [open, reset, task]);

  const onSubmitForm = handleSubmit(async (formData: any) => {
    handleSaveUpdatedTasks([formData]);
    handleClose();
  });

  const handleDeleteTask = () => {
    handleSaveUpdatedTasks([{ ...task, project_status: '' } as Document]);
    handleClose();
  };

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
          {blockData.button_action.map((button) => (
            <Button
              key={button.id}
              variant="outlined"
              color="inherit"
              sx={{
                mr: 1.5,
                '&:hover': {
                  color: 'background.default',
                },
              }}
              component={RouterLink}
              href={`${paths.main.root}${applicationId}/${button.page_id}`}
              state={{
                data: {
                  id: task?._id.$oid,
                  collection: blockData.queries?.[0].collection_name,
                  query: queriesRequest,
                },
              }}
            >
              {button.text}
            </Button>
          ))}

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
