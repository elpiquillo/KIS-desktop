/* eslint-disable no-param-reassign */
export const useGroupByWithIndex = (array: any[], key: string): Record<string, any> =>
  array.reduce((rv, x, index) => {
    (rv[x[key]] = rv[x[key]] || []).push({
      ...x,
      index,
    });
    return rv;
  }, {});
