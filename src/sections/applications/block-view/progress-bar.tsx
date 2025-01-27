import { Box, Card, CardContent, CardHeader, LinearProgress, Typography } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useDataLink } from 'src/hooks/use-data-link';
import dispatchFetchedData from 'src/store/helpers/dispatchFetchedData';
import { ProgressBarData } from 'src/types/application/progress-bar-interface';
import { CustomFilter, DataQuery, QueryResult } from 'src/types/queries-interface';
import PageDataInCheck from '../helpers/pageDataInCheck';

interface Props {
  blockInfo: { blocs: ProgressBarData[] };
  handleGetHandlers: (props: { additionalFilters?: CustomFilter[]; page?: number }) => Promise<{
    queriesRequest: DataQuery[];
    queriesResponse: QueryResult[];
  }>;
}

export default function ProgressBarView({ blockInfo, handleGetHandlers }: Props) {
  const { data } = blockInfo.blocs[0];
  const [finalData, setFinalData] = useState<ProgressBarData['data']>({
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
        ...data,
        card_title: PageDataInCheck(data.card_title, data_link),
        sub_title: PageDataInCheck(data.sub_title, data_link),
        force_percent: PageDataInCheck(data.force_percent, data_link),
        devise: PageDataInCheck(data.devise, data_link),
      });
    }
  }, [data, data_link, data_link_ready]);

  const progressColor = (percent: number) => {
    if (percent < 75) {
      return 'error';
    }
    if (percent < 90) {
      return 'warning';
    }
    return 'success';
  };

  const percentageByData = finalData.force_percent
    ? +finalData.force_percent
    : +((finalData.first_value / finalData.second_value) * 100).toFixed(2);

  const showPercentage = Number.isNaN(percentageByData) ? 100 : percentageByData;

  return (
    <Card>
      <CardHeader title={finalData.card_title} subheader={finalData.sub_title} />
      <CardContent>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress
            sx={{ height: 8 }}
            color={progressColor(showPercentage)}
            variant="determinate"
            value={showPercentage > 100 ? 100 : showPercentage}
          />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography
            variant="body2"
            sx={{ color: 'text.secondary' }}
          >{`${showPercentage}%`}</Typography>
        </Box>

        <Typography variant="body1" mt={2}>
          {`${finalData.first_value || 0}${finalData.devise} / ${finalData.second_value || 0}${finalData.devise}`}
        </Typography>
      </CardContent>
    </Card>
  );
}
