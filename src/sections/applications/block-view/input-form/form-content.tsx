import { Box, Button, Typography } from '@mui/material';
import React, { Children, useEffect, useMemo } from 'react';
import FormProvider from 'src/components/hook-form';
import { useCreateDataHandlers, useUpdateDataHandlers } from 'src/apis/data-handler';
import { useParams } from 'src/routes/hooks';
import { refreshDataLink, useDataLink } from 'src/hooks/use-data-link';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { t } from 'i18next';
import { useSnackbar } from 'notistack';
import { FieldData, InputFormData } from 'src/types/application/input-form-interface';
import { Document } from 'src/types/queries-interface';
import Field from './field';

const defaultValueByTypeField: Record<string, string | number | boolean> = {
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
  blockInfo: { blocs: InputFormData[] };
  fieldsData: FieldData[];
}

export default function InputFormContent({ blockInfo, fieldsData }: Props) {
  const {
    data: { title, type, submit, queries },
  } = blockInfo.blocs[0];
  const { enqueueSnackbar } = useSnackbar();
  const { pageId } = useParams();
  const { data_link } = useDataLink();

  const { createDataHandlers } = useCreateDataHandlers(queries?.[0]);
  const { updateDataHandlers } = useUpdateDataHandlers(queries?.[0]);

  const validationSchema = Yup.object().shape(
    fieldsData.reduce((acc: any, field) => {
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
              schema.min(+field.validate.minLength.value, field.validate.minLength.errorMessage),
          })
          .when([], {
            is: () => field.validate.maxLength.active,
            then: (schema: Yup.NumberSchema | Yup.StringSchema) =>
              schema.max(+field.validate.maxLength.value, field.validate.maxLength.errorMessage),
          })
          .when([], {
            is: () => field.validate.pattern?.active,
            then: (schema: Yup.StringSchema) =>
              schema.matches(
                new RegExp(field.validate.pattern?.value.toString() || ''),
                field.validate.pattern?.errorMessage
              ),
          }),
      };
    }, {})
  );

  const defaultFormValues = useMemo(
    () =>
      fieldsData.reduce((acc: Record<string, string | number | boolean>, field: FieldData) => {
        let value =
          typeof field.value === 'string' && field.value.length
            ? field.value
            : defaultValueByTypeField[field.type];
        if (typeof value === 'string' && value.includes('data_in:')) {
          const [, input] = (field.value as string).replace(/\[|\]/g, '').split(':');
          [, value] = input.split(' ');
        }
        return {
          ...acc,
          [field.name]: value,
        };
      }, {}),
    [fieldsData]
  );

  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: defaultFormValues,
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    reset(defaultFormValues);
  }, [defaultFormValues, reset]);

  const onSubmit = handleSubmit(async (formData: Record<string, string | number | boolean>) => {
    try {
      if (type === 'update') {
        await updateDataHandlers({
          pageId: pageId || '?',
          document: {
            ...formData,
            _id: {
              $oid: data_link!.data._id.$oid,
            },
          } as Document,
        });
        refreshDataLink(queries[0].collection_name, data_link!.data._id.$oid);

        enqueueSnackbar(t('applications.formUpdatedSuccess'), {
          variant: 'success',
          anchorOrigin: { vertical: 'top', horizontal: 'center' },
        });
      } else {
        await createDataHandlers({
          pageId: pageId || '?',
          documents: [formData as Document],
        });

        enqueueSnackbar(t('applications.formCreatedSuccess'), {
          variant: 'success',
          anchorOrigin: { vertical: 'top', horizontal: 'center' },
        });
        reset({});
      }
    } catch (err) {
      enqueueSnackbar(t('applications.somethingWentWrong'), {
        variant: 'error',
        anchorOrigin: { vertical: 'top', horizontal: 'center' },
      });
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Typography variant="h6">{title}</Typography>
      <Box
        sx={{
          my: 2,
          display: 'grid',
          gridTemplateColumns: `repeat(${submit.column}, 1fr)`,
          gap: 2,
        }}
      >
        {Children.toArray(
          fieldsData.map((field, index: number) => <Field data={field} index={index} />)
        )}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'end' }}>
        <Button
          variant="contained"
          type="submit"
          disabled={isSubmitting}
          sx={{
            borderRadius: 0.5,
            '&.Mui-disabled': {
              color: 'background.paper',
            },
          }}
        >
          {submit.button}
        </Button>
      </Box>
    </FormProvider>
  );
}
