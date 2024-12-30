import React, { useCallback, useMemo, useState } from 'react';
import { CustomFilter, DataQuery, QueriesDispatch, QueryResult } from 'src/types/queries-interface';
import { TableHeadCustom } from 'src/components/table';
import TableContainerCustom from 'src/components/table/table-container-custom';
import TableViewPagination from './table-pagination';
import TableViewBody from './table-body';

interface Props {
  finalData: any;
  queriesRequest: DataQuery[];
  queriesResponse: QueryResult[];
  filters: CustomFilter[];
  handleOpenFilterModal: (e: React.MouseEvent<HTMLElement>, id: string) => void;
  handleGetContent: (props: { filters: CustomFilter[]; page?: number }) => void;
}

export default function TableContent({
  finalData,
  queriesRequest,
  queriesResponse,
  filters,
  handleOpenFilterModal,
  handleGetContent,
}: Props) {
  const [sort, setSort] = useState<{ order: 'asc' | 'desc'; id: number | null }>({
    order: 'asc',
    id: null,
  });

  const getTableData = useCallback((columns_content: any) => {
    const groupedData = new Map();

    columns_content.forEach((column: any) => {
      column.content.forEach((content: any) => {
        if (!groupedData.has(content.column_id)) {
          groupedData.set(content.column_id, []);
        }
        groupedData.get(content.column_id).push({
          id: column.id,
          content: content.column_content,
        });
      });
    });

    return Array.from(groupedData.values());
  }, []);

  const tableData = useMemo(() => {
    const data = getTableData(finalData.columns_content);
    if (sort.id !== null) {
      data.sort((a: any, b: any) => {
        const aValue = a.find((item: any) => item.id === sort.id)?.content || '';
        const bValue = b.find((item: any) => item.id === sort.id)?.content || '';
        if (aValue < bValue) return sort.order === 'asc' ? -1 : 1;
        if (aValue > bValue) return sort.order === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return data;
  }, [finalData.columns_content, getTableData, sort]);

  const columnsForFilter = useMemo(
    () =>
      finalData.queries_dispatch?.[0]?.destination_fields.find(
        (field: QueriesDispatch['destination_fields'][number]) =>
          Object.prototype.hasOwnProperty.call(field, 'columns')
      )?.columns || [],
    [finalData.queries_dispatch]
  );

  const isActiveFilter = (id: string) => {
    const columnNameForFilter = columnsForFilter.find((col: any) => col.id === id)?.content;
    return filters.some((filter: CustomFilter) => filter.filter_column === columnNameForFilter);
  };

  const handleChangeSort = (id: string | number) => {
    const isAsc = sort.id === id && sort.order === 'asc';
    const newOrder = isAsc ? 'desc' : 'asc';
    setSort({ order: newOrder, id: Number(id) });
  };

  const handleChangePage = (page: number) => {
    handleGetContent({ filters, page });
  };

  return (
    <TableContainerCustom
      maxPage={queriesResponse[0]?.pages.max_page}
      pagination={
        <TableViewPagination
          limit={finalData.queries?.[0]?.limit || 10}
          currentPage={queriesResponse[0]?.pages.current_page || 1}
          maxPage={queriesResponse[0]?.pages.max_page || 1}
          size={queriesResponse[0]?.documents_size || 0}
          handleChangePage={handleChangePage}
        />
      }
    >
      <TableHeadCustom
        order={sort.order}
        orderBy={sort.id}
        headLabel={finalData.columns}
        buttonAction={finalData.button_action}
        onSort={handleChangeSort}
        isActiveFilter={isActiveFilter}
        handleOpenFilterModal={handleOpenFilterModal}
      />

      <TableViewBody tableData={tableData} finalData={finalData} queriesRequest={queriesRequest} />
    </TableContainerCustom>
  );
}
