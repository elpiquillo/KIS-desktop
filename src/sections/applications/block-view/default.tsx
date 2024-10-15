import { Box } from '@mui/material';
import React from 'react';

interface Props {
  blockInfo: any | null;
}

export default function DefaultView({ blockInfo }: Props) {
  return <Box>{blockInfo?.blocs?.[0]?.bloc_id}</Box>;
}
