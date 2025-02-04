import { Box, Button, Card, CardHeader, Typography, useTheme } from '@mui/material';
import { Gauge, gaugeClasses } from '@mui/x-charts';
import React, { useCallback, useEffect, useState } from 'react';
import { useDataLink } from 'src/hooks/use-data-link';
import dispatchFetchedData from 'src/store/helpers/dispatchFetchedData';
import { GaugeData } from 'src/types/application/gauge-interface';
import { BlockInterface } from 'src/types/application/general-interface';
import { CustomFilter, DataQuery, QueryResult } from 'src/types/queries-interface';
import PageDataInCheck from '../helpers/pageDataInCheck';

interface Props {
  blockInfo: BlockInterface<GaugeData>;
  handleGetHandlers: (props: { additionalFilters?: CustomFilter[]; page?: number }) => Promise<{
    queriesRequest: DataQuery[];
    queriesResponse: QueryResult[];
  }>;
}

export default function GaugeView({ blockInfo, handleGetHandlers }: Props) {
  const theme = useTheme();
  const { data } = blockInfo.blocs[0];
  const [finalData, setFinalData] = useState<GaugeData>({
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
        middle_text: PageDataInCheck(data.middle_text, data_link),
        devise: PageDataInCheck(data.devise, data_link),
        bottom_text: PageDataInCheck(data.bottom_text, data_link),
        graph_label: PageDataInCheck(data.graph_label, data_link),
      });
    }
  }, [data, data_link, data_link_ready]);

  const gaugeColor = (percent: number) => {
    if (percent < 75) {
      return theme.palette.error.main;
    }
    if (percent < 90) {
      return theme.palette.warning.main;
    }
    return theme.palette.success.main;
  };

  const percentage =
    !finalData.first_value || !finalData.second_value
      ? +finalData.force_percent || 0
      : +((finalData.first_value / finalData.second_value) * 100).toFixed(2);

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
              value={percentage}
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
                  fill: gaugeColor(percentage),
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
