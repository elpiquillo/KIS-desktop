import { Box, FormControl, FormHelperText, FormLabel, useTheme } from '@mui/material';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface Props {
  name: string;
  label: string;
  helperText?: React.ReactNode;
}

export default function RHFRichText({ name, label, helperText }: Props) {
  const theme = useTheme();
  const { control } = useFormContext();

  const labelledby = label ? `${name}-${label}` : '';

  const SizeStyle = Quill.import('attributors/style/size');
  SizeStyle.whitelist = ['10px', '15px', '18px', '20px', '32px', '54px'];
  Quill.register(SizeStyle, true);

  const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike', 'clean'],
    ['separator'],
    ['blockquote', 'code-block'],
    ['separator'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ indent: '-1' }, { indent: '+1' }],
    [{ align: [] }],
    ['separator'],
    [{ size: SizeStyle.whitelist }],
    ['separator'],
    [{ color: [] }, { background: [] }],
  ];

  return (
    <Box
      sx={{
        '& .ql-toolbar': {
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: '8px 8px 0 0',
        },
        '& .ql-container': {
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: '0 0 8px 8px',
        },
      }}
    >
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <FormControl component="fieldset" sx={{ width: '100%' }}>
            {label && (
              <FormLabel id={labelledby} sx={{ color: 'text.primary' }}>
                {label}
              </FormLabel>
            )}

            <ReactQuill
              {...field}
              modules={{
                toolbar: toolbarOptions,
              }}
              onChange={(value) => field.onChange(value)}
            />

            {(!!error || helperText) && (
              <FormHelperText error={!!error} sx={{ mx: 0 }}>
                {error ? error?.message : helperText}
              </FormHelperText>
            )}
          </FormControl>
        )}
      />
      <Box sx={{ height: '0px' }} />
    </Box>
  );
}
