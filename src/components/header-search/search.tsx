import { Input, alpha } from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import Iconify from 'src/components/iconify';
import { useDebounce } from 'src/hooks/use-debounce';
import { useResponsive } from 'src/hooks/use-responsive';
import { grey } from 'src/theme/palette';
import { getTestId } from 'src/utils/data-test-id.helper';

interface HeaderSearchProps {
  value: string;
  placeholder: string;
  onSubmit: (value: string) => void;
}

export default function HeaderSearch({
  value: initialValue,
  placeholder,
  onSubmit,
}: HeaderSearchProps) {
  const [value, setValue] = useState('');
  const lgUp = useResponsive('up', 'lg');

  const debouncedValue = useDebounce(value, 500);

  const onInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setValue(event.target.value);
  };
  useEffect(() => {
    if (debouncedValue !== initialValue) onSubmit(debouncedValue);
  }, [debouncedValue, initialValue, onSubmit]);

  return (
    <Input
      {...getTestId('input-search')}
      placeholder={placeholder}
      value={value}
      onChange={onInputChange}
      disableUnderline
      startAdornment={
        <Iconify
          icon="material-symbols:search"
          sx={{
            color: 'grey.500',
            mx: '10px',
          }}
        />
      }
      sx={{
        height: 40,
        width: lgUp ? 280 : '100%',
        border: 1,
        borderColor: alpha(grey[500], 0.2),
        borderRadius: 1,
      }}
    />
  );
}
