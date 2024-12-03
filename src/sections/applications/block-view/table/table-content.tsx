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
  TablePagination,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material';
import React, { Children, useMemo } from 'react';
import Iconify from 'src/components/iconify';
import { useParams } from 'src/routes/hooks';
import { DataQuery, QueryResult } from 'src/types/queries-interface';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import { TableNoData } from 'src/components/table';
import { t } from 'i18next';
import TableCellContent from './cell-content';
import TableViewPagination from './table-pagination';

interface Props {
  finalData: any;
  queriesRequest: DataQuery[];
  queriesResponse: QueryResult[];
  filters: any;
  handleOpenFilter: (e: React.MouseEvent<HTMLElement>, id: string) => void;
  handleGetContent: (page?: number) => void;
}

export default function TableContent({
  finalData,
  queriesRequest,
  queriesResponse,
  filters,
  handleOpenFilter,
  handleGetContent,
}: Props) {
  const { applicationId } = useParams();
  const theme = useTheme();

  const maxRow = useMemo(
    () =>
      finalData.columns_content?.reduce(
        (acc: number, column: any) => (column.content.length > acc ? column.content.length : acc),
        0
      ) || 0,
    [finalData.columns_content]
  );

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
            ...(queriesResponse[0]?.pages.max_page === 1 && {
              '& .MuiTableRow-root:last-of-type .MuiTableCell-root': {
                borderBottomWidth: '0px',
              },
            }),
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
                          finalData.columns_content[indexColumn]?.content[indexRow]?.column_content
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
                            collection: finalData.queries[0].collection_name,
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
            {!finalData.columns?.length && !finalData.button_action?.length && (
              <TableNoData
                notFound
                title={t('applications.editForm.noColumnsAdded')}
                imgUrl="/assets/icons/empty/ic_content.svg"
                sx={{ height: '180px' }}
              />
            )}
          </TableBody>
        </Table>
        <TableViewPagination
          limit={finalData.queries[0].limit}
          currentPage={queriesResponse[0]?.pages.current_page}
          maxPage={queriesResponse[0]?.pages.max_page}
          size={queriesResponse[0]?.documents_size}
          handleGetContent={handleGetContent}
        />
      </TableContainer>
    </Box>
  );
}
