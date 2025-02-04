import {useDraggable, useDroppable} from '@dnd-kit/core';
import { Box } from '@mui/material';
import React from 'react';

interface Props {
    id: string;
    children: React.ReactNode;
}

export default function Dnd({id, children}: Props) {
  const {attributes, listeners, setNodeRef: setDraggableNodeRef, transform} = useDraggable({
    id,
  });
  const {setNodeRef: setDroppableNodeRef} = useDroppable({
    id,
  });
  
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  
  return (
    <Box 
      ref={setDraggableNodeRef} 
      style={style} 
      sx={{zIndex: 10}}
      {...listeners} 
      {...attributes}
    >
      <Box ref={setDroppableNodeRef}>
        {children}
      </Box>
    </Box>
  );
}
