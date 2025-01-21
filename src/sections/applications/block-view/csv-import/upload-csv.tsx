import { Box, Stack, Typography } from '@mui/material';
import { t } from 'i18next';
import { ParseResult } from 'papaparse';
import React from 'react';
import { usePapaParse } from 'react-papaparse';
import UploadBox from 'src/components/uploader/uploader';

interface Props {
  setCsvData: (data: string[][]) => void;
}

export default function UploadCsv({ setCsvData }: Props) {
  const { readString } = usePapaParse();

  const handleDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = (event) => {
        if (event.target?.result) {
          readString(event.target.result as string, {
            complete: (results: ParseResult<string>) => {
              const data = results.data.map((row) => Object.values(row));
              setCsvData([results.meta.fields || [], ...data]);
            },
            header: true,
          });
        }
      };
    }
  };

  return (
    <UploadBox
      onDrop={handleDrop}
      placeholder={
        <Stack spacing={0.5} alignItems="center" flexDirection="row" justifyContent="center">
          <Typography
            component={Box}
            variant="subtitle2"
            color="success.main"
            sx={{ textDecoration: 'underline' }}
          >
            {t('applications.browse')}
          </Typography>
          <Typography component={Box} variant="subtitle2" color="text.secondary">
            {t('applications.orDndCsvFile')}
          </Typography>
        </Stack>
      }
      sx={{ mb: 3, py: 2.5, flexGrow: 1, height: 'auto' }}
      fullWidth
      accept={{ 'text/csv': ['.csv'] }}
      maxFiles={1}
    />
  );
}
