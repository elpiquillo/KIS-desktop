import React, { useCallback, useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import { DataQuery, QueryResult } from 'src/types/queries-interface';
import ItemDetails from './item-details';

interface Props {
  blockInfo: any;
  handleGetHandlers: (props: { additionalFilters?: any[]; page?: number }) => {
    queriesRequest: DataQuery[];
    queriesResponse: QueryResult[];
  };
}

export default function ItemListView({ blockInfo, handleGetHandlers }: Props) {
  const { data } = blockInfo.blocs[0];

  const [queriesRequest, setQueriesRequest] = useState<DataQuery[]>([]);
  const [queriesResponse, setQueriesResponse] = useState<QueryResult[]>([]);

  const handleGetDocuments = useCallback(async () => {
    const { queriesRequest: request, queriesResponse: response } =
      (await handleGetHandlers({})) || {};
    setQueriesRequest(request || []);
    setQueriesResponse(response || []);
  }, [handleGetHandlers]);

  useEffect(() => {
    handleGetDocuments();
  }, [handleGetDocuments]);

  return (
    <Grid container spacing={2}>
      {data &&
        queriesResponse[0]?.documents.map((document: any) => (
          <ItemDetails
            queriesDispatch={data.queries_dispatch}
            queriesRequest={queriesRequest}
            queriesResponse={queriesResponse}
            current_document={document}
            blockData={data}
          />
        ))}
    </Grid>
  );
}
