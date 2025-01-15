import { Grid, SxProps, Theme } from '@mui/material';
import React from 'react';
import Block from './block';

interface Props {
  container: any;
  sx?: SxProps<Theme>;
}

export default function ContainerView({ container, sx }: Props) {
  return (
    <Grid container columnSpacing={2} sx={{ ...sx }}>
      {container.row.map((row: any) => (
        <Grid
          key={row.id}
          item
          xs={row.col}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          {row.blocs
            .filter((block: any) => block.blocs.length)
            .map((block: any) => (
              <Block key={block.id} block={block} />
            ))}
        </Grid>
      ))}
    </Grid>
  );
}
