export const stringToBoolean = (str: string): boolean | null => {
  if (!str) {
    return null;
  }

  if (str.toLowerCase() === 'true') {
    return true;
  }
  if (str.toLowerCase() === 'false') {
    return false;
  }

  return null; // Add this line to handle other cases
};

export const stringToNumber = (str: string): number | null => {
  const num = Number(str);
  return Number.isNaN(num) ? null : num;
};
