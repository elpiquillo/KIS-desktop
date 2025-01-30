import { Box, FormControl, FormHelperText, FormLabel, Stack, Typography } from '@mui/material';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { t } from 'i18next';
import UploadBox from '../uploader/uploader';

interface Props {
  name: string;
  accept: Record<string, string[]>;
  label?: string;
  placeholder?: string;
  helperText?: React.ReactNode;
}

export default function RHFUploadBox({ name, accept, label, placeholder, helperText }: Props) {
  const { control, setValue } = useFormContext();

  const labelledby = label ? `${name}-${label}` : '';

  const handleDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setValue(name, { file_name: file.name, original: reader.result });
      };
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl component="fieldset">
          {label && (
            <FormLabel id={labelledby} sx={{ color: 'text.primary' }}>
              {label}
            </FormLabel>
          )}

          <UploadBox
            onDrop={handleDrop}
            placeholder={
              <Stack spacing={0.5} alignItems="center" flexDirection="row" justifyContent="center">
                <Typography component={Box} variant="subtitle2" color="text.secondary">
                  {t(placeholder || '')}
                </Typography>
              </Stack>
            }
            sx={{ mb: 3, py: 2.5, flexGrow: 1, height: 'auto' }}
            fullWidth
            accept={accept}
            maxFiles={1}
          />

          {(!!error || helperText) && (
            <FormHelperText error={!!error} sx={{ mx: 0 }}>
              {error ? error?.message : helperText}
            </FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
}
