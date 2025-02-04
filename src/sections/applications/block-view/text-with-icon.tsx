import { Box, Card, IconButton } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useDataLink } from 'src/hooks/use-data-link';
import dispatchFetchedData from 'src/store/helpers/dispatchFetchedData';
import { BlockInterface } from 'src/types/application/general-interface';
import { TextWithIconData } from 'src/types/application/text-with-icon-interface';
import { CustomFilter, DataQuery, QueryResult } from 'src/types/queries-interface';
import PageDataInCheck from '../helpers/pageDataInCheck';

interface Props {
  blockInfo: BlockInterface<TextWithIconData>;
  handleGetHandlers: (props: { additionalFilters?: CustomFilter[]; page?: number }) => Promise<{
    queriesRequest: DataQuery[];
    queriesResponse: QueryResult[];
  }>;
}

export default function TextWithIconView({ blockInfo, handleGetHandlers }: Props) {
  const { data } = blockInfo.blocs[0];
  const [finalData, setFinalData] = useState<TextWithIconData>({
    ...data,
  });
  const { data_link, data_link_ready } = useDataLink();

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

  useEffect(() => {
    if (data_link_ready) {
      setFinalData({
        title: PageDataInCheck(data.title, data_link),
        icon: data.icon,
        description: PageDataInCheck(data.description, data_link),
        queries: data.queries,
        queries_dispatch: data.queries_dispatch,
      });
    }
  }, [data, data_link, data_link_ready]);

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
