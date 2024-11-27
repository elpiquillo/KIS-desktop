import { Box, Button, Typography } from '@mui/material';
import React, { Children, useCallback, useEffect, useState } from 'react';
import FormProvider from 'src/components/hook-form';
import { useCreateDataHandlers } from 'src/apis/data-handler';
import { useParams } from 'src/routes/hooks';
import { DataQuery, QueryResult } from 'src/types/queries-interface';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { t } from 'i18next';
import { useSnackbar } from 'notistack';
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
  handleGetHandlers: (additionalFilters?: any[]) => {
    queriesRequest: DataQuery[];
    queriesResponse: QueryResult[];
  };
}

export default function InputFormView({ blockInfo, handleGetHandlers }: Props) {
  const {
    data: { title, submit, fields, queries, queries_dispatch },
  } = blockInfo.blocs[0];
  const [fieldsData, setFieldsData] = useState<any[]>(fields);
  const { pageId } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const { createDataHandlers } = useCreateDataHandlers(queries[0]);

  const handleGetFields = useCallback(async () => {
    const { queriesResponse } = await handleGetHandlers();
    const final: {
      [key: string]: {
        content: string;
        target: string | undefined;
        docs: QueryResult['documents'];
      };
    } = {};
    queriesResponse.forEach((query) => {
      const found = queries_dispatch.find((e: any) => e.query_id === query.query_id);
      if (found) {
        found.destination_fields.forEach((dest_field: any) => {
          dest_field.columns.forEach((column: any) => {
            final[column.id] = {
              content: column.content,
              target: column.target,
              docs: query.documents,
            };
          });
        });
      }
    });
    const updatedFields: any[] = fields.map((field: any) => {
      const copyField = { ...field };
      if (field.type === 'select' && final[field.title])
        copyField.options = final[field.title].docs.map((e) => ({
          name: e[final[field.title].content] as string,
          value: (e[final[field.title].target!] || e._id.$oid) as string,
        }));
      return copyField;
    });
    setFieldsData([...updatedFields]);
  }, [fields, handleGetHandlers, queries_dispatch]);

  useEffect(() => {
    if (queries?.length > 1) {
      handleGetFields();
    }
  }, [handleGetFields, queries?.length]);

  const validationSchema = Yup.object().shape(
    fieldsData.reduce((acc: any, field: any, index: number) => {
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

  const defaultValues = fieldsData.reduce((acc: any, field: any) => {
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
    reset,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (formData: any) => {
    await createDataHandlers({
      pageId: pageId || '?',
      document: formData,
    });

    enqueueSnackbar(t('applications.formCreatedSuccess'), {
      variant: 'success',
      anchorOrigin: { vertical: 'top', horizontal: 'center' },
    });
    reset({});
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
            fieldsData.map((field: any, index: number) => <Field data={field} index={index} />)
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
    </Box>
  );
}
