import { Draggable } from '@hello-pangea/dnd';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Paper, { PaperProps } from '@mui/material/Paper';
import { Document } from 'src/types/queries-interface';
import { Box } from '@mui/material';

// ----------------------------------------------------------------------

type Props = PaperProps & {
  index: string;
  document: Document;
  onUpdateTask: (updateTask: Document) => void;
};

export default function KanbanTaskItem({ document, index, onUpdateTask, sx, ...other }: Props) {
  const statuses = [
    document.project_label_red && 'error.main',
    document.project_label_green && 'success.main',
    document.project_label_blue && 'info.main',
    document.project_label_yellow && 'warning.main',
  ].filter(Boolean);

  const handleClickTask = () => {
    onUpdateTask(document);
  };

  return (
    <Draggable draggableId={document._id.$oid} index={+index}>
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
            <Typography variant="subtitle2">{document.client}</Typography>

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
