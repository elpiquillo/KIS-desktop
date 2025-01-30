import { Box, alpha } from '@mui/material';
import React from 'react';
import { useFormContext } from 'react-hook-form';

interface Props {
  name: string;
  color: string;
}

export default function RhfColorCheckbox({ name, color }: Props) {
  const { setValue, watch } = useFormContext();
  const value = watch(name);

  const handleChangeValue = () => {
    setValue(name, !value);
  };

  return (
    <Box
      sx={{
        height: 24,
        width: '100%',
        borderRadius: 0.5,
        backgroundColor: value ? color : alpha(color, 0.3),
      }}
      onClick={handleChangeValue}
    />
  );
}
