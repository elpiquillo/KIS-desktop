import React from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { alpha } from '@mui/material/styles';
import Iconify from 'src/components/iconify';
import { Document } from 'src/types/queries-interface';
import { Typography } from '@mui/material';
import { t } from 'i18next';
import KanbanTaskItem from './kanban-task-item';

interface Props {
  index: number;
  column: { id: string; title: string; tasks: Document[] };
  handleOpenEditModal: (task?: Document) => void;
}

export default function KanbanColumn({ index, column, handleOpenEditModal }: Props) {
  return (
    <Draggable draggableId={column.id} index={index}>
      {(provided, snapshot) => (
        <Paper
          ref={provided.innerRef}
          {...provided.draggableProps}
          sx={{
            px: 2,
            borderRadius: 2,
            bgcolor: 'background.neutral',
            ...(snapshot.isDragging && {
              bgcolor: (theme) => alpha(theme.palette.grey[500], 0.24),
            }),
          }}
        >
          <Stack {...provided.dragHandleProps}>
            <Stack sx={{ pt: 3 }}>
              <Typography variant="h6">{column.title}</Typography>
            </Stack>

            <Droppable droppableId={column.id} type="TASK">
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
                  {column.tasks.map((document) => (
                    <KanbanTaskItem
                      key={document._id.$oid}
                      index={document._id.$oid}
                      document={document}
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
                onClick={() => handleOpenEditModal()}
                sx={{ fontSize: 14 }}
              >
                {t('applications.kanban.addTask')}
              </Button>
            </Stack>
          </Stack>
        </Paper>
      )}
    </Draggable>
  );
}
