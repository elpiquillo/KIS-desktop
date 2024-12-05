import { TablePagination } from '@mui/material';
import React from 'react';

interface Props {
  limit: number;
  currentPage: number;
  maxPage: number;
  size: number;
  handleChangePage: (page: number) => void;
}

export default function TableViewPagination({
  limit,
  currentPage,
  maxPage,
  size,
  handleChangePage,
}: Props) {
  const onPageChange = (_: unknown, newPage: number) => {
    handleChangePage(newPage + 1);
  };

  if (maxPage === 1) return null;

  return (
    <TablePagination
      component="div"
      count={size}
      rowsPerPage={limit}
      page={currentPage - 1}
      onPageChange={onPageChange}
    />
  );
}
