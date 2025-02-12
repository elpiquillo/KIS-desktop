/**
 * Checks if the current environment is Electron.
 *
 * This function determines if the code is running in an Electron environment by checking:
 * 1. If `window` is defined and `window.process.type` is 'renderer'.
 * 2. If `process` is defined and `process.versions.electron` exists.
 * 3. If `navigator.userAgent` contains the string 'Electron'.
 *
 * @returns {boolean} `true` if the environment is Electron, otherwise `false`.
 */
export const isElectron = (): boolean => {
  if (
    typeof window !== 'undefined' &&
    typeof window.process === 'object' &&
    window.process.type === 'renderer'
  ) {
    return true;
  }

  if (
    typeof process !== 'undefined' &&
    typeof process.versions === 'object' &&
    !!process.versions.electron
  ) {
    return true;
  }

  if (
    typeof navigator === 'object' &&
    typeof navigator.userAgent === 'string' &&
    navigator.userAgent.indexOf('Electron') >= 0
  ) {
    return true;
  }

  return false;
};
