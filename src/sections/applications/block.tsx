import React from 'react';
import { Box } from '@mui/material';
import { BlockViewByComponentType } from './block-view/constants';

interface Props {
  block: any;
}

export default function Block({ block }: Props) {
  const { content: View } = BlockViewByComponentType[block?.blocs?.[0]?.bloc_id || 'default'];

  return (
    <Box>
      <View blockInfo={block} />
    </Box>
  );
}
