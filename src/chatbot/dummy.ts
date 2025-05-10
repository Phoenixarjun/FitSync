import { loadDocs } from './handlers/loadDocs';  // Adjust the path as needed

(async () => {
  try {
    // Load all the documents
    const docs = await loadDocs();
    
    // Check the result
    console.log('Loaded Documents:', docs);

    if (docs.length > 0) {
      console.log('Successfully loaded and parsed PDFs');
    } else {
      console.log('No PDFs found or PDFs are empty');
    }
  } catch (error) {
    console.error('Error in loading documents:', error);
  }
})();
