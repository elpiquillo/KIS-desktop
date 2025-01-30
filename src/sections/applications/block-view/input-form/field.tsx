import { Box, MenuItem } from '@mui/material';
import React from 'react';
import { RHFCheckbox, RHFSelect, RHFTextField } from 'src/components/hook-form';
import RHFDatePicker from 'src/components/hook-form/rhf-date-picker';
import RHFDateTimePicker from 'src/components/hook-form/rhf-date-time-picker';
import RHFRichText from 'src/components/hook-form/rhf-rich-text';
import RHFUploadBox from 'src/components/hook-form/rhf-upload-box';
import { FieldData } from 'src/types/application/input-form-interface';

interface Props {
  index: number;
  data: FieldData;
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
      return <RHFRichText name={data.name} label={label} />;
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
      return <RHFDatePicker size="small" name={data.name} label={label} />;
    case 'date-time':
      return <RHFDateTimePicker size="small" name={data.name} label={label} />;
    case 'checkbox':
      return <RHFCheckbox name={data.name} label={label} color="success" />;
    case 'image':
      return (
        <RHFUploadBox
          name={data.name}
          accept={{ 'image/*': ['.jpg', '.jpeg', '.png'] }}
          label={label}
          placeholder="applications.uploadImage"
        />
      );
    case 'document':
      return (
        <RHFUploadBox
          name={data.name}
          accept={{ 'text/csv': ['.csv'] }}
          label={label}
          placeholder="applications.uploadDocument"
        />
      );
    case 'hidden-field':
      return <Box />;
    case 'select':
      return (
        <RHFSelect size="small" name={data.name} label={label} placeholder={data.name}>
          {!!data.options &&
            data.options
              .filter((option) => option.value && option.name)
              .map((option) => (
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
