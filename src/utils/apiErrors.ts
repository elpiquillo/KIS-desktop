const apiErrors = {
  UNKNOW_ERROR: 'An unknow error occured',
  WRONG_CREDENTIALS: 'Invalid login credentials. Please try again.',
  NOT_LOGGUED: 'Invalid login credentials',
  COLLECTION_REQUIRED: 'Collection is required',
  NAME_ALREADY_EXISTS: 'Name has already been taken',
  EMAIL_ALREADY_EXISTS: 'Email has already been taken',
} as const;

export type ApiError = keyof typeof apiErrors;
export type ApiCatchedError = { message: ApiError };

export function getErrorCode(errorString?: string) {
  const cleanString = (str: string) => str.trim().toLowerCase();

  if (!errorString) {
    return 'UNKNOW_ERROR' as ApiError;
  }

  const res = Object.entries(apiErrors).find((ent) => {
    const val = ent[1];
    if (cleanString(errorString).indexOf(cleanString(val)) !== -1) {
      return true;
    }
    return false;
  });
  if (res) {
    return res[0] as ApiError;
  }

  return 'UNKNOW_ERROR' as ApiError;
}
