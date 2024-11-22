import { Box, Button, Card, CardContent, CardMedia, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { RouterLink } from 'src/routes/components';
import { useParams } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import dispatchFetchedData from 'src/store/helpers/dispatchFetchedData';
import { FinalData } from 'src/types/components/item-list-interface';
import { Document, QueriesDispatch, QueryResult } from 'src/types/queries-interface';

interface Props {
  queries_dispatch: QueriesDispatch[];
  queriesValues: QueryResult[];
  blockData: any;
  current_document: Document;
}

export default function ItemDetails({
  queries_dispatch,
  queriesValues,
  blockData,
  current_document,
}: Props) {
  const { applicationId } = useParams();
  const [toLoadFinalData, setToLoadFinalData] = useState(true);
  const [finalData, setFinalData] = useState<FinalData | null>(null);

  useEffect(() => {
    if (toLoadFinalData && queries_dispatch?.length && queriesValues?.length) {
      const currentQueries = JSON.parse(JSON.stringify(queriesValues));
      currentQueries[0].documents = [current_document];

      const dispatchData = dispatchFetchedData({
        dataQueries: currentQueries,
        dispatchQueries: queries_dispatch,
        blockData,
      });

      setFinalData(dispatchData);
      setToLoadFinalData(false);
    }
  }, [blockData, current_document, queriesValues, queries_dispatch, toLoadFinalData]);

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 2,
      }}
    >
      <CardContent sx={{ padding: '0 0 8px 0' }}>
        {finalData?.image && (
          <Box sx={{ maxHeight: '100px', maxWidth: '100px', mb: 1 }}>
            <CardMedia
              component="img"
              src={finalData?.image?.original}
              alt={finalData?.image?.file_name}
              sx={{ height: '100%', objectFit: 'contain' }}
            />
          </Box>
        )}
        {finalData?.card_content.map(({ id, title, content }) => (
          <Typography key={id} variant="body2" sx={{ color: 'text.primary' }}>
            {`${title ? `${title}: ` : ''} ${content}`}
          </Typography>
        ))}
      </CardContent>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {finalData?.button_action.map((button: any) => (
          <Button
            key={button.id}
            fullWidth
            variant="contained"
            sx={{
              borderRadius: 0.5,
              '&:hover': {
                color: 'background.paper',
              },
            }}
            component={RouterLink}
            href={`${paths.main.root}${applicationId}/${button.page_id}`}
          >
            {button.text}
          </Button>
        ))}
      </Box>
    </Card>
  );
}
