import React, { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import { DataQuery, QueryResult } from 'src/types/queries-interface';
import ItemDetails from './item-details';

interface Props {
  blockInfo: any;
  handleGetHandlers: (additionalFilters?: any[]) => {
    queriesRequest: DataQuery[];
    queriesResponse: QueryResult[];
  } | null;
}

export default function ItemListView({ blockInfo, handleGetHandlers }: Props) {
  const [queriesRequest, setQueriesRequest] = useState<DataQuery[]>([]);
  const [queriesResponse, setQueriesResponse] = useState<QueryResult[]>([]);
  const { data } = blockInfo.blocs[0];

  const handleGetDocuments = async () => {
    const { queriesRequest: request, queriesResponse: response } =
      (await handleGetHandlers()) || {};
    setQueriesRequest(request || []);
    setQueriesResponse(response || []);
  };

  useEffect(() => {
    handleGetDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
