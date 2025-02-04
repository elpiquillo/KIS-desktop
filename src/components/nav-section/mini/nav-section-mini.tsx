import Stack from '@mui/material/Stack';
import { memo } from 'react';


import NavList from './nav-list';
import { NavProps, NavGroupProps } from '../types';

function NavSectionMini({ data, slotProps, ...other }: NavProps) {
  return (
    <Stack component="nav" id="nav-section-mini" spacing={`${slotProps?.gap || 4}px`} {...other}>
      {data.map((group, index) => (
        <Group key={group.subheader || index} items={group.items} slotProps={slotProps} />
      ))}
    </Stack>
  );
}

const MemoizedNavSectionMini = memo(NavSectionMini);
export default MemoizedNavSectionMini;

// ----------------------------------------------------------------------

function Group({ items, slotProps }: NavGroupProps) {
  return (
    <>
      {items.map((list) => (
        <NavList key={list.title} data={list} depth={1} slotProps={slotProps} />
      ))}
    </>
  );
}
