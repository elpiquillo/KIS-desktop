import { FormHelperText, GlobalStyles } from '@mui/material';
import {
  ArrowDropDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CalendarIcon,
  DateTimePicker,
  DateTimePickerProps,
  LocalizationProvider,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { Controller, useFormContext } from 'react-hook-form';
import { success } from 'src/theme/palette';

type Props = DateTimePickerProps<any> & {
  name: string;
  size?: 'small' | 'medium';
  helperText?: React.ReactNode;
};

export default function RHFDateTimePicker({ name, label, size, helperText, ...other }: Props) {
  const { control } = useFormContext();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <>
            <GlobalStyles
              styles={{
                '.MuiButtonBase-root.Mui-selected': {
                  backgroundColor: `${success.main}!important`,
                },
              }}
            />
            <DateTimePicker
              {...field}
              label={label}
              value={dayjs(field.value)}
              slots={{
                openPickerIcon: CalendarIcon,
                switchViewIcon: ArrowDropDownIcon,
                leftArrowIcon: ArrowLeftIcon,
                rightArrowIcon: ArrowRightIcon,
              }}
              slotProps={{
                textField: {
                  size,
                  error: !!error,
                },
                openPickerIcon: {
                  sx: {
                    color: 'text.secondary',
                  },
                },
                switchViewIcon: {
                  sx: {
                    color: 'text.secondary',
                  },
                },
                leftArrowIcon: {
                  sx: {
                    color: 'text.secondary',
                  },
                },
                rightArrowIcon: {
                  sx: {
                    color: 'text.secondary',
                  },
                },
              }}
              {...other}
            />

            {(!!error || helperText) && (
              <FormHelperText error={!!error}>{error ? error?.message : helperText}</FormHelperText>
            )}
          </>
        )}
      />
    </LocalizationProvider>
  );
}
