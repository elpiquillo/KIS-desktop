import { alpha } from '@mui/material';
import { t } from 'i18next';
import { grey } from 'src/theme/palette';
import { typography } from 'src/theme/typography';

export const pieChartOptions = {
  legend: {
    show: false,
  },
  chart: { sparkline: { enabled: true } },
  stroke: { width: 0 },
  plotOptions: { pie: { donut: { labels: { show: false } } } },
};

export const donutChartOptions = {
  legend: {
    show: false,
  },
  chart: { sparkline: { enabled: true } },
  stroke: { width: 0 },
  plotOptions: { pie: { donut: { size: '72%' } } },
};

export const radialBarChartOptions = ({
  chartColors,
  total,
}: {
  chartColors: string[];
  total: string;
}) => ({
  legend: {
    show: false,
  },
  chart: { sparkline: { enabled: true } },
  stroke: { width: 0 },
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: { width: 200 },
        legend: { position: 'bottom' },
      },
    },
  ],
  fill: {
    type: 'gradient',
    gradient: {
      colorStops: chartColors.map((color) => [
        {
          offset: 0,
          color,
          opacity: 1,
        },
        {
          offset: 100,
          color,
          opacity: 1,
        },
      ]),
    },
  },
  grid: {
    padding: {
      top: -40,
      bottom: -40,
    },
  },
  plotOptions: {
    radialBar: {
      hollow: {
        margin: 14,
        size: '32%',
      },
      track: { margin: 14, background: alpha(grey[500], 0.08) },
      dataLabels: {
        value: {
          offsetY: 2,
          fontSize: typography.h5.fontSize as string,
        },
        total: { show: true, label: t('global.total'), formatter: () => total },
      },
    },
  },
});
