import { QueriesDispatch, QueryResult } from 'src/types/queries-interface';

const dispatchFetchedData = (content: {
  dataQueries: QueryResult[];
  dispatchQueries: QueriesDispatch[];
  finalData: {
    [key: string]: any;
  };
}): any => {
  const { dataQueries, dispatchQueries = [], finalData } = content;
  const tempBlockData = JSON.parse(JSON.stringify(finalData)) as typeof finalData;
  dispatchQueries.forEach((q_d) => {
    const findData = dataQueries.find((qv) => `${qv.query_id}` === `${q_d.query_id}`)!;
    if (findData?.documents.length) {
      q_d.destination_fields.forEach((d_f) => {
        const entries = Object.entries(d_f);
        const { documents } = findData;

        if (Object.hasOwnProperty.call(d_f, 'columns')) {
          if (Array.isArray(entries[0][1])) {
            entries[0][1].forEach((en) => {
              const arr_entries = Object.entries(en);
              if (Object.hasOwnProperty.call(en, 'content')) {
                if (entries[0][0] === 'columns') {
                  const datas = documents.map((a) => {
                    const col_cont = () => {
                      if (arr_entries[1][1] === 'id') {
                        return a._id.$oid;
                      }
                      return a[arr_entries[1][1]];
                    };
                    return {
                      column_content: col_cont(),
                      column_id: a._id.$oid,
                    };
                  });
                  const columns = [
                    {
                      id: en.id,
                      content: datas,
                    },
                  ];

                  if (tempBlockData.columns_content?.length) {
                    const colExist = tempBlockData.columns_content.find(
                      (td: any) => td.id === columns[0].id
                    );
                    if (colExist) {
                      const colIndex = tempBlockData.columns_content.findIndex(
                        (td: any) => td.id === columns[0].id
                      );
                      [tempBlockData.columns_content[colIndex]] = columns;
                    } else {
                      tempBlockData.columns_content.push(columns[0]);
                    }
                  } else {
                    tempBlockData.columns_content = columns;
                  }
                }
              }
            });
          }
        } else if (Object.hasOwnProperty.call(d_f, 'button_action')) {
          if (Array.isArray(entries[0][1])) {
            entries[0][1].forEach((en) => {
              if (Object.hasOwnProperty.call(en, 'content')) {
                if (entries[0][0] === 'button_action') {
                  const button_action = [
                    {
                      id: en.id,
                      content: q_d.query_id,
                    },
                  ];
                  if (tempBlockData.buttons_action_content?.length) {
                    tempBlockData.buttons_action_content.push(button_action[0]);
                  } else {
                    tempBlockData.buttons_action_content = button_action;
                  }
                }
              }
            });
          }
        } else if (Array.isArray(entries[0][1])) {
          entries[0][1].forEach((en, i) => {
            const arr_entries = Object.entries(en);
            if (Object.hasOwnProperty.call(en, 'content') && tempBlockData[entries[0][0]][i]) {
              tempBlockData[entries[0][0]][i].content = documents[0][arr_entries[1][1]];
            }
            if (Object.hasOwnProperty.call(en, 'columns')) {
              // TODO : impossible : entries[0][1] is an array not a string
              // tempBlockData[entries[0][1]][i].content =
              //   documents[0][arr_entries[1][1]];
            }
          });
        }
        if (documents.length) {
          if (typeof entries[0][1] === 'string' && documents[0][entries[0][1]]) {
            if (entries[0][0] === 'card_origin') {
              tempBlockData[entries[0][0]] = [documents[0]];
            } else {
              tempBlockData[entries[0][0]] = documents[0][entries[0][1]];
            }
          } else if ((entries[0][1] as any) === '@documents_size') {
            tempBlockData[entries[0][0]] = findData.documents_size;
          }
        }
      });
    }
  });

  return tempBlockData;
};

export default dispatchFetchedData;
