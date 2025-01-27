import { Draggable } from '@hello-pangea/dnd';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Paper, { PaperProps } from '@mui/material/Paper';
import { Document } from 'src/types/queries-interface';
import { Box } from '@mui/material';

// ----------------------------------------------------------------------

type Props = PaperProps & {
  index: number;
  task: Document;
  previewField: string;
  onUpdateTask: (updateTask: Document) => void;
};

export default function KanbanTaskItem({
  index,
  task,
  previewField,
  onUpdateTask,
  sx,
  ...other
}: Props) {
  const statuses = [
    task.project_label_red && 'error.main',
    task.project_label_green && 'success.main',
    task.project_label_blue && 'info.main',
    task.project_label_yellow && 'warning.main',
  ].filter(Boolean);

  const handleClickTask = () => {
    onUpdateTask(task);
  };

  return (
    <Draggable draggableId={task._id.$oid} index={index}>
      {(provided) => (
        <Paper
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={handleClickTask}
          sx={{
            width: 1,
            borderRadius: 1.5,
            overflow: 'hidden',
            position: 'relative',
            '&:hover': {
              cursor: 'grab',
            },
            ...sx,
          }}
          {...other}
        >
          <Stack
            spacing={2}
            flexDirection="row"
            justifyContent="space-between"
            sx={{
              px: 2,
              py: 2.5,
            }}
          >
            <Typography variant="subtitle2">{task[previewField]}</Typography>

            <Box sx={{ display: 'flex', gap: 1 }}>
              {statuses.map((status) => (
                <Box
                  sx={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: status,
                    borderRadius: '50%',
                  }}
                />
              ))}
            </Box>
          </Stack>
        </Paper>
      )}
    </Draggable>
  );
}
