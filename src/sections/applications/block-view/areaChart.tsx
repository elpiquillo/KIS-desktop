import { Card, CardHeader, Typography } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Chart, { useChart } from 'src/components/chart';
import { ChartLegends } from 'src/components/chart/chartLegend';
import { useDataLink } from 'src/hooks/use-data-link';
import dispatchFetchedData from 'src/store/helpers/dispatchFetchedData';
import { AreaChartData } from 'src/types/application/area-chart-interface';
import { BlockInterface } from 'src/types/application/general-interface';
import { CustomFilter, DataQuery, QueryResult } from 'src/types/queries-interface';
import PageDataInCheck from '../helpers/pageDataInCheck';

interface Props {
  blockInfo: BlockInterface<AreaChartData>;
  handleGetHandlers: (props: { additionalFilters?: CustomFilter[]; page?: number }) => Promise<{
    queriesRequest: DataQuery[];
    queriesResponse: QueryResult[];
  }>;
}

export default function AreaChartView({ blockInfo, handleGetHandlers }: Props) {
  const { data } = blockInfo.blocs[0];
  const { data_link, data_link_ready } = useDataLink();

  const [key, setKey] = useState(0);
  const [finalData, setFinalData] = useState<AreaChartData>({
    ...data,
  });

  const chartColors = useMemo(
    () => finalData.series[0].data.map((item) => item.color),
    [finalData.series]
  );
  const chartLabels = finalData.series[0].data.map((item) => item.label);

  const areaChartOptions = useChart({
    legend: {
      show: false,
    },
    colors: chartColors,
    xaxis: { categories: finalData.categories },
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

  useEffect(() => {
    if (data_link_ready) {
      setFinalData({
        ...data,
        card_title: PageDataInCheck(data.card_title, data_link),
        sub_title: PageDataInCheck(data.sub_title, data_link),
      });
    }
  }, [data, data_link, data_link_ready]);

  useEffect(() => {
    setKey((prev) => prev + 1);
  }, [chartColors]);

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column' }}>
      <CardHeader title={finalData.card_title} />
      <Typography sx={{ ml: 3 }} variant="body1" color="text.secondary">
        {finalData.sub_title}
      </Typography>
      <Chart
        key={key}
        type="area"
        series={finalData?.series[0].data}
        options={areaChartOptions}
        width="100%"
        height="100%"
      />
      <ChartLegends
        key={`chart-legend-${key}`}
        colors={chartColors}
        labels={chartLabels}
        sx={{ p: 3, justifyContent: 'center' }}
      />
    </Card>
  );
}
