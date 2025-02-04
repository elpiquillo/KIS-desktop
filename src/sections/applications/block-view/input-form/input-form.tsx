import { Box, Card } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useDataLink } from 'src/hooks/use-data-link';
import { BlockInterface } from 'src/types/application/general-interface';
import { FieldData, InputFormData } from 'src/types/application/input-form-interface';
import { CustomFilter, DataQuery, Document, QueryResult } from 'src/types/queries-interface';
import InputFormContent from './form-content';
import PageDataInCheck from '../../helpers/pageDataInCheck';

interface Props {
  blockInfo: BlockInterface<InputFormData>;
  handleGetHandlers: (props: { additionalFilters?: CustomFilter[]; page?: number }) => Promise<{
    queriesRequest: DataQuery[];
    queriesResponse: QueryResult[];
  }>;
}

export default function InputFormView({ blockInfo, handleGetHandlers }: Props) {
  const {
    data: { fields, queries, queries_dispatch },
  } = blockInfo.blocs[0];
  const [fieldsData, setFieldsData] = useState<FieldData[]>(fields);

  const { data_link } = useDataLink();

  const handleGetFields = useCallback(async () => {
    const { queriesResponse } = await handleGetHandlers({});
    const final: {
      [key: string]: {
        content: string;
        target: string | undefined;
        docs: Document[];
      };
    } = {};
    queriesResponse.forEach((query) => {
      const found = queries_dispatch.find((e) => e.query_id === query.query_id);
      if (found) {
        found.destination_fields.forEach((dest_field) => {
          dest_field.columns.forEach((column) => {
            final[column.id] = {
              content: column.content,
              target: column.target,
              docs: query.documents,
            };
          });
        });
      }
    });
    const updatedFields = fields.map((field) => {
      const copyField = { ...field };
      if (field.type === 'select' && final[field.title])
        copyField.options = final[field.title].docs.map((e) => ({
          name: e[final[field.title].content] as string,
          value: (e[final[field.title].target!] || e._id.$oid) as string,
        }));
      copyField.value =
        typeof field.value === 'string' ? PageDataInCheck(field.value, data_link) : field.value;
      return copyField;
    });
    setFieldsData([...updatedFields]);
  }, [data_link, fields, handleGetHandlers, queries_dispatch]);

  useEffect(() => {
    if (queries?.length > 0) {
      handleGetFields();
    }
  }, [handleGetFields, queries?.length]);

  return (
    <Card
      sx={{
        // display: 'flex',
        // alignItems: 'center',
        p: 3,
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <InputFormContent blockInfo={blockInfo} fieldsData={fieldsData} />
      </Box>
    </Card>
  );
}
