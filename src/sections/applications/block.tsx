import React from 'react';
import { BlockViewByComponentType } from './block-view/constants';

interface Props {
  block: any;
}

export default function Block({ block }: Props) {
  const { content: View } =
    BlockViewByComponentType[block?.blocs?.[0]?.bloc_id] || BlockViewByComponentType.default;

  return <View blockInfo={block} />;
}
