import { Container, Stack } from '@mui/material';
import React, { Children, useCallback, useEffect, useState } from 'react';
import EmptyContent from 'src/components/empty-content';
import Scrollbar from 'src/components/scrollbar';
import dispatchFetchedData from 'src/store/helpers/dispatchFetchedData';
import { CustomFilter, DataQuery, Document, QueryResult } from 'src/types/queries-interface';
import { Droppable, DropResult, DragDropContext } from '@hello-pangea/dnd';
import KanbanColumnSkeleton from 'src/components/kanban/kanban-column-skeleton';
import { KanbanData } from 'src/types/application/kanban-interface';
import { useBoolean } from 'src/hooks/use-boolean';
import KanbanColumn from './kanban-column';
import TaskModal from './modal';

interface Props {
  blockInfo: { blocs: KanbanData[] };
  handleGetHandlers: (props: { additionalFilters?: CustomFilter[]; page?: number }) => Promise<{
    queriesRequest: DataQuery[];
    queriesResponse: QueryResult[];
  }>;
}

export default function KanbanView({ blockInfo, handleGetHandlers }: Props) {
  const { data } = blockInfo.blocs[0];

  const [isLoadingTasks, setIsLoadingTasks] = useState<boolean>(false);
  const [finalData, setFinalData] = useState<KanbanData['data']>({ ...data });
  const [columnsWithTasks, setColumnsWithTasks] = useState<
    { id: string; title: string; tasks: Document[] }[]
  >([]);
  const [queriesResponse, setQueriesResponse] = useState<QueryResult[]>([]);

  const [taskInfoForModal, setTaskInfoForModal] = useState<Document | null>(null);
  const openTaskModal = useBoolean();

  const handleGetDocuments = useCallback(async () => {
    setIsLoadingTasks(true);
    const { queriesResponse: response } = (await handleGetHandlers({})) || {};

    setFinalData((prevFinalData) =>
      dispatchFetchedData({
        dataQueries: response,
        dispatchQueries: data.queries_dispatch,
        finalData: prevFinalData,
      })
    );
    setQueriesResponse(response || []);

    const updatedColumns = data.columns.map((column) => {
      const docs: Document[] = response[0].documents.filter(
        (doc) => doc.project_status === column.title
      );
      return { ...column, tasks: docs };
    });
    setColumnsWithTasks(updatedColumns);
    setIsLoadingTasks(false);
  }, [data.columns, data.queries_dispatch, handleGetHandlers]);

  useEffect(() => {
    handleGetDocuments();
  }, [handleGetDocuments]);

  const onDragEnd = useCallback(
    async ({ destination, source, draggableId, type }: DropResult) => {},
    []
  );

  const handleOpenTaskModal = (taskData?: Document) => {
    openTaskModal.onTrue();
    if (taskData) {
      setTaskInfoForModal(taskData);
    }
  };

  const handleCloseTaskModal = () => {
    openTaskModal.onFalse();
    setTaskInfoForModal(null);
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        height: 1,
      }}
    >
      {isLoadingTasks && (
        <Stack direction="row" alignItems="flex-start" spacing={3}>
          {Children.toArray(
            [...Array(4)].map((_, index) => <KanbanColumnSkeleton index={index} />)
          )}
        </Stack>
      )}

      {!isLoadingTasks && !columnsWithTasks.length && (
        <EmptyContent
          filled
          title="No Data"
          sx={{
            py: 10,
            maxHeight: { md: 480 },
          }}
        />
      )}

      {!!columnsWithTasks.length && (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="board" type="COLUMN" direction="horizontal">
            {(provided) => (
              <Scrollbar
                sx={{
                  height: 1,
                  minHeight: {
                    xs: '80vh',
                    md: 'unset',
                  },
                }}
              >
                <Stack
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  spacing={3}
                  direction="row"
                  alignItems="flex-start"
                  sx={{
                    p: 0.25,
                    height: 1,
                  }}
                >
                  {columnsWithTasks.map((column, index) => (
                    <KanbanColumn
                      index={index}
                      key={column.id}
                      column={column}
                      handleOpenEditModal={handleOpenTaskModal}
                    />
                  ))}

                  {provided.placeholder}
                </Stack>
              </Scrollbar>
            )}
          </Droppable>
        </DragDropContext>
      )}

      <TaskModal
        open={openTaskModal.value}
        task={taskInfoForModal}
        handleClose={handleCloseTaskModal}
      />
    </Container>
  );
}
