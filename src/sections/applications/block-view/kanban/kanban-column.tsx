import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Iconify from 'src/components/iconify';
import { Document } from 'src/types/queries-interface';
import { Typography } from '@mui/material';
import { t } from 'i18next';
import KanbanTaskItem from './kanban-task-item';

interface Props {
  column: { id: number; title: string; tasks: Document[] };
  handleOpenAddModal: () => void;
  handleOpenEditModal: (task?: Document) => void;
}

export default function KanbanColumn({ column, handleOpenAddModal, handleOpenEditModal }: Props) {
  return (
    <Paper
      sx={{
        px: 2,
        borderRadius: 2,
        bgcolor: 'background.neutral',
      }}
    >
      <Stack>
        <Stack sx={{ pt: 3 }}>
          <Typography variant="h6">{column.title}</Typography>
        </Stack>

        <Droppable droppableId={column.id.toString()} type="TASK">
          {(dropProvided) => (
            <Stack
              ref={dropProvided.innerRef}
              {...dropProvided.droppableProps}
              spacing={2}
              sx={{
                py: 3,
                width: 280,
              }}
            >
              {column.tasks.map((task, taskIndex) => (
                <KanbanTaskItem
                  key={task._id.$oid}
                  index={taskIndex}
                  task={task}
                  onUpdateTask={handleOpenEditModal}
                />
              ))}
              {dropProvided.placeholder}
            </Stack>
          )}
        </Droppable>

        <Stack
          spacing={2}
          sx={{
            pb: 3,
          }}
        >
          <Button
            fullWidth
            size="large"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" width={18} sx={{ mr: -0.5 }} />}
            onClick={() => handleOpenAddModal()}
            sx={{ fontSize: 14 }}
          >
            {t('applications.kanban.addTask')}
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
