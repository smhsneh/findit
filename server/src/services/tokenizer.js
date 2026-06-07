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
  const tokens = natural.PorterStemmer.tokenizeAndStem(text);
  
  // Filter out random artifacts (numbers, single letters, weird encodings)
  // Keep only strictly alphabetical tokens that are 2+ characters
  return tokens.filter(token => /^[a-z]{2,}$/.test(token));
}
