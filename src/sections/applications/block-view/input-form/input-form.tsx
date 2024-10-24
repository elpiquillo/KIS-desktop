import { Box, Button, TextField, Typography } from '@mui/material';
import React, { Children } from 'react';
import FormProvider from 'src/components/hook-form';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

interface Props {
  blockInfo: any;
}

export default function InputFormView({ blockInfo }: Props) {
  const { data } = blockInfo.blocs[0];

  const validationSchema = Yup.object().shape(
    data.fields.reduce((acc: any, field: any, index: number) => {
      const typeValidation: any = field.type === 'number' ? Yup.number() : Yup.string();
      return {
        ...acc,
        [field.name]: typeValidation
          .when([], {
            is: () => field.validate.required.active,
            then: (schema: Yup.NumberSchema | Yup.StringSchema) =>
              schema.required(field.validate.required.errorMessage),
          })
          .when([], {
            is: () => field.validate.min.active,
            then: (schema: Yup.NumberSchema | Yup.StringSchema) =>
              schema.min(field.validate.min.value, field.validate.required.errorMessage),
          })
          .when([], {
            is: () => field.validate.max.active,
            then: (schema: Yup.NumberSchema | Yup.StringSchema) =>
              schema.max(field.validate.max.value, field.validate.max.errorMessage),
          })
          .when([], {
            is: () => field.validate.pattern.active,
            then: (schema: Yup.StringSchema) =>
              schema.matches(field.validate.pattern.value, field.validate.pattern.errorMessage),
          }),
      };
    }, {})
  );

  const defaultValues = data.fields.reduce((acc: any, field: any) => {
    let value = field.value || '';
    if (value.includes('data_in:')) {
      const [, input] = field.value.replace(/\[|\]/g, '').split(':');
      value = input;
    }
    return {
      ...acc,
      [field.name]: value,
    };
  }, {});

  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit((formData: any) => {
    // console.log(formData);
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Typography variant="h6">{data.title}</Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: `repeat(${data.submit.column}, 1fr)`,
            gap: 2,
          }}
        >
          {Children.toArray(
            data.fields.map((field: any) => (
              <TextField fullWidth label={field.label} size="small" />
            ))
          )}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'end' }}>
          <Button
            variant="contained"
            sx={{
              borderRadius: 0.5,
              '&.Mui-disabled': {
                color: 'background.paper',
              },
            }}
          >
            {data.submit.button}
          </Button>
        </Box>
      </FormProvider>
    </Box>
  );
}
