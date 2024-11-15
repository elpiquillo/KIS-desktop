import { Box, Button, TextField, Typography } from '@mui/material';
import React, { Children } from 'react';
import FormProvider from 'src/components/hook-form';
import { useCreateDataHandlers } from 'src/apis/data-handler';
import { useParams } from 'src/routes/hooks';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Field from './field';

const defaultValueByTypeField: Record<any, any> = {
  text: '',
  'text-area': '',
  'plain-text': '',
  number: 0,
  date: '',
  checkbox: false,
  image: '',
  document: '',
  'hidden-field': '',
  select: '',
};

interface Props {
  blockInfo: any;
}

export default function InputFormView({ blockInfo }: Props) {
  const { pageId } = useParams();
  const { data } = blockInfo.blocs[0];

  const { createDataHandlers } = useCreateDataHandlers(data.queries[0]);

  const validationSchema = Yup.object().shape(
    data.fields.reduce((acc: any, field: any, index: number) => {
      if (['image', 'document'].includes(field.type)) {
        return {
          ...acc,
          [field.name]: Yup.lazy((value) => {
            switch (typeof value) {
              case 'object':
                return Yup.object().shape({
                  file_name: Yup.string().when([], {
                    is: () => field.validate.required.active,
                    then: (schema: Yup.NumberSchema | Yup.StringSchema) =>
                      schema.required(field.validate.required.errorMessage),
                  }),
                });
              case 'string':
                return Yup.string().when([], {
                  is: () => field.validate.required.active,
                  then: (schema: Yup.NumberSchema | Yup.StringSchema) =>
                    schema.required(field.validate.required.errorMessage),
                });
              default:
                return Yup.mixed();
            }
          }),
        };
      }

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
            is: () => field.validate.minLength.active,
            then: (schema: Yup.NumberSchema | Yup.StringSchema) =>
              schema.min(field.validate.minLength.value, field.validate.minLength.errorMessage),
          })
          .when([], {
            is: () => field.validate.maxLength.active,
            then: (schema: Yup.NumberSchema | Yup.StringSchema) =>
              schema.max(field.validate.maxLength.value, field.validate.maxLength.errorMessage),
          })
          .when([], {
            is: () => field.validate.pattern?.active,
            then: (schema: Yup.StringSchema) =>
              schema.matches(field.validate.pattern.value, field.validate.pattern.errorMessage),
          }),
      };
    }, {})
  );

  const defaultValues = data.fields.reduce((acc: any, field: any) => {
    let value = field.value.length ? field.value : defaultValueByTypeField[field.type];
    if (typeof value === 'string' && value.includes('data_in:')) {
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
    formState: { isSubmitting, errors },
  } = methods;

  const onSubmit = handleSubmit((formData: any) => {
    createDataHandlers({
      pageId: pageId || '?',
      document: formData,
    });
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Typography variant="h6">{data.title}</Typography>
        <Box
          sx={{
            my: 2,
            display: 'grid',
            gridTemplateColumns: `repeat(${data.submit.column}, 1fr)`,
            gap: 2,
          }}
        >
          {Children.toArray(
            data.fields.map((field: any, index: number) => <Field data={field} index={index} />)
          )}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'end' }}>
          <Button
            variant="contained"
            type="submit"
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
