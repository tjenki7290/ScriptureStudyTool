const express = require('express');
const router = express.Router();
const { getVerseText } = require('../utils/bible');

router.post('/validate-verse', async (req, res) => {
  try {
    const { input } = req.body;
    
    // Check for empty input
    if (!input || input.trim().length === 0) {
      return res.status(400).json({ 
        valid: false, 
        error: 'Please enter a verse reference' 
      });
    }
    
    const trimmedInput = input.trim();
    
    // Use ESV API to validate AND fetch text
    const result = await getVerseText(trimmedInput);
    
    if (!result.success) {
      return res.status(400).json({
        valid: false,
        error: result.error || 'Invalid verse reference. Try format like "John 3:16"'
      });
    }
    
    // **NEW: Check if ESV API returned a different verse than requested**
    // This happens when the verse doesn't exist
    const normalizedInput = normalizeReference(trimmedInput);
    const normalizedResult = normalizeReference(result.reference);
    
    if (normalizedInput !== normalizedResult) {
      return res.status(400).json({
        valid: false,
        error: `Verse not found. "${trimmedInput}" does not exist. Did you mean "${result.reference}"?`
      });
    }
    
    // Parse reference to extract book, chapter, verse
    const reference = result.reference;
    const lastSpaceIndex = reference.lastIndexOf(' ');
    const book = reference.substring(0, lastSpaceIndex);
    const chapterVerse = reference.substring(lastSpaceIndex + 1);
    const [chapter, verse] = chapterVerse.split(':');
    
    // Determine testament
    const testament = getTestament(book);
    
    res.json({
      valid: true,
      reference: reference,
      verseText: result.text,
      book: book,
      chapter: parseInt(chapter),
      verse: verse,
      testament: testament,
      copyright: result.copyright
    });
    
  } catch (error) {
    console.error('Validation error:', error);
    res.status(500).json({ 
      valid: false, 
      error: 'Server error while validating verse' 
    });
  }
});

// Helper to normalize references for comparison
function normalizeReference(ref) {
  return ref
    .trim()
    .toLowerCase()
    .replace(/[–—]/g, '-')   // normalize en-dash & em-dash → hyphen
    .replace(/\s+/g, ' ');
}


// Helper to determine Old Testament vs New Testament
function getTestament(book) {
  const ntBooks = [
    'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', 
    '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians',
    'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians',
    '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews',
    'James', '1 Peter', '2 Peter', '1 John', '2 John', '3 John',
    'Jude', 'Revelation'
  ];
  
  return ntBooks.includes(book) ? 'NT' : 'OT';
}

module.exports = router;