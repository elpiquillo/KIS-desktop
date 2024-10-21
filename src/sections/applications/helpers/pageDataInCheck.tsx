/* eslint-disable @typescript-eslint/naming-convention */
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
  const is_data_in = (dt: any) => dt.includes('data_in');

  // Check if data incude date
  const is_date = (dt: any) => {
    const str_dt = JSON.stringify(dt);
    return str_dt?.includes('date:');
  };

  const parse_date = (dt: any) => {
    const spl = dt.split(':');
    if (spl.length > 0) {
      const cut = spl[1].slice(0, -1).trim();
      const date = new Date();
      const cutNum = Number(cut);
      const n_date = Number(date.getDate()) + cutNum;
      if (Number.isNaN(n_date)) {
        return null;
      }
      date.setDate(n_date);
      return date.toISOString().split('T')[0];
    }
    return data;
  };

  if (data && data_in?.data) {
    // Find and replace if necessary data_in by final value
    const replaceValues = (dIn: any, datas: any) => {
      const data_to_replace = dIn || datas;
      const parse = () => {
        if (data_to_replace === dIn) {
          if (is_data_in(data_to_replace)) {
            return data_to_replace.split('"');
          }
          return data_to_replace;
        }
        return data_to_replace.replace(/\[|\]/g, '').split(':');
      };

      const objs = () => {
        if (data_to_replace === dIn) {
          if (is_data_in(data_to_replace)) {
            const reparse = parse()[3].replace(/\[|\]/g, '').split(':');
            if (reparse.length > 1) {
              const key = dIn.split('"')[1];
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
          return JSON.parse(data_to_replace);
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
        tempObj.$and[0].forEach((t_o: any, i: any) => {
          Object.keys(t_o).forEach((v) => {
            const str = JSON.stringify(tempObj.$and[0][i][v]);
            const fin_value = replaceValues(str, data);
            tempObj.$and[0][i][v] = fin_value;
          });
        });
        return tempObj;
      }
      Object.keys(tempObj).forEach((v) => {
        const str = JSON.stringify(tempObj[v]);
        const fin_value = replaceValues(str, data);
        tempObj[v] = fin_value;
      });
      return tempObj;
    }

    // If not an object check value directly
    let final_txt = data;
    const txtSplit = final_txt.split('[');
    txtSplit.forEach((t: any) => {
      if (is_data_in(t)) {
        const ts = t.split('data_in:');

        ts.forEach((ts_e: any) => {
          if (ts_e !== '') {
            const d_i = ts_e.split(']')[0];
            const f_v = replaceValues(null, `[data_in:${d_i}]`);
            if (typeof f_v === 'object') {
              final_txt = f_v;
            } else {
              final_txt = final_txt.replace(`[data_in:${d_i}]`, f_v);
            }
          }
        });
      }
      if (is_date(t)) {
        const ts = t.split('date:');
        ts.forEach((ts_e: any) => {
          if (ts_e !== '') {
            const d_i = ts_e.split(']')[0];
            const f_v = parse_date(`[date:${d_i}]`);
            final_txt = final_txt.replace(`[date:${d_i}]`, f_v);
          }
        });
      }
    });

    return final_txt;
  }

  if (is_date(data)) {
    let final_txt = data;
    const txtSplit = final_txt.split('[');
    txtSplit.forEach((t: any) => {
      if (is_date(t)) {
        const ts = t.split('date:');
        ts.forEach((ts_e: any) => {
          if (ts_e !== '') {
            const d_i = ts_e.split(']')[0];
            const f_v = parse_date(`[date:${d_i}]`);
            final_txt = final_txt.replace(`[date:${d_i}]`, f_v);
          }
        });
      }
    });
    return final_txt;
  }

  return data;
};

export default PageDataInCheck;
