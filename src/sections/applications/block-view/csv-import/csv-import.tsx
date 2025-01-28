import { Box, Button, Typography } from '@mui/material';
import { t } from 'i18next';
import React, { useState } from 'react';
import { useParams } from 'src/routes/hooks';
import { useCreateDataHandlers } from 'src/apis/data-handler';
import { CsvImportData } from 'src/types/application/csv-import-interface';
import { Document } from 'src/types/queries-interface';
import { useSnackbar } from 'notistack';
import UploadCsv from './upload-csv';
import CsvTable from './csv-table';

interface Props {
  blockInfo: { blocs: CsvImportData[] };
}

export default function CsvImportView({ blockInfo }: Props) {
  const { data } = blockInfo.blocs[0];

  const [csvData, setCsvData] = useState<string[][]>([]);

  const { enqueueSnackbar } = useSnackbar();
  const { pageId } = useParams();
  const { createDataHandlers } = useCreateDataHandlers(data.queries?.[0]);

  const handleSaveDataFromCsv = async () => {
    try {
      const documents = csvData.map((row) => {
        const arrayRow = [...row];
        const parseRow = data.fields.reduce((acc: { [key: string]: string }, field) => {
          acc[field.field_name] = arrayRow[+field.row];
          return acc;
        }, {});
        return parseRow;
      });

      if (data.document_header) {
        documents.shift();
      }

      await createDataHandlers({
        pageId: pageId || '?',
        documents: [...(documents as Document[])],
      });

      enqueueSnackbar(t('applications.successSaved'), {
        variant: 'success',
        anchorOrigin: { vertical: 'top', horizontal: 'center' },
      });
    } catch (err) {
      enqueueSnackbar(t('applications.somethingWentWrong'), {
        variant: 'error',
        anchorOrigin: { vertical: 'top', horizontal: 'center' },
      });
    }
  };

  const handleCancelDataFromCsv = () => {
    setCsvData([]);
  };

  return (
    <Box>
      <Typography variant="h6">{data.card_title}</Typography>
      <Typography variant="body1">{data.sub_title}</Typography>

      <UploadCsv setCsvData={setCsvData} />

      {csvData.length > 0 && (
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button color="success" variant="contained" onClick={handleSaveDataFromCsv}>
            {t('applications.saveDataFromCsv')}
          </Button>
          <Button color="error" variant="outlined" onClick={handleCancelDataFromCsv}>
            {t('global.cancel')}
          </Button>
        </Box>
      )}

      <CsvTable data={csvData} />
    </Box>
  );
}
