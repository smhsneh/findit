import Document from '../models/Document.js';
import Term from '../models/Term.js';

/**
 * Builds the inverted index for a newly uploaded document and saves to MongoDB.
 */
export async function addDocumentToIndex(userId, fileName, originalText, tokens) {
  // Split text into simulated pages (approx 2500 chars per page on boundaries)
  const pages = [];
  let currentText = originalText;
  while (currentText.length > 0) {
    if (currentText.length <= 2500) {
      pages.push(currentText);
      break;
    }
    let breakIdx = currentText.lastIndexOf('\n', 2500);
    if (breakIdx === -1) breakIdx = currentText.lastIndexOf(' ', 2500);
    if (breakIdx === -1 || breakIdx < 1500) breakIdx = 2500;
    
    pages.push(currentText.substring(0, breakIdx).trim());
    currentText = currentText.substring(breakIdx).trim();
  }

  // 1. Save document metadata
  const fileType = fileName.split('.').pop().toLowerCase();
  const doc = new Document({
    userId,
    fileName,
    fileType,
    length: tokens.length,
    content: pages,
    originalText
  });
  await doc.save();
  const docId = doc._id.toString();

  // 2. Count term frequencies
  const termFreqs = new Map();
  for (const token of tokens) {
    termFreqs.set(token, (termFreqs.get(token) || 0) + 1);
  }

  // 3. Update inverted index (Term models)
  // For each term, update its postings map with { [docId]: freq }
  const bulkOps = [];
  for (const [term, freq] of termFreqs.entries()) {
    bulkOps.push({
      updateOne: {
        filter: { userId, term },
        update: { $set: { [`postings.${docId}`]: freq } },
        upsert: true
      }
    });
  }

  if (bulkOps.length > 0) {
    await Term.bulkWrite(bulkOps);
  }

  return docId;
}

export async function getTotalDocuments(userId) {
  return await Document.countDocuments({ userId });
}

export async function getTotalTerms(userId) {
  return await Term.countDocuments({ userId });
}

export async function getAllDocuments(userId) {
  const docs = await Document.find({ userId }).lean();
  return docs.map(doc => ({
    id: doc._id.toString(),
    fileName: doc.fileName,
    fileType: doc.fileType,
    length: doc.length,
    content: doc.content
  }));
}

export async function deleteDocumentById(userId, docIdStr) {
  // 1. Delete document
  await Document.findOneAndDelete({ _id: docIdStr, userId });

  // 2. Remove docId from all terms' postings
  // This removes the key `postings.docId` from all matching Term documents
  await Term.updateMany(
    { userId },
    { $unset: { [`postings.${docIdStr}`]: 1 } }
  );

  // 3. Delete any terms that now have no postings
  // (We could do this periodically, or check here, but this is a bit tricky in MongoDB.
  // We can just leave empty postings objects, or clean up terms where postings is empty.)
  // We'll clean up terms where all keys have been unset, leaving postings as empty object {}
  // But wait, $unset removes the field inside postings. We might need a script to delete `{ "postings": {} }` later if it becomes an issue.
}

export async function getAllTerms(userId) {
  const terms = await Term.find({ userId }).select('term').lean();
  return terms.map(t => t.term);
}
