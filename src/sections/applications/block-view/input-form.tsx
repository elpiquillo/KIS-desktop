import { Box, Button, TextField, Typography } from '@mui/material';
import React from 'react';

interface Props {
  blockInfo: any;
}

export default function InputFormView({ blockInfo }: Props) {
  const { data } = blockInfo.blocs[0];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h6">{data.title}</Typography>
      <Box
        sx={{ display: 'grid', gridTemplateColumns: `repeat(${data.submit.column}, 1fr)`, gap: 2 }}
      >
        {data.fields.map((field: any) => (
          <TextField key={field.name} fullWidth label={field.label} size="small" />
        ))}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'end' }}>
        <Button
          variant="contained"
          sx={{
            borderRadius: 0.5,
            '&.Mui-disabled': {
              color: 'background.paper',
            },
          }}
        >
          {data.submit.button}
        </Button>
      </Box>
    </Box>
  );
}
