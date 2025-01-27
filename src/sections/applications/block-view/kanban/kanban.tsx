import { Container, Stack } from '@mui/material';
import React, { Children, useCallback, useEffect, useState } from 'react';
import EmptyContent from 'src/components/empty-content';
import Scrollbar from 'src/components/scrollbar';
import dispatchFetchedData from 'src/store/helpers/dispatchFetchedData';
import { CustomFilter, DataQuery, Document, QueryResult } from 'src/types/queries-interface';
import { DropResult, DragDropContext } from '@hello-pangea/dnd';
import KanbanColumnSkeleton from 'src/components/kanban/kanban-column-skeleton';
import { KanbanData } from 'src/types/application/kanban-interface';
import { useBoolean } from 'src/hooks/use-boolean';
import { useCreateDataHandlers, usePatchDataHandlers } from 'src/apis/data-handler';
import { useParams } from 'src/routes/hooks';
import KanbanColumn from './kanban-column';
import { AddTaskModal, EditTaskModal } from './modal';
import getDataFromQueries from '../../helpers/getDataFromQueries';

interface Props {
  blockInfo: { blocs: KanbanData[] };
  handleGetHandlers: (props: { additionalFilters?: CustomFilter[]; page?: number }) => Promise<{
    queriesRequest: DataQuery[];
    queriesResponse: QueryResult[];
  }>;
}

export default function KanbanView({ blockInfo, handleGetHandlers }: Props) {
  const { data } = blockInfo.blocs[0];
  const { pageId } = useParams();

  const [isLoadingTasks, setIsLoadingTasks] = useState<boolean>(false);
  const [finalData, setFinalData] = useState<KanbanData['data']>({ ...data });
  const [columnsWithTasks, setColumnsWithTasks] = useState<
    { id: number; title: string; tasks: Document[] }[]
  >([]);
  const [queriesRequest, setQueriesRequest] = useState<DataQuery[]>([]);
  const [queriesResponse, setQueriesResponse] = useState<QueryResult[]>([]);

  const [taskInfoForEditModal, setTaskInfoForEditModal] = useState<Document | null>(null);
  const [projectStatusForAddTask, setProjectStatusForAddTask] = useState<string>('');
  const openAddTaskModal = useBoolean();
  const openEditTaskModal = useBoolean();

  const { createDataHandlers } = useCreateDataHandlers(data.queries?.[0]);
  const { patchDataHandlers } = usePatchDataHandlers();

  const handleGetDocuments = useCallback(async () => {
    setIsLoadingTasks(true);
    const { queriesRequest: request, queriesResponse: response } =
      (await handleGetHandlers({})) || {};

    setFinalData((prevFinalData) =>
      dispatchFetchedData({
        dataQueries: response,
        dispatchQueries: data.queries_dispatch,
        finalData: prevFinalData,
      })
    );
    setQueriesRequest(request || []);
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

  const handleAddTask = useCallback(
    async (newTask: Document) => {
      const res = await createDataHandlers({
        pageId: pageId || '?',
        documents: [newTask],
      });

      setQueriesResponse((prevQueriesResponse) => {
        const newDocuments = [...prevQueriesResponse[0].documents, ...res.created];

        const updatedColumns = data.columns.map((column) => {
          const docs: Document[] = newDocuments.filter(
            (doc) => doc.project_status === column.title
          );
          return { ...column, tasks: docs };
        });
        setColumnsWithTasks(updatedColumns);

        return [{ ...prevQueriesResponse[0], documents: newDocuments }];
      });
    },
    [createDataHandlers, data.columns, pageId]
  );

  const handleSaveUpdatedTasks = useCallback(
    async (dataForUpdate: Document[]) => {
      const collectionName = getDataFromQueries({
        queries: data.queries,
        queries_dispatch: data.queries_dispatch,
        field: 'card_origin',
        type: 'collection_name',
      });

      const res = await patchDataHandlers({
        pageId: pageId || '1',
        collectionName,
        documents: dataForUpdate,
      });
      const { updated: updatedDocuments } = res;
      const updatedDocumentsIds = updatedDocuments.map((doc: Document) => doc._id.$oid);

      setQueriesResponse((prevQueriesResponse) => {
        const oldDocuments = prevQueriesResponse[0].documents.filter(
          (doc) => !updatedDocumentsIds.includes(doc._id.$oid)
        );
        const newDocuments = [...oldDocuments, ...updatedDocuments];

        const updatedColumns = data.columns.map((column) => {
          const docs: Document[] = newDocuments.filter(
            (doc) => doc.project_status === column.title
          );
          return { ...column, tasks: docs };
        });
        setColumnsWithTasks(updatedColumns);

        return [{ ...prevQueriesResponse[0], documents: newDocuments }];
      });
    },
    [data.columns, data.queries, data.queries_dispatch, pageId, patchDataHandlers]
  );

  const onDragEnd = useCallback(
    async ({ destination, source }: DropResult) => {
      if (
        !destination ||
        (source.droppableId === destination.droppableId && source.index === destination.index)
      )
        return;

      const copiedColumnsWithTasks = JSON.parse(
        JSON.stringify(columnsWithTasks)
      ) as typeof columnsWithTasks;
      const columnForChanging = columnsWithTasks.find(
        (col) => col.id.toString() === destination.droppableId
      );

      if (source.droppableId !== destination.droppableId) {
        const copyTask = copiedColumnsWithTasks.find(
          (col) => col.id.toString() === source.droppableId
        )?.tasks[source.index];
        if (copyTask) {
          copyTask.project_status = columnForChanging?.title;
          columnForChanging?.tasks.splice(destination.index, 0, copyTask);
        }
      } else {
        const copyTask = columnForChanging?.tasks[source.index];
        columnForChanging?.tasks.splice(source.index, 1);
        if (copyTask) {
          columnForChanging?.tasks.splice(destination.index, 0, copyTask);
        }
      }

      handleSaveUpdatedTasks([...(columnForChanging?.tasks || [])]);
    },
    [columnsWithTasks, handleSaveUpdatedTasks]
  );

  const handleOpenAddTaskModal = (projectStatus: string) => {
    openAddTaskModal.onTrue();
    setProjectStatusForAddTask(projectStatus);
  };

  const handleCloseAddTaskModal = () => {
    openAddTaskModal.onFalse();
    setProjectStatusForAddTask('');
  };

  const handleOpenEditTaskModal = (taskData?: Document) => {
    openEditTaskModal.onTrue();
    if (taskData) {
      setTaskInfoForEditModal(taskData);
    }
  };

  const handleCloseEditTaskModal = () => {
    openEditTaskModal.onFalse();
    setTaskInfoForEditModal(null);
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
              spacing={3}
              direction="row"
              alignItems="flex-start"
              sx={{
                p: 0.25,
                height: 1,
              }}
            >
              {columnsWithTasks.map((column) => (
                <KanbanColumn
                  key={column.id}
                  column={column}
                  previewField={getDataFromQueries({
                    queries: data.queries,
                    queries_dispatch: data.queries_dispatch,
                    field: 'preview_text',
                    type: 'collection_field',
                  })}
                  handleOpenAddModal={() => handleOpenAddTaskModal(column.title)}
                  handleOpenEditModal={handleOpenEditTaskModal}
                />
              ))}
            </Stack>
          </Scrollbar>
        </DragDropContext>
      )}

      <AddTaskModal
        open={openAddTaskModal.value}
        projectStatus={projectStatusForAddTask}
        handleAddTask={handleAddTask}
        handleClose={handleCloseAddTaskModal}
      />

      <EditTaskModal
        queriesRequest={queriesRequest}
        blockData={finalData}
        open={openEditTaskModal.value}
        task={taskInfoForEditModal}
        handleSaveUpdatedTasks={handleSaveUpdatedTasks}
        handleClose={handleCloseEditTaskModal}
      />
    </Container>
  );
}
