// @ts-check

/**
 * @param {string} words
 */
export function dashToCamel(words) {
  return words
    .split('-')
    .map(word => word[0].toUpperCase() + word.slice(1))
    .join('');
}
