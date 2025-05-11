import { loadDocs } from './loadDocs';

/**
 * Naive custom text splitter that chunks strings by size with overlap.
 */
function customSplit(text: string, chunkSize: number, chunkOverlap: number): string[] {
  const chunks: string[] = [];
  let i = 0;

  while (i < text.length) {
    const chunk = text.slice(i, i + chunkSize);
    chunks.push(chunk);
    i += chunkSize - chunkOverlap;
  }

  return chunks;
}

export const splitDocs = async (): Promise<string[]> => {
  try {
    const docs = await loadDocs();
    const chunkSize = 2000;
    const chunkOverlap = 500;

    const splitContent: string[] = docs.flatMap((doc: string) =>
      customSplit(doc, chunkSize, chunkOverlap)
    );

    return splitContent;
  } catch (error) {
    console.error('Error splitting documents:', error);
    throw new Error('Failed to split documents');
  }
};
