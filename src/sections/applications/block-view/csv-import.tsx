import { Box, Stack, Typography } from '@mui/material';
import { t } from 'i18next';
import React from 'react';
import UploadBox from 'src/components/uploader/uploader';

interface Props {
  blockInfo: any;
}

export default function CsvImportView({ blockInfo }: Props) {
  const { data } = blockInfo.blocs[0];

  const handleDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      // reader.onload = (event) => {
      //   if (event.target?.result) {
      //     readString(event.target.result as string, {
      //       complete: (results: any) => {
      //         setData(results.data);
      //       },
      //       header: true, // If your CSV file has headers
      //     });
      //   }
      // };
      // reader.readAsText(file);
    }
  };

  return (
    <Box>
      <Typography variant="h6">{data.card_title}</Typography>
      <Typography variant="body1">{data.sub_title}</Typography>
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
    </Box>
  );
}
