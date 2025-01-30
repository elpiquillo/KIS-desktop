import { Box, Paper, Table, TableContainer, useTheme } from '@mui/material';
import React, { PropsWithChildren } from 'react';

interface Props {
  maxPage?: number;
  pagination?: JSX.Element | null;
}

export default function TableContainerCustom({
  maxPage = 1,
  pagination,
  children,
}: PropsWithChildren<Props>) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 1,
      }}
    >
      <TableContainer component={Paper}>
        <Table
          size="small"
          data-testid="table"
          sx={{
            '& .MuiTableCell-root': {
              borderColor: `${theme.palette.divider} !important`,
              borderWidth: '1px',
              borderStyle: 'solid',
            },
            '& .MuiTableRow-root:first-of-type .MuiTableCell-root': {
              borderWidth: '0px 1px 1px 1px',
            },
            '& .MuiTableRow-root .MuiTableCell-root:last-of-type': {
              borderRightWidth: '0px',
            },
            '& .MuiTableRow-root .MuiTableCell-root:first-of-type': {
              borderLeftWidth: '0px',
            },
            ...(maxPage === 1 && {
              '& .MuiTableRow-root:last-of-type .MuiTableCell-root': {
                borderBottomWidth: '0px',
              },
            }),
          }}
        >
          {children}
        </Table>

        {pagination}
      </TableContainer>
    </Box>
  );
}
