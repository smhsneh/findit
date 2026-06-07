import natural from 'natural';

/**
 * Tokenizes text, removes punctuation, converts to lowercase,
 * removes common stop-words, and stems words to their root form.
 * @param {string} text 
 * @returns {string[]} array of normalized tokens
 */
export function tokenize(text) {
  if (!text) return [];
  // tokenizeAndStem automatically lowercases, removes punctuation,
  // removes stop words, and applies the Porter Stemming algorithm.
  return natural.PorterStemmer.tokenizeAndStem(text);
}
