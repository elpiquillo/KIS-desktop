/**
 * Gets the last segment of a given URL.
 * @param {string} url - The URL from which to extract the last segment.
 * @returns {string} The last segment of the URL.
 */
export const getLastSegment = (url: string) => {
  const segments = url.split('/').filter((segment) => segment);
  return segments.pop();
};
