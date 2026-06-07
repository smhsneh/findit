import { tokenize } from './tokenizer.js';
import Document from '../models/Document.js';
import Term from '../models/Term.js';

export async function searchIndex(userId, query) {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return [];

  const totalDocs = await Document.countDocuments({ userId });
  if (totalDocs === 0) return [];

  const scores = new Map();

  for (const token of queryTokens) {
    const termDoc = await Term.findOne({ userId, term: token }).lean();
    if (!termDoc || !termDoc.postings) continue;

    const postingList = termDoc.postings;
    const docsContainingTerm = Object.keys(postingList).length;

    // Calculate IDF (Inverse Document Frequency)
    const idf = Math.log(1 + (totalDocs / docsContainingTerm));

    // Calculate TF and accumulate score
    for (const [docId, freq] of Object.entries(postingList)) {
      const doc = await Document.findOne({ _id: docId, userId }).lean();
      if (!doc) continue;

      const tf = freq / doc.length;
      const tfIdf = tf * idf;

      if (!scores.has(docId)) {
        scores.set(docId, {
          id: docId,
          fileName: doc.fileName,
          fileType: doc.fileType,
          score: 0,
          originalText: doc.originalText,
        });
      }

      scores.get(docId).score += tfIdf;
    }
  }

  // Generate snippets and format results
  const results = Array.from(scores.values()).map(docData => {
    let snippet = docData.originalText.substring(0, 150) + '...';
    const firstToken = queryTokens[0];
    const matchIdx = docData.originalText.toLowerCase().indexOf(firstToken);
    
    if (matchIdx !== -1) {
      const start = Math.max(0, matchIdx - 70);
      const end = Math.min(docData.originalText.length, matchIdx + 70);
      snippet = (start > 0 ? '...' : '') + 
                docData.originalText.substring(start, end).replace(/\n/g, ' ') + 
                (end < docData.originalText.length ? '...' : '');
    }

    return {
      id: docData.id,
      fileName: docData.fileName,
      fileType: docData.fileType,
      score: docData.score,
      snippet: snippet
    };
  });

  return results.sort((a, b) => b.score - a.score);
}
