import { Button, TableBody, TableCell, TableRow } from '@mui/material';
import React, { Children } from 'react';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hooks';
import { DataQuery } from 'src/types/queries-interface';
import { TableNoData } from 'src/components/table';
import { TableFinalData } from 'src/types/application/table-interface';
import { DataValue } from 'src/types/application/input-form-interface';
import { t } from 'i18next';
import TableCellContent from './cell-content';

interface Props {
  finalData: TableFinalData;
  tableData: {
    id: string;
    content: DataValue;
  }[][];
  queriesRequest: DataQuery[];
}

export default function TableViewBody({ finalData, tableData, queriesRequest }: Props) {
  const { applicationId } = useParams();

  return (
    <TableBody>
      {Children.toArray(
        tableData.map((row, indexRow) => (
          <TableRow>
            {row.map((column) => (
              <TableCell key={column.id}>
                <TableCellContent data={column.content} />
              </TableCell>
            ))}
            {finalData.button_action?.map((button) => (
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
                      collection: finalData.queries?.[0].collection_name,
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
  );
}
