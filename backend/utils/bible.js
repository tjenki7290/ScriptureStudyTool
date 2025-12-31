const fetch = require('node-fetch');

const ESV_API_URL = 'https://api.esv.org/v3/passage/text/';

/**
 * Fetch verse text from ESV API
 * @param {string} reference - e.g., "John 3:16" or "Romans 8:28-30"
 */
async function getVerseText(reference) {
  try {
    // Check if API key exists
    if (!process.env.ESV_API_KEY) {
      throw new Error('ESV_API_KEY not configured');
    }

    const params = new URLSearchParams({
      q: reference,
      'include-headings': 'false',
      'include-footnotes': 'false',
      'include-verse-numbers': 'false',
      'include-short-copyright': 'false',
      'include-passage-references': 'false'
    });

    const response = await fetch(`${ESV_API_URL}?${params}`, {
      headers: {
        'Authorization': `Token ${process.env.ESV_API_KEY}`
      }
    });

    if (!response.ok) {
      console.error('ESV API error:', response.status, response.statusText);
      throw new Error(`ESV API error: ${response.status}`);
    }

    const data = await response.json();

    // Check if passage exists
    if (!data.passages || data.passages.length === 0) {
      return {
        success: false,
        error: 'Verse not found. Check the reference and try again.'
      };
    }

    return {
      success: true,
      reference: data.canonical,  // Normalized reference (e.g., "John 3:16")
      text: data.passages[0].trim(),
      copyright: 'Scripture quotations are from the ESV® Bible'
    };

  } catch (error) {
    console.error('Bible API Error:', error.message);
    return {
      success: false,
      error: error.message || 'Failed to fetch verse'
    };
  }
}

module.exports = { getVerseText };