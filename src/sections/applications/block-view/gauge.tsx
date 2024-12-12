import { Box, Button, Card, CardHeader, Typography } from '@mui/material';
import { Gauge, gaugeClasses } from '@mui/x-charts';
import React from 'react';
import { success } from 'src/theme/palette';

interface Props {
  blockInfo: any;
}

export default function GaugeView({ blockInfo }: Props) {
  const { data } = blockInfo.blocs[0];

  const percentage = !data.second_value
    ? data.first_value
    : ((data.first_value / data.second_value) * 100).toFixed(2);

  return (
    <Card>
      <CardHeader title={data.card_title} subheader={data.sub_title} />
      <Box
        sx={{
          mt: 1.5,
          padding: 2,
        }}
      >
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ minWidth: '10px', display: 'flex', alignItems: 'center' }}>
            <Typography variant="h4">{`${data.middle_text} ${data.devise}`}</Typography>
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
          {data.button_action.map((button: { id: string; text: string }) => (
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
          {data.bottom_text}
        </Typography>
      </Box>
    </Card>
  );
}
