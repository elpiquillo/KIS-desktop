import { Box } from '@mui/material';
import React from 'react';
import { BlockInterface } from 'src/types/application/general-interface';

interface Props {
  blockInfo: BlockInterface;
}

export default function DefaultView({ blockInfo }: Props) {
  return <Box>{blockInfo?.blocs?.[0]?.bloc_id}</Box>;
}
