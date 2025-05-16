import * as fs from 'fs';
import * as path from 'path';
import pdfParse from 'pdf-parse';

/**
 * Extract text from a single PDF file
 * @param filePath - Absolute path to the PDF file
 * @returns {Promise<string>}
 */
export const extractTextFromPDF = async (filePath: string): Promise<string> => {
  try {
    const dataBuffer = await fs.promises.readFile(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } catch (error: unknown) {
    console.error('Error reading PDF:', error);
    throw new Error(`Failed to extract text from PDF: ${(error as Error).message}`);
  }
};

/**
 * Load and extract text from all PDFs in a given folder
 * @param folderPath - Absolute path to the folder
 * @returns {Promise<string[]>}
 */
export const loadAllPDFs = async (folderPath: string): Promise<string[]> => {
  try {
    const stats = await fs.promises.stat(folderPath);
    if (!stats.isDirectory()) {
      throw new Error(`Provided path is not a directory: ${folderPath}`);
    }

    const files = await fs.promises.readdir(folderPath);
    const pdfFiles = files.filter(file => path.extname(file).toLowerCase() === '.pdf');

    if (pdfFiles.length === 0) {
      console.warn(`No PDF files found in: ${folderPath}`);
      return [];
    }

    const texts = await Promise.all(
      pdfFiles.map(async (file) => {
        const fullPath = path.join(folderPath, file);
        return extractTextFromPDF(fullPath);
      })
    );

    return texts.filter(text => text.trim().length > 0);
  } catch (error: unknown) {
    console.error('Error loading PDFs:', error);
    throw new Error(`Failed to load PDFs: ${(error as Error).message}`);
  }
};
