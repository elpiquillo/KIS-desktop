import { Grid, SxProps, Theme } from '@mui/material';
import React from 'react';
import { ContainerInterface } from 'src/types/application/general-interface';
import Block from './block';

interface Props {
  container: ContainerInterface;
  sx?: SxProps<Theme>;
}

export default function ContainerView({ container, sx }: Props) {
  return (
    <Grid container columnSpacing={2} sx={{ ...sx }}>
      {container.row.map((row) => (
        <Grid
          key={row.id}
          item
          xs={row.col}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          {row.blocs
            .filter((block) => block.blocs.length)
            .map((block) => (
              <Block key={block.id} block={block} />
            ))}
        </Grid>
      ))}
    </Grid>
  );
}
