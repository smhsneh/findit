import express from 'express';
import multer from 'multer';
import { extractText } from '../services/parser.js';
import { tokenize } from '../services/tokenizer.js';
import { addDocumentToIndex, getAllDocuments, getTotalDocuments, getTotalTerms, deleteDocumentById, getAllTerms } from '../services/indexer.js';
import { searchIndex } from '../services/search.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Setup Multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Protect all API routes with auth middleware
router.use(authenticateToken);

// Upload & Index Endpoint
router.post('/upload', upload.array('documents'), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    
    let processedCount = 0;
    
    for (const file of req.files) {
      try {
        const text = await extractText(file.buffer, file.mimetype);
        const tokens = tokenize(text);
        
        if (tokens.length > 0) {
          await addDocumentToIndex(req.user.userId, file.originalname, text, tokens);
          processedCount++;
        }
      } catch (fileErr) {
        console.warn(`Failed to process file ${file.originalname}:`, fileErr.message);
      }
    }
    
    res.json({ message: `Successfully processed and indexed ${processedCount} files.` });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: 'Failed to process upload' });
  }
});

// Search Endpoint
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);
    
    const results = await searchIndex(req.user.userId, q);
    res.json(results);
  } catch (error) {
    console.error('Search Error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Stats Endpoint
router.get('/stats', async (req, res) => {
  try {
    res.json({
      totalDocs: await getTotalDocuments(req.user.userId),
      totalTerms: await getTotalTerms(req.user.userId)
    });
  } catch (err) {
    res.status(500).json({ error: 'Stats failed' });
  }
});

// Documents Endpoint
router.get('/documents', async (req, res) => {
  try {
    const docs = await getAllDocuments(req.user.userId);
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: 'Documents failed' });
  }
});

// Terms Endpoint
router.get('/terms', async (req, res) => {
  try {
    const terms = await getAllTerms(req.user.userId);
    res.json(terms.slice(0, 500));
  } catch (err) {
    res.status(500).json({ error: 'Terms failed' });
  }
});

// Delete Document Endpoint
router.delete('/documents/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await deleteDocumentById(req.user.userId, id);
    res.json({ success: true });
  } catch (error) {
    console.error('Delete Error:', error);
    res.status(500).json({ error: 'Failed to delete document' });
  }
});

export default router;
