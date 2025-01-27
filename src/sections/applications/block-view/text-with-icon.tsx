import { Box, Card, IconButton } from '@mui/material';
import { TextWithIconData } from 'src/types/application/text-with-icon-interface';
import { useCallback, useEffect, useState } from 'react';
import { CustomFilter, DataQuery, QueryResult } from 'src/types/queries-interface';
import dispatchFetchedData from 'src/store/helpers/dispatchFetchedData';

interface Props {
  blockInfo: { blocs: TextWithIconData[] };
  handleGetHandlers: (props: { additionalFilters?: CustomFilter[]; page?: number }) => Promise<{
    queriesRequest: DataQuery[];
    queriesResponse: QueryResult[];
  }>;
}

export default function TextWithIconView({ blockInfo, handleGetHandlers }: Props) {
  const { data } = blockInfo.blocs[0];
  const [finalData, setFinalData] = useState<TextWithIconData['data']>({
    ...data,
  });

  const handleGetFinalData = useCallback(async () => {
    const { queriesResponse: response } = (await handleGetHandlers({})) || {};

    setFinalData((prevFinalData) =>
      dispatchFetchedData({
        dataQueries: response,
        dispatchQueries: data.queries_dispatch,
        finalData: prevFinalData,
      })
    );
  }, [data.queries_dispatch, handleGetHandlers]);

  useEffect(() => {
    handleGetFinalData();
  }, [handleGetFinalData]);

  return (
    <Card
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: 3,
        // boxShadow: 2,
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Box sx={{ typography: 'subtitle2' }}>{finalData.title}</Box>
        <Box sx={{ mt: 1.5, mb: 1, typography: 'h4' }}>{finalData.description}</Box>
      </Box>
      <IconButton
        disableRipple
        sx={{
          backgroundColor: 'grey.200',
          borderRadius: '50%',
          background: (theme) => theme.palette.primary.dark,
          '&:hover': {
            cursor: 'auto',
          },
          '&:focus': {
            outline: 'none',
          },
        }}
      >
        <i className={finalData.icon} style={{ fontSize: 24, padding: 3, color: 'white' }}>
          <span className="path1" />
          <span className="path2" />
        </i>
      </IconButton>
    </Card>
  );
}
