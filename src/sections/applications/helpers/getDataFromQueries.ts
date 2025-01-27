import { DataQuery, QueriesDispatch } from 'src/types/queries-interface';

const getDataFromQueries = (content: {
  queries: DataQuery[];
  queries_dispatch: QueriesDispatch[];
  field: string;
  type: 'collection_name' | 'collection_field';
}) => {
  const { queries, queries_dispatch, field, type } = content;

  let tempFinalData: any = '';
  queries_dispatch.forEach((q_d) => {
    const findData = queries.find((qv) => qv.id === q_d.query_id);

    if (findData) {
      q_d.destination_fields.forEach((d_f) => {
        const entries = Object.entries(d_f);
        if (entries[0][0] === field) {
          if (type === 'collection_name') {
            tempFinalData = findData.collection_name;
          }
          if (type === 'collection_field') {
            /* eslint-disable-next-line */
            tempFinalData = entries[0][1];
          }
        }
      });
    }
  });

  return tempFinalData;
};

export default getDataFromQueries;
