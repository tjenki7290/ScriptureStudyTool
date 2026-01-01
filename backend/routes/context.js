const express = require('express');
const router = express.Router();
const { chatCompletion } = require('../utils/openai');
const cache = require('../utils/cache');

// POST /api/context
router.post('/context', async (req, res) => {
  try {
    const { verseText, reference } = req.body;

    // Validation
    if (!verseText || !reference) {
      return res.status(400).json({
        error: 'Missing verseText or reference'
      });
    }

    // Check cache first
    const cacheKey = cache.generateKey('context', reference);
    const cached = cache.get(cacheKey);

    if (cached) {
      return res.json(cached);
    }

    console.log(`📜 Getting context for ${reference}...`);

    const prompt = `You are a biblical historian and scholar. Provide detailed historical and literary context for ${reference} in this exact JSON format:

{
  "author": "Author name and brief background (2-3 sentences)",
  "audience": "Who they're writing to and why (2-3 sentences)",
  "dateWritten": "Approximate date and historical period (1-2 sentences)",
  "geographicalContext": "Relevant geographical details and significance (2-3 sentences)",
  "politicalContext": "Political situation and relevance (2-3 sentences)",
  "culturalContext": "Cultural practices, customs, or societal norms relevant to understanding this verse (2-3 sentences)",
  "literaryContext": "Where this fits in the book's structure and argument (2-3 sentences)"
}

Verse: "${verseText}"

Be specific and scholarly but accessible. Include dates, names, and concrete details. Return ONLY valid JSON with no additional commentary.`;

    const result = await chatCompletion(
      [
        {
          role: 'system',
          content: 'You are a Biblical historian expert. Always return valid JSON exactly matching the requested structure.'
        },
        { role: 'user', content: prompt }
      ],
      {
        model: 'gpt-4',
        temperature: 0.6,
        max_tokens: 1000
      }
    );

    if (!result.success) {
      console.error('OpenAI error:', result.error);
      return res.status(500).json({
        error: 'Failed to generate context',
        details: result.error
      });
    }

    // Parse JSON response
    let context;
    try {
      const cleanedText = result.content.replace(/```json|```/g, '').trim();
      context = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Raw response:', result.content);
      return res.status(500).json({
        error: 'Failed to parse context response',
        details: 'Invalid JSON format'
      });
    }

    console.log(`✅ Generated context for ${reference}`);

    const response = {
      reference,
      context,
      usage: result.usage
    };

    // Store in cache (7 days default)
    cache.set(cacheKey, response);

    return res.json(response);

  } catch (error) {
    console.error('Context route error:', error);
    return res.status(500).json({
      error: 'Server error while generating context'
    });
  }
});

module.exports = router;
