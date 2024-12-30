import { Box, TableBody, TableCell, TableRow, Typography } from '@mui/material';
import { t } from 'i18next';
import React, { Children } from 'react';
import { TableHeadCustom } from 'src/components/table';
import TableContainerCustom from 'src/components/table/table-container-custom';

interface Props {
  data: any;
}

export default function CsvTable({ data }: Props) {
  if (!data.length) return null;

  return (
    <>
      <Box sx={{ my: 1 }}>
        <Typography variant="subtitle1" color="text.secondary">
          {t('applications.csvImport.extractFromFile')}
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          {t('applications.csvImport.makeReadingEasier')}
        </Typography>
      </Box>

      <TableContainerCustom>
        <TableHeadCustom
          headLabel={
            data[0].map((column_name: string) => ({
              id: column_name,
              name: column_name,
            })) || []
          }
        />

        <TableBody>
          {Children.toArray(
            data
              .slice(1, 100)
              .map((row: string[]) => (
                <TableRow>
                  {Children.toArray(row.map((column) => <TableCell>{column}</TableCell>))}
                </TableRow>
              ))
          )}
        </TableBody>
      </TableContainerCustom>
    </>
  );
}
