import * as fs from 'fs';
import * as path from 'path';
const pdfParse = require('pdf-parse'); 

/**
 * Function to extract text from a PDF file
 * @param filePath - The file path of the PDF
 * @returns {Promise<string>}
 */
export const extractTextFromPDF = async (filePath: string): Promise<string> => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer); 
    return data.text;
  } catch (error) {
    console.error('Error reading PDF:', error);
    throw new Error(`Failed to extract text from PDF: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Function to load all PDF files from a folder
 * @param folderPath - The folder path to load PDFs from
 * @returns {Promise<string[]>} - A list of texts extracted from all PDFs
 */
export const loadAllPDFs = async (folderPath: string): Promise<string[]> => {
  try {
    // Check if folder exists
    if (!fs.existsSync(folderPath)) {
      throw new Error(`Folder does not exist: ${folderPath}`);
    }

    // Check if folder is actually a directory
    const stats = fs.statSync(folderPath);
    if (!stats.isDirectory()) {
      throw new Error(`Path is not a directory: ${folderPath}`);
    }

    const files = fs.readdirSync(folderPath);
    const pdfFiles = files.filter(file => path.extname(file).toLowerCase() === '.pdf');

    if (pdfFiles.length === 0) {
      console.warn(`No PDF files found in directory: ${folderPath}`);
      return [];
    }

    const pdfTexts = await Promise.all(
      pdfFiles.map(async (pdfFile) => {
        const pdfFilePath = path.join(folderPath, pdfFile);
        return await extractTextFromPDF(pdfFilePath);
      })
    );

    return pdfTexts.filter(text => text.trim().length > 0); 
  } catch (error) {
    console.error('Error loading PDFs:', error);
    throw new Error(`Failed to load PDFs: ${error instanceof Error ? error.message : String(error)}`);
  }
};
