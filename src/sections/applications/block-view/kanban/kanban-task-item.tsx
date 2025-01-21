import { Draggable } from '@hello-pangea/dnd';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Paper, { PaperProps } from '@mui/material/Paper';
import { useBoolean } from 'src/hooks/use-boolean';
import { Document } from 'src/types/queries-interface';
import { Box } from '@mui/material';

// ----------------------------------------------------------------------

type Props = PaperProps & {
  index: string;
  document: Document;
  onUpdateTask: (updateTask: Document) => void;
  onDeleteTask: VoidFunction;
};

export default function KanbanTaskItem({
  document,
  index,
  onDeleteTask,
  onUpdateTask,
  sx,
  ...other
}: Props) {
  const openDetails = useBoolean();

  const statuses = [
    document.project_label_red && 'error.main',
    document.project_label_green && 'success.main',
    document.project_label_blue && 'info.main',
    document.project_label_yellow && 'warning.main',
  ].filter(Boolean);

  return (
    <>
      <Draggable draggableId={document._id.$oid} index={+index}>
        {(provided) => (
          <Paper
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onClick={openDetails.onTrue}
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

      {/* <KanbanDetails
        task={task}
        openDetails={openDetails.value}
        onCloseDetails={openDetails.onFalse}
        onUpdateTask={onUpdateTask}
        onDeleteTask={onDeleteTask}
      /> */}
    </>
  );
}
