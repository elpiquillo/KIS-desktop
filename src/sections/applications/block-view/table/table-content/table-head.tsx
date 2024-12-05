import { Box, ListItemIcon, TableCell, TableHead, TableRow, TableSortLabel } from '@mui/material';
import { t } from 'i18next';
import React, { useMemo } from 'react';
import Iconify from 'src/components/iconify';

interface Props {
  finalData: any;
  filters: any;
  sort: { order: 'asc' | 'desc'; id: number | null };
  handleOpenFilter: (e: React.MouseEvent<HTMLElement>, id: string) => void;
  handleChangeSort: (value: { order: 'asc' | 'desc'; id: number }) => void;
}

export default function TableViewHead({
  finalData,
  filters,
  sort,
  handleOpenFilter,
  handleChangeSort,
}: Props) {
  const columnsForFilter = useMemo(
    () =>
      finalData.queries_dispatch?.[0].destination_fields.find((field: any) =>
        Object.prototype.hasOwnProperty.call(field, 'columns')
      )?.columns || [],
    [finalData.queries_dispatch]
  );

  const createSortHandler = (newId: number) => {
    const isAsc = sort.id === newId && sort.order === 'asc';
    const newOrder = isAsc ? 'desc' : 'asc';
    handleChangeSort({ order: newOrder, id: newId });
  };

  return (
    <TableHead>
      <TableRow>
        {finalData.columns?.map((column: any) => {
          const columnNameForFilter = columnsForFilter.find(
            (col: any) => col.id === column.id
          )?.content;
          const isActiveFilter = filters.some(
            (filter: any) => filter.filter_column === columnNameForFilter
          );
          return (
            <TableCell key={column.id}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <TableSortLabel
                  active={sort.id === column.id}
                  direction={sort.id === column.id ? sort.order : 'asc'}
                  onClick={() => createSortHandler(column.id)}
                >
                  {column.name}
                </TableSortLabel>
                {finalData.allow_filters && (
                  <ListItemIcon
                    sx={{
                      ml: 0.5,
                      p: 0.5,
                      borderRadius: '50%',
                      cursor: 'pointer',
                      color: isActiveFilter ? 'white' : 'grey.600',
                      backgroundColor: isActiveFilter ? 'success.dark' : '',
                    }}
                    onClick={(e) => handleOpenFilter(e, column.id)}
                  >
                    <Iconify icon="mingcute:filter-2-fill" width={15} />
                  </ListItemIcon>
                )}
              </Box>
            </TableCell>
          );
        })}
        {finalData.button_action?.map((button: any) => (
          <TableCell key={button.id}>{t('global.action')}</TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
