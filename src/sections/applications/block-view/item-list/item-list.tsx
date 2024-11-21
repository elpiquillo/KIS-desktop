import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { ApiDataHandlerResponse, QueryResult } from 'src/types/queries-interface';
import ItemDetails from './item-details';

interface Props {
  blockInfo: any;
  handleGetHandlers: (additionalFilters?: any[]) => ApiDataHandlerResponse;
}

export default function ItemListView({ blockInfo, handleGetHandlers }: Props) {
  const [queries, setQueries] = useState<QueryResult[]>([]);
  const { data } = blockInfo.blocs[0];

  const handleGetDocuments = async () => {
    const res = await handleGetHandlers();
    setQueries(res?.queries || []);
  };

  useEffect(() => {
    handleGetDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box
      sx={{
        width: '100%',
        display: 'grid',
        gridTemplateColumns: `repeat(${data.card_content.length}, 1fr)`,
        gap: 2,
      }}
    >
      {blockInfo.blocs[0] &&
        queries[0]?.documents.map((document: any) => (
          <ItemDetails
            key={document._id.$oid}
            queries_dispatch={blockInfo.blocs[0].data.queries_dispatch}
            queriesValues={queries}
            current_document={document}
            blockData={blockInfo.blocs[0].data}
          />
        ))}
    </Box>
  );
}
