import { Box, Card, CardHeader, Typography } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import Scrollbar from 'src/components/scrollbar';
import dispatchFetchedData from 'src/store/helpers/dispatchFetchedData';
import { CustomFilter, DataQuery, QueryResult } from 'src/types/queries-interface';

interface Props {
  blockInfo: any;
  handleGetHandlers: (props: { additionalFilters?: CustomFilter[]; page?: number }) => {
    queriesRequest: DataQuery[];
    queriesResponse: QueryResult[];
  };
}

export default function KanbanView({ blockInfo, handleGetHandlers }: Props) {
  const { data } = blockInfo.blocs[0];

  const [finalData, setFinalData] = useState<any>({ ...data });
  const [documents, setDocuments] = useState<any[]>([]);
  const [taskInfoForModal, setTaskInfoForModal] = useState<any>({});
  const [queriesResponse, setQueriesResponse] = useState<QueryResult[]>([]);

  const handleGetDocuments = useCallback(async () => {
    const { queriesResponse: response } = (await handleGetHandlers({})) || {};

    setFinalData((prevFinalData: any) =>
      dispatchFetchedData({
        dataQueries: response,
        dispatchQueries: data.queries_dispatch,
        finalData: prevFinalData,
      })
    );
    setDocuments(response[0].documents);
    setQueriesResponse(response || []);
  }, [data.queries_dispatch, handleGetHandlers]);

  useEffect(() => {
    handleGetDocuments();
  }, [handleGetDocuments]);

  return (
    <Scrollbar>
      <Box
        sx={{
          display: 'flex',
          gap: 1.5,
          pb: 1,
        }}
      >
        {data.columns.map((column: any) => (
          <Card
            key={column.id}
            sx={{
              minWidth: '300px',
              padding: 1,
              backgroundColor: 'background.neutral',
              boxShadow: 'none',
            }}
          >
            <CardHeader
              sx={{ height: '40px', padding: '0 12px 4px 12px' }}
              title={<Typography variant="h6">{column.title}</Typography>}
            />
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                padding: 1,
              }}
            >
              {data.card_content.map((content: any) => (
                <Card
                  key={content.id}
                  sx={{
                    padding: 2,
                  }}
                >
                  <Typography variant="h6" sx={{ color: 'text.primary' }}>
                    {content.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.primary' }}>
                    {content.content}
                  </Typography>
                </Card>
              ))}
            </Box>
          </Card>
        ))}
      </Box>
    </Scrollbar>
  );
}
