import { Card, CardHeader, Typography } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Chart, { useChart } from 'src/components/chart';
import { ChartLegends } from 'src/components/chart/chartLegend';
import { useDataLink } from 'src/hooks/use-data-link';
import dispatchFetchedData from 'src/store/helpers/dispatchFetchedData';
import { BlockInterface } from 'src/types/application/general-interface';
import { GenericChartData } from 'src/types/application/generic-chart-interface';
import { CustomFilter, DataQuery, QueryResult } from 'src/types/queries-interface';
import PageDataInCheck from '../../helpers/pageDataInCheck';
import { ComponentType } from '../constants';
import { donutChartOptions, pieChartOptions, radialBarChartOptions } from './chartOptions';

interface Props {
  blockInfo: BlockInterface<GenericChartData>;
  handleGetHandlers: (props: { additionalFilters?: CustomFilter[]; page?: number }) => Promise<{
    queriesRequest: DataQuery[];
    queriesResponse: QueryResult[];
  }>;
}

export function GenericChartView({ blockInfo, handleGetHandlers }: Props) {
  const { data, bloc_id: blocIdInfo } = blockInfo.blocs[0];
  const { data_link, data_link_ready } = useDataLink();

  const [key, setKey] = useState(0);
  const [finalData, setFinalData] = useState<GenericChartData>({
    ...data,
  });

  const total = useMemo(
    () => finalData.series?.reduce((acc: number, cur) => acc + cur.value, 0),
    [finalData.series]
  );
  const chartCategories = useMemo(
    () => finalData.series?.map((item) => `${item.label} (${item.value})`),
    [finalData.series]
  );
  const chartColors = useMemo(
    () => finalData.series?.map((item) => item.color),
    [finalData.series]
  );
  const chartSeries = finalData.series?.map((item) => item.value);

  const chartOptionsByComponentType = useMemo(() => {
    let partialOptions = {
      labels: chartCategories,
      colors: chartColors,
    };
    if (blocIdInfo === ComponentType.PIE) {
      partialOptions = {
        ...partialOptions,
        ...pieChartOptions,
      };
    } else if (blocIdInfo === ComponentType.DONUT) {
      partialOptions = {
        ...partialOptions,
        ...donutChartOptions,
      };
    } else if (blocIdInfo === ComponentType.RB) {
      partialOptions = {
        ...partialOptions,
        ...radialBarChartOptions({
          chartColors,
          total: total.toString(),
        }),
      };
    }
    return partialOptions;
  }, [blocIdInfo, chartCategories, chartColors, total]);

  const chartOptions = useChart(chartOptionsByComponentType);

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
      {chartOptions && (
        <Chart
          key={key}
          type={blocIdInfo === ComponentType.RB ? 'radialBar' : (blocIdInfo.toLowerCase() as any)}
          series={chartSeries}
          options={chartOptions}
          width={240}
          height={240}
          sx={{
            my: 3,
            mx: 'auto',
          }}
        />
      )}
      <ChartLegends
        colors={chartColors}
        labels={chartOptions?.labels}
        sx={{ p: 3, justifyContent: 'center' }}
      />
    </Card>
  );
}
