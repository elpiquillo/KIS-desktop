import { Box, Card, CardContent, CardHeader, LinearProgress, Typography } from '@mui/material';
import React from 'react';

interface Props {
  blockInfo: any;
}

export default function ProgressBarView({ blockInfo }: Props) {
  const { data } = blockInfo.blocs[0];

  const percentageByData = data.force_percent
    ? +data.force_percent
    : +((data.first_value / data.second_value) * 100).toFixed(2);

  const showPercentage = Number.isNaN(percentageByData) ? 100 : percentageByData;

  return (
    <Card>
      <CardHeader title={data.card_title} subheader={data.sub_title} />
      <CardContent>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress
            sx={{ height: 8 }}
            color="success"
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
          {`${data.first_value || 0}${data.devise} / ${data.second_value || 0}${data.devise}`}
        </Typography>
      </CardContent>
      
    </Card>
  );
}
