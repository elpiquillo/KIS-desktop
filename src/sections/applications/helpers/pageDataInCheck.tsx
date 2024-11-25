import { ApiDataHandlerResponse } from 'src/types/queries-interface';

// FUNCTION TO Replace [data_in: 'value'] by final value
const PageDataInCheck = <T,>(
  dataParam: T,
  data_in: ApiDataHandlerResponse['queries'][number]['documents'][number]['data_link']
): T => {
  const data = dataParam as any;
  // -----------------------
  // TO DO DATA IN IF TYPE OF DATA IS NUMBER
  // -----------------------

  // Check if data include data_in
  const isDataIn = (dt: any) => dt.includes('data_in');

  // Check if data incude date
  const isDate = (dt: any) => {
    const strDt = JSON.stringify(dt);
    return strDt?.includes('date:');
  };

  const parseDate = (dt: string) => {
    const spl = dt.split(':');
    if (spl.length > 0) {
      const cut = spl[1].slice(0, -1).trim();
      const date = new Date();
      const cutNum = Number(cut);
      const nDate = Number(date.getDate()) + cutNum;
      if (Number.isNaN(nDate)) {
        return null;
      }
      date.setDate(nDate);
      return date.toISOString().split('T')[0];
    }
    return data;
  };

  if (data && data_in?.data) {
    // Find and replace if necessary data_in by final value
    const replaceValues = (dIn: string | null, datas: any) => {
      const dataToReplace = dIn || datas;
      const parse = () => {
        if (dataToReplace === dIn) {
          if (isDataIn(dataToReplace)) {
            return dataToReplace.split('"');
          }
          return dataToReplace;
        }
        return dataToReplace.replace(/\[|\]/g, '').split(':');
      };

      const objs = () => {
        if (dataToReplace === dIn) {
          if (isDataIn(dataToReplace)) {
            const reparse = parse()[3].replace(/\[|\]/g, '').split(':');
            if (reparse.length > 1) {
              const key = dIn?.split('"')[1];
              if (reparse[1].trim() === 'id' && key !== '_id') {
                return data_in.data._id.$oid;
              }

              const val = () => {
                if (reparse[1].trim() === '_id') {
                  return data_in.data[reparse[1].trim()].$oid;
                }
                return data_in.data[reparse[1].trim()];
              };

              const obj = `{"${key}": "${val()}"}`;
              return JSON.parse(obj);
            }
            return reparse[0];
          }
          return JSON.parse(dataToReplace);
        }

        if (parse()[1].trim() === 'id' || parse()[1].trim() === '_id') {
          return data_in.data._id.$oid;
        }

        // If no data (ex: button without dynamic data) return
        if (!data_in.data) {
          return null;
        }

        return data_in.data[parse()[1].trim()];
      };

      return objs() || '';
    };

    // Reconstruct final Object of data
    if (typeof data === 'object') {
      const tempObj = { ...data };
      if (JSON.stringify(tempObj).includes('$and')) {
        tempObj.$and[0].forEach((t_o: any, i: number) => {
          Object.keys(t_o).forEach((v) => {
            const str = JSON.stringify(tempObj.$and[0][i][v]);
            const finValue = replaceValues(str, data);
            tempObj.$and[0][i][v] = finValue;
          });
        });
        return tempObj;
      }
      Object.keys(tempObj).forEach((v) => {
        const str = JSON.stringify(tempObj[v]);
        const finValue = replaceValues(str, data);
        tempObj[v] = finValue;
      });
      return tempObj;
    }

    // If not an object check value directly
    let finalTxt = data;
    const txtSplit = finalTxt.split('[');
    txtSplit.forEach((t: string) => {
      if (isDataIn(t)) {
        const ts = t.split('data_in:');

        ts.forEach((ts_e) => {
          if (ts_e !== '') {
            const di = ts_e.split(']')[0];
            const fv = replaceValues(null, `[data_in:${di}]`);
            if (typeof fv === 'object') {
              finalTxt = fv;
            } else {
              finalTxt = finalTxt.replace(`[data_in:${di}]`, fv);
            }
          }
        });
      }
      if (isDate(t)) {
        const ts = t.split('date:');
        ts.forEach((ts_e) => {
          if (ts_e !== '') {
            const di = ts_e.split(']')[0];
            const fv = parseDate(`[date:${di}]`);
            finalTxt = finalTxt.replace(`[date:${di}]`, fv);
          }
        });
      }
    });

    return finalTxt;
  }

  if (isDate(data)) {
    let finalTxt = data;
    const txtSplit = finalTxt.split('[');
    txtSplit.forEach((t: string) => {
      if (isDate(t)) {
        const ts = t.split('date:');
        ts.forEach((ts_e) => {
          if (ts_e !== '') {
            const di = ts_e.split(']')[0];
            const fv = parseDate(`[date:${di}]`);
            finalTxt = finalTxt.replace(`[date:${di}]`, fv);
          }
        });
      }
    });
    return finalTxt;
  }

  return data;
};

export default PageDataInCheck;
