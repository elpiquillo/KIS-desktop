import { Box, Card } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { DataQuery, QueryResult } from 'src/types/queries-interface';
import { useDataLink } from 'src/hooks/use-data-link';
import PageDataInCheck from '../../helpers/pageDataInCheck';
import InputFormContent from './form-content';

interface Props {
  blockInfo: any;
  handleGetHandlers: (props: { additionalFilters?: any[]; page?: number }) => {
    queriesRequest: DataQuery[];
    queriesResponse: QueryResult[];
  };
}

export default function InputFormView({ blockInfo, handleGetHandlers }: Props) {
  const {
    data: { fields, queries, queries_dispatch },
  } = blockInfo.blocs[0];
  const [fieldsData, setFieldsData] = useState<any[]>(fields);

  const { data_link } = useDataLink();

  const handleGetFields = useCallback(async () => {
    const { queriesResponse } = await handleGetHandlers({});
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
      copyField.value =
        typeof field.value === 'string' ? PageDataInCheck(field.value, data_link) : field.value;
      return copyField;
    });
    setFieldsData([...updatedFields]);
  }, [data_link, fields, handleGetHandlers, queries_dispatch]);

  useEffect(() => {
    if (queries?.length > 1) {
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
