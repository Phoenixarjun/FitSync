import { loadAllPDFs } from '../utils/pdfUtils';
import * as path from 'path';

/**
 * Function to load and return all the text from PDF documents
 * @returns {Promise<string[]>} - The array of text contents from all PDFs in the 'docs' folder
 */
export const loadDocs = async (): Promise<string[]> => {
  try {
    // Using process.cwd() to get the root directory of the project
    const docsFolderPath = path.join(process.cwd(), 'docs');
    
    console.log(`Loading documents from: ${docsFolderPath}`);
    const pdfContents = await loadAllPDFs(docsFolderPath);
    
    if (pdfContents.length === 0) {
      console.warn('No PDF content was loaded. Check if PDF files exist in the docs folder.');
    } else {
      console.log(`Successfully loaded ${pdfContents.length} PDF document(s)`);
    }
    
    return pdfContents;
  } catch (error) {
    console.error('Error loading documents:', error);
    throw new Error(`Failed to load documents: ${error instanceof Error ? error.message : String(error)}`);
  }
};