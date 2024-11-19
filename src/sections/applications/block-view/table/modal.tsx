import { Button, MenuItem, Popover, Stack } from '@mui/material';
import { t } from 'i18next';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';
import { DataQuery } from 'src/types/queries-interface';
import { useGetDataHandlersList } from 'src/apis/data-handler';
import { filterOperatorOptions } from './constants';
import PageDataInCheck from '../../helpers/pageDataInCheck';

interface Props {
  block: any;
  nameColumn: string;
  open: HTMLElement | null;
  onClose: () => void;
}

export default function FilterModal({ block, nameColumn, open, onClose }: Props) {
  const { getDataHandlers } = useGetDataHandlersList(block?.id);
  const { data } = block.blocs[0];
  const { filters } = data.queries[0];

  const path = window.location.href;
  const slplitPath = path.substring(path.lastIndexOf('/') + 1);

  const methods = useForm({
    defaultValues: {
      filter_column: '',
      filter_operator: '',
      filter_value: '',
    },
  });

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    const filter = filters.find((f: any) => f.filter_column === nameColumn);
    const initialValues = filter
      ? { ...filter }
      : { filter_column: nameColumn, filter_operator: '', filter_value: '' };
    reset(initialValues);
  }, [filters, nameColumn, reset]);

  const handleApplyFilter = handleSubmit((formData: any) => {
    const tempQueries: DataQuery[] = [];

    data.queries.forEach((q: any) => {
      const dataFilters = () => {
        if (q.filters) {
          const filtersJSON = JSON.stringify(q.filters);
          const filtersAfterCheck = PageDataInCheck(filtersJSON, '');

          return JSON.parse(filtersAfterCheck);
        }
        return q.filters;
      };

      const query = {
        id: q.id,
        url: q.url,
        page_id: q.page_id || slplitPath,
        collection_name: q.collection_name,
        limit: q.limit,
        filters: [...dataFilters(), formData],
        special_filters: q.special_filters || [],
      };

      tempQueries.push(query);
    });

    if (tempQueries.length) {
      getDataHandlers(tempQueries);
    }
  });

  const handleClose = () => {
    reset({});
    onClose();
  };

  return (
    <Popover
      open={!!open}
      anchorEl={open}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
    >
      <FormProvider methods={methods} onSubmit={handleApplyFilter}>
        <Stack width={200}>
          <Stack p={1}>
            <RHFSelect
              fullWidth
              name="filter_operator"
              size="small"
              margin="none"
              variant="outlined"
            >
              {filterOperatorOptions.map(({ label, value }) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </RHFSelect>
          </Stack>
          <Stack p={1} flexDirection="row">
            <RHFTextField
              fullWidth
              name="filter_value"
              size="small"
              margin="none"
              variant="outlined"
              type="text"
            />
          </Stack>
          <Stack direction="row" justifyContent="center" alignItems="center" spacing={2} p={1}>
            <Button fullWidth variant="outlined" type="submit">
              {t('applications.filter')}
            </Button>
            <Button fullWidth variant="outlined" color="error">
              {t('applications.delete')}
            </Button>
          </Stack>
        </Stack>
      </FormProvider>
    </Popover>
  );
}
