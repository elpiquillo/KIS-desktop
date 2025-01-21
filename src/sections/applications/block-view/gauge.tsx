import { Box, Button, Card, CardHeader, Typography } from '@mui/material';
import { Gauge, gaugeClasses } from '@mui/x-charts';
import React, { useCallback, useEffect, useState } from 'react';
import dispatchFetchedData from 'src/store/helpers/dispatchFetchedData';
import { success } from 'src/theme/palette';
import { GaugeData } from 'src/types/application/gauge-interface';
import { CustomFilter, DataQuery, QueryResult } from 'src/types/queries-interface';

interface Props {
  blockInfo: { blocs: GaugeData[] };
  handleGetHandlers: (props: { additionalFilters?: CustomFilter[]; page?: number }) => Promise<{
    queriesRequest: DataQuery[];
    queriesResponse: QueryResult[];
  }>;
}

export default function GaugeView({ blockInfo, handleGetHandlers }: Props) {
  const { data } = blockInfo.blocs[0];
  const [finalData, setFinalData] = useState<GaugeData['data']>({
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

  const percentage = !finalData.second_value
    ? finalData.first_value
    : ((finalData.first_value / finalData.second_value) * 100).toFixed(2);

  return (
    <Card>
      <CardHeader title={finalData.card_title} subheader={finalData.sub_title} />
      <Box
        sx={{
          mt: 1.5,
          padding: 2,
        }}
      >
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ minWidth: '10px', display: 'flex', alignItems: 'center' }}>
            <Typography variant="h4">{`${finalData.middle_text} ${finalData.devise}`}</Typography>
          </Box>
          <Box sx={{ width: '190px' }}>
            <Gauge
              width={190}
              height={100}
              value={Number(percentage)}
              startAngle={-90}
              endAngle={90}
              innerRadius={78}
              outerRadius={90}
              cornerRadius="50%"
              text={({ value }) => `${value}%`}
              sx={{
                [`& .${gaugeClasses.valueText}`]: {
                  fontSize: 20,
                  fontWeight: 700,
                },
                [`& .${gaugeClasses.valueArc}`]: {
                  fill: success.main,
                },
              }}
            />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
          {finalData.button_action.map((button) => (
            <Button
              key={button.id}
              disabled
              sx={{
                height: '38px',
                borderRadius: 0.5,
                '&.Mui-disabled': {
                  color: 'text.primary',
                  border: 1,
                  borderColor: 'action.hover',
                },
              }}
            >
              {button.text}
            </Button>
          ))}
        </Box>
        <Typography variant="body1" color="text.secondary">
          {finalData.bottom_text}
        </Typography>
      </Box>
    </Card>
  );
}
