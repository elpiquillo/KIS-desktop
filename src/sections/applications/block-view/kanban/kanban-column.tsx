import { useCallback } from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { alpha } from '@mui/material/styles';
import { useBoolean } from 'src/hooks/use-boolean';
import Iconify from 'src/components/iconify';
import { Typography } from '@mui/material';
import KanbanTaskItem from './kanban-task-item';

// ----------------------------------------------------------------------

interface Props {
  column: any;
  index: number;
}

export default function KanbanColumn({ column, index }: Props) {
  const openAddTask = useBoolean();

  const handleAddTask = useCallback(async (taskData: any) => {}, []);
  const handleUpdateTask = useCallback(async (taskData: any) => {}, []);
  const handleDeleteTask = useCallback(async (taskId: string) => {}, []);

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
                  {column.documents.map((document: any) => (
                    <KanbanTaskItem
                      key={document._id.$oid}
                      index={document._id.$oid}
                      document={document}
                      onUpdateTask={handleUpdateTask}
                      onDeleteTask={() => handleDeleteTask(document._id.$oid)}
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
                startIcon={
                  <Iconify
                    icon={openAddTask.value ? 'solar:close-circle-broken' : 'mingcute:add-line'}
                    width={18}
                    sx={{ mr: -0.5 }}
                  />
                }
                onClick={openAddTask.onToggle}
                sx={{ fontSize: 14 }}
              >
                {openAddTask.value ? 'Close' : 'Add Task'}
              </Button>
            </Stack>
          </Stack>

          {/* {openAddTask.value && (
                <KanbanTaskAdd
                  status={column.name}
                  onAddTask={handleAddTask}
                  onCloseAddTask={openAddTask.onFalse}
                />
              )} */}
        </Paper>
      )}
    </Draggable>
  );
}
