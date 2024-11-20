import {
  Box,
  Button,
  ListItemIcon,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material';
import { t } from 'i18next';
import React, { Children, useEffect } from 'react';
import { usePopover } from 'src/components/custom-popover';
import Iconify from 'src/components/iconify';
import { TableNoData } from 'src/components/table';
import FilterModal from './modal';

interface Props {
  blockInfo: any;
  handleGetHandlers: (additionalFilters: any[]) => void;
}

export default function TableView({ blockInfo, handleGetHandlers }: Props) {
  const [columnForFilter, setColumnForFilter] = React.useState('');
  const { open, onOpen, onClose } = usePopover();
  const theme = useTheme();

  const { data } = blockInfo.blocs[0];
  const filters = JSON.parse(localStorage.getItem(blockInfo.id) || '[]');

  const maxRow =
    data.columns_content?.reduce(
      (acc: number, column: any) => (column.content.length > acc ? column.content.length : acc),
      0
    ) || 0; // fix by max len content in columns_content

  useEffect(() => {
    handleGetHandlers(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpenFilter = (event: React.MouseEvent<HTMLElement>, id: number) => {
    const nameField = data.queries_dispatch[0].destination_fields[0].columns.find(
      (column: any) => column.id === id
    ).content;
    setColumnForFilter(nameField);
    onOpen(event);
  };

  const handleCloseFilter = () => {
    setColumnForFilter('');
    onClose();
  };

  return (
    <Box>
      <Box sx={{ height: '36px', display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="subtitle1">{data.card_title}</Typography>
        {data.button_export && (
          <Button disabled variant="outlined">
            {t('applications.exportCsv')}
          </Button>
        )}
      </Box>

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
              '& .MuiTableRow-root:last-of-type .MuiTableCell-root': {
                borderBottomWidth: '0px',
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
            }}
          >
            <TableHead>
              <TableRow>
                {data.columns.map((column: any) => {
                  const columnNameForFilter =
                    data.queries_dispatch[0].destination_fields[0].columns.find(
                      (col: any) => col.id === column.id
                    ).content;
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
                        <Typography variant="subtitle2">{column.name}</Typography>
                        {data.allow_filters && (
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
                {data.button_action.map((button: any) => (
                  <TableCell key={button.id}>{t('global.action')}</TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {Children.toArray(
                Array.from({ length: maxRow }).map((_, index) => (
                  <TableRow>
                    {data.columns_content.map((column: any) => (
                      <TableCell key={column.id}>
                        {column.content[index]?.column_content || ''}
                      </TableCell>
                    ))}
                    {data.button_action.map((button: any) => (
                      <TableCell key={button.id}>
                        <Button key={button.id} size="small" variant="outlined">
                          {button.text}
                        </Button>
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
              {!data.columns.length && !data.button_action.length && (
                <TableNoData
                  notFound
                  title={t('applications.editForm.noColumnsAdded')}
                  imgUrl="/assets/icons/empty/ic_content.svg"
                  sx={{ height: '180px' }}
                />
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <FilterModal
        id={blockInfo.id}
        nameColumn={columnForFilter}
        filters={filters}
        open={open}
        onClose={handleCloseFilter}
        handleGetHandlers={handleGetHandlers}
      />
    </Box>
  );
}
