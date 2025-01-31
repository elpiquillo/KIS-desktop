import { Box, Button, Typography } from '@mui/material';
import { t } from 'i18next';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { usePopover } from 'src/components/custom-popover';
import dispatchFetchedData from 'src/store/helpers/dispatchFetchedData';
import { BlockInterface } from 'src/types/application/general-interface';
import { TableData, TableFinalData } from 'src/types/application/table-interface';
import { CustomFilter, DataQuery, QueryResult } from 'src/types/queries-interface';
import FilterModal from './modal';
import TableContent from './table-content/table-content';

interface Props {
  blockInfo: BlockInterface<TableData>;
  handleGetHandlers: (props: { additionalFilters?: CustomFilter[]; page?: number }) => Promise<{
    queriesRequest: DataQuery[];
    queriesResponse: QueryResult[];
  }>;
}

export default function TableView({ blockInfo, handleGetHandlers }: Props) {
  const [queriesRequest, setQueriesRequest] = useState<DataQuery[]>([]);
  const [queriesResponse, setQueriesResponse] = useState<QueryResult[]>([]);
  const [columnForFilter, setColumnForFilter] = React.useState('');
  const [finalData, setFinalData] = useState<TableFinalData>({
    ...blockInfo.blocs[0].data,
    columns_content: [],
  });
  const { open, onOpen, onClose } = usePopover();

  const { data: blockData } = blockInfo.blocs[0];
  const filtersFromStorage = useMemo(
    () => JSON.parse(localStorage.getItem(blockInfo.id) || '[]'),
    [blockInfo.id]
  );

  const mapColumnsContentByOriginalProperty = useCallback(
    (data: TableFinalData) => {
      const cols = blockData.columns.map((c) => c.id);
      data.columns_content.sort((a, b) => cols.indexOf(a.id) - cols.indexOf(b.id));
      const newData = {
        ...data,
        columns_content: data.columns_content.map((e) => ({
          ...e,
          content: e.content.map((cont) => {
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

  const handleGetContent = useCallback(
    async ({ filters, page }: { filters: CustomFilter[]; page?: number }) => {
      const { queriesRequest: request, queriesResponse: response } = await handleGetHandlers({
        additionalFilters: filters,
        page: page || undefined,
      });

      setFinalData((prevFinalData) => {
        const dispatchData = dispatchFetchedData({
          dataQueries: response,
          dispatchQueries: blockData.queries_dispatch,
          finalData: prevFinalData,
        });

        return mapColumnsContentByOriginalProperty(dispatchData);
      });
      setQueriesRequest(request);
      setQueriesResponse(response);
    },
    [blockData, handleGetHandlers, mapColumnsContentByOriginalProperty]
  );

  useEffect(() => {
    handleGetContent({ filters: filtersFromStorage });
  }, [filtersFromStorage, handleGetContent]);

  const handleOpenFilterModal = (event: React.MouseEvent<HTMLElement>, id: string) => {
    const nameField =
      finalData.queries_dispatch?.[0]?.destination_fields?.[0]?.columns.find(
        (column) => column.id === id
      )?.content ?? '';
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

      <TableContent
        finalData={finalData}
        queriesRequest={queriesRequest}
        queriesResponse={queriesResponse}
        filters={filtersFromStorage}
        handleOpenFilterModal={handleOpenFilterModal}
        handleGetContent={handleGetContent}
      />

      <FilterModal
        id={blockInfo.id}
        nameColumn={columnForFilter}
        filters={filtersFromStorage}
        open={open}
        onClose={handleCloseFilter}
        handleGetContent={handleGetContent}
      />
    </Box>
  );
}
