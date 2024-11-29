export const getTestId = (id: string) =>
  process.env.NODE_ENV !== 'production' ? { 'data-testid': id } : {};
