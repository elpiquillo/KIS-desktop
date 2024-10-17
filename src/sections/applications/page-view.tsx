import React from 'react';
import SimpleBar from 'simplebar-react';
import { Box, Card, Grid } from '@mui/material';
import { useDashboardState } from 'src/store/dashboardState';
import Block from './block';

export default function PageView() {
  const dashboard = useDashboardState((s) => s.dashboard);
  const structure = dashboard?.pages.pages[0].structure;

  return (
    <SimpleBar style={{ maxHeight: 'calc(100vh - 44px)' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', p: 2, gap: 2, flexGrow: 1 }}>
        {structure?.map((container: any, index: number) => (
          <Grid container p={2} columnSpacing={2}>
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
        ))}
      </Box>
    </SimpleBar>
  );
}
