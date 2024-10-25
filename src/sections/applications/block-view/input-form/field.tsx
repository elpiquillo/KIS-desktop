import { Box, MenuItem } from '@mui/material';
import React from 'react';
import { RHFCheckbox, RHFSelect, RHFTextField } from 'src/components/hook-form';

interface Props {
  index: number;
  data: any;
}

export default function Field({ index, data }: Props) {
  const label = data.label ? data.label : `field-label-${index}`;

  switch (data.type) {
    case 'text':
      return <RHFTextField size="small" name={data.name} label={label} placeholder={data.name} />;
    case 'text-area':
      return (
        <RHFTextField
          multiline
          size="small"
          name={data.name}
          label={label}
          placeholder={data.name}
        />
      );
    case 'plain-text':
      return <RHFTextField size="small" name={data.name} label={label} placeholder={data.name} />;
    case 'number':
      return (
        <RHFTextField
          size="small"
          type="number"
          name={data.name}
          label={label}
          placeholder={data.name}
        />
      );
    case 'date':
      return <RHFTextField name={data.name} label={label} />;
    case 'checkbox':
      return <RHFCheckbox name={data.name} label={label} color="success" />;
    case 'image':
      return <RHFTextField size="small" name={data.name} label={label} placeholder={data.name} />;
    case 'document':
      return <RHFTextField size="small" name={data.name} label={label} placeholder={data.name} />;
    case 'hidden-field':
      return <Box />;
    case 'select':
      return (
        <RHFSelect size="small" name={data.name} label={label} placeholder={data.name}>
          {data.options.map((option: any) => (
            <MenuItem key={option.value} value={option.value}>
              {option.name}
            </MenuItem>
          ))}
        </RHFSelect>
      );
    default:
      return <RHFTextField size="small" name={data.name} label={label} placeholder={data.name} />;
  }
}
