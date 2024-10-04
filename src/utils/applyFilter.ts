export function removeAccents(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // NFD décompose les accents
}

export function applyFilter<T>({
  inputData,
  comparator,
  searchValue,
  filterFunction,
}: {
  inputData: T[];
  comparator: (a: T, b: T) => number;
  searchValue: string;
  filterFunction: (item: T, searchValue: string) => boolean;
  isUserTagsList?: boolean;
}): T[] {
  const searchValueWithoutAccents = removeAccents(searchValue.toLowerCase());
  let arrayInputData: any[] = [];
  let stabilizedThis = [];

  arrayInputData = !searchValue
    ? Object.entries(inputData || {})
    : Object.entries(inputData || {}).filter(([_, value]) =>
        filterFunction(value, searchValueWithoutAccents)
      );

  // Stabilization of the array before sorting
  stabilizedThis = arrayInputData.map(
    ([_, value], index) =>
      [
        {
          ...value,
        },
        index,
      ] as const
  );

  // Sorting the array based on the comparator function
  const stabilizedDataToReturn = stabilizedData(stabilizedThis, comparator);
  // Extraction of the final data
  return stabilizedDataToReturn.map((el) => el[0]);
}

const stabilizedData = (stabilizedThis: any[], comparator: (a: any, b: any) => number) =>
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);

    if (order !== 0) return order;

    return a[1] - b[1];
  });
