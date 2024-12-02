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
import React, { Children, useCallback, useEffect, useMemo, useState } from 'react';
import { usePopover } from 'src/components/custom-popover';
import Iconify from 'src/components/iconify';
import { TableNoData } from 'src/components/table';
import { DataQuery, QueryResult } from 'src/types/queries-interface';
import dispatchFetchedData from 'src/store/helpers/dispatchFetchedData';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hooks';
import FilterModal from './modal';
import TableCellContent from './cell-content';

interface Props {
  blockInfo: any;
  handleGetHandlers: (additionalFilters?: any[]) => {
    queriesRequest: DataQuery[];
    queriesResponse: QueryResult[];
  };
}

export default function TableView({ blockInfo, handleGetHandlers }: Props) {
  const [queriesRequest, setQueriesRequest] = useState<DataQuery[]>([]);
  const [columnForFilter, setColumnForFilter] = React.useState('');
  const [finalData, setFinalData] = useState<any>({
    ...blockInfo.blocs[0].data,
    columns_content: [],
  });
  const { applicationId } = useParams();
  const { open, onOpen, onClose } = usePopover();
  const theme = useTheme();

  const { data: blockData } = blockInfo.blocs[0];
  const filters = JSON.parse(localStorage.getItem(blockInfo.id) || '[]');

  const maxRow = useMemo(
    () =>
      finalData.columns_content?.reduce(
        (acc: number, column: any) => (column.content.length > acc ? column.content.length : acc),
        0
      ) || 0,
    [finalData.columns_content]
  );

  const mapColumnsContentByOriginalProperty = useCallback(
    (data: any) => {
      const cols = blockData.columns.map((c: any) => c.id);
      data.columns_content.sort((a: any, b: any) => cols.indexOf(a.id) - cols.indexOf(b.id));
      const newData = {
        ...data,
        columns_content: data.columns_content.map((e: any) => ({
          ...e,
          content: e.content.map((cont: any) => {
            if (
              typeof cont.column_content !== 'string' &&
              typeof cont.column_content !== 'number' &&
              !cont.column_content?.original
            ) {
              return { ...cont, column_content: '' };
            }
            return cont;
          }),
        })),
      };
      return newData;
    },
    [blockData]
  );

  const handleGetContent = useCallback(async () => {
    const { queriesResponse, queriesRequest: request } = await handleGetHandlers(filters);
    setQueriesRequest(request);

    const dispatchData = dispatchFetchedData({
      dataQueries: queriesResponse,
      dispatchQueries: blockData.queries_dispatch,
      finalData,
    });

    const result = mapColumnsContentByOriginalProperty(dispatchData);

    setFinalData(result);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockData, handleGetHandlers, mapColumnsContentByOriginalProperty]);

  useEffect(() => {
    handleGetContent();
  }, [handleGetContent]);

  const handleOpenFilter = (event: React.MouseEvent<HTMLElement>, id: number) => {
    const nameField = finalData.queries_dispatch?.[0].destination_fields[0].columns.find(
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
        <Typography variant="subtitle1">{finalData.card_title}</Typography>
        {finalData.button_export && (
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
                {finalData.columns?.map((column: any) => {
                  const columnNameForFilter =
                    finalData.queries_dispatch?.[0].destination_fields[0].columns.find(
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
                        <Typography variant="subtitle2">{column.name}</Typography>
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

            <TableBody>
              {Children.toArray(
                Array.from({ length: maxRow }).map((_, indexRow) => (
                  <TableRow>
                    {finalData.columns?.map((column: any, indexColumn: number) => (
                      <TableCell key={column.id}>
                        <TableCellContent
                          data={
                            finalData.columns_content[indexColumn]?.content[indexRow]
                              ?.column_content
                          }
                        />
                      </TableCell>
                    ))}
                    {finalData.button_action?.map((button: any) => (
                      <TableCell key={button.id}>
                        <Button
                          key={button.id}
                          variant="outlined"
                          sx={{
                            borderRadius: 0.5,
                            '&:hover': {
                              color: 'text.primary',
                            },
                          }}
                          component={RouterLink}
                          href={`${paths.main.root}${applicationId}/${button.page_id}`}
                          state={{
                            data: {
                              id: finalData.columns_content[0]?.content[indexRow]?.column_id,
                              collection: blockData.queries[0].collection_name,
                              query: queriesRequest,
                            },
                          }}
                        >
                          {button.text}
                        </Button>
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
              {!blockData.columns?.length && !blockData.button_action?.length && (
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
