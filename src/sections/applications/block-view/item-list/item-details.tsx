import { Box, Button, Card, CardContent, CardMedia, Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { RouterLink } from 'src/routes/components';
import { useParams } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import dispatchFetchedData from 'src/store/helpers/dispatchFetchedData';
import { ItemListData, ItemListFinalData } from 'src/types/application/item-list-interface';
import { DataQuery, Document, QueriesDispatch, QueryResult } from 'src/types/queries-interface';

interface Props {
  queriesDispatch: QueriesDispatch[];
  queriesRequest: DataQuery[];
  queriesResponse: QueryResult[];
  blockData: ItemListData['data'];
  current_document: Document;
}

export default function ItemDetails({
  queriesDispatch,
  queriesRequest,
  queriesResponse,
  blockData,
  current_document,
}: Props) {
  const { applicationId } = useParams();
  const [toLoadFinalData, setToLoadFinalData] = useState(true);
  const [finalData, setFinalData] = useState<ItemListFinalData>(blockData);

  useEffect(() => {
    if (toLoadFinalData && queriesDispatch?.length && queriesResponse?.length) {
      const currentQueries = JSON.parse(JSON.stringify(queriesResponse));
      currentQueries[0].documents = [current_document];

      const dispatchData = dispatchFetchedData({
        dataQueries: currentQueries,
        dispatchQueries: queriesDispatch,
        finalData,
      });

      setFinalData(dispatchData);
      setToLoadFinalData(false);
    }
  }, [current_document, queriesResponse, queriesDispatch, toLoadFinalData, finalData]);

  return (
    <Grid item xs={12} md={6} lg={4} xl={3}>
      <Card
        sx={{
          height: '100%',
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
          {finalData?.button_action.map((button) => (
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
              state={{
                data: {
                  id: current_document._id.$oid,
                  collection: blockData.queries?.[0].collection_name,
                  query: queriesRequest,
                },
              }}
            >
              {button.text}
            </Button>
          ))}
        </Box>
      </Card>
    </Grid>
  );
}
