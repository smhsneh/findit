import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');
import mammoth from 'mammoth';

/**
 * Extracts raw text from a given file buffer based on its mimetype.
 * Supported types: PDF, DOCX, TXT.
 */
export async function extractText(buffer, mimetype) {
  try {
    if (mimetype === 'application/pdf') {
      const data = await pdf(buffer);
      return data.text;
    } 
    
    if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    }
    
    if (mimetype === 'text/plain') {
      return buffer.toString('utf-8');
    }

    throw new Error(`Unsupported file type: ${mimetype}`);
  } catch (error) {
    console.error('Text extraction failed:', error);
    throw error;
  }
}
