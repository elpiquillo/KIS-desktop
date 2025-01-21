import { Container, Stack } from '@mui/material';
import React, { Children, useCallback, useEffect, useState } from 'react';
import EmptyContent from 'src/components/empty-content';
import Scrollbar from 'src/components/scrollbar';
import dispatchFetchedData from 'src/store/helpers/dispatchFetchedData';
import { CustomFilter, DataQuery, Document, QueryResult } from 'src/types/queries-interface';
import { Droppable, DropResult, DragDropContext } from '@hello-pangea/dnd';
import KanbanColumnSkeleton from 'src/components/kanban/kanban-column-skeleton';
import { KanbanData } from 'src/types/application/kanban-interface';
import KanbanColumn from './kanban-column';

interface Props {
  blockInfo: { blocs: KanbanData[] };
  handleGetHandlers: (props: { additionalFilters?: CustomFilter[]; page?: number }) => Promise<{
    queriesRequest: DataQuery[];
    queriesResponse: QueryResult[];
  }>;
}

export default function KanbanView({ blockInfo, handleGetHandlers }: Props) {
  const { data } = blockInfo.blocs[0];

  const [isLoadingDocuments, setIsLoadingDocuments] = useState<boolean>(false);
  const [finalData, setFinalData] = useState<KanbanData['data']>({ ...data });
  const [columnsWithDocuments, setColumnsWithDocuments] = useState<
    { id: string; title: string; documents: Document[] }[]
  >([]);
  const [taskInfoForModal, setTaskInfoForModal] = useState(null);
  const [queriesResponse, setQueriesResponse] = useState<QueryResult[]>([]);

  const handleGetDocuments = useCallback(async () => {
    setIsLoadingDocuments(true);
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
      return { ...column, documents: docs };
    });
    setColumnsWithDocuments(updatedColumns);
    setIsLoadingDocuments(false);
  }, [data.columns, data.queries_dispatch, handleGetHandlers]);

  useEffect(() => {
    handleGetDocuments();
  }, [handleGetDocuments]);

  const onDragEnd = useCallback(
    async ({ destination, source, draggableId, type }: DropResult) => {},
    []
  );

  return (
    <Container
      maxWidth={false}
      sx={{
        height: 1,
      }}
    >
      {isLoadingDocuments && (
        <Stack direction="row" alignItems="flex-start" spacing={3}>
          {Children.toArray(
            [...Array(4)].map((_, index) => <KanbanColumnSkeleton index={index} />)
          )}
        </Stack>
      )}

      {!isLoadingDocuments && !columnsWithDocuments.length && (
        <EmptyContent
          filled
          title="No Data"
          sx={{
            py: 10,
            maxHeight: { md: 480 },
          }}
        />
      )}

      {!!columnsWithDocuments.length && (
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
                  {columnsWithDocuments.map((column, index) => (
                    <KanbanColumn index={index} key={column.id} column={column} />
                  ))}

                  {provided.placeholder}
                </Stack>
              </Scrollbar>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </Container>
  );
}
