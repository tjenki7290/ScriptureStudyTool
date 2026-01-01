const express = require('express');
const router = express.Router();
const { chatCompletion } = require('../utils/openai');
const cache = require('../utils/cache');

// POST /api/explain
router.post('/explain', async (req, res) => {
  try {
    const { verseText, reference } = req.body;

    // Validation
    if (!verseText || !reference) {
      return res.status(400).json({
        error: 'Missing verseText or reference'
      });
    }

    // Check cache first
    const cacheKey = cache.generateKey('explain', reference);
    const cached = cache.get(cacheKey);

    if (cached) {
      return res.json(cached);
    }

    console.log(`📖 Explaining ${reference}...`);

    const prompt = `You are a biblical scholar. Explain ${reference} in exactly 5 concise bullet points. Keep each bullet to 1-2 sentences maximum. Focus on practical application and theological significance.

Verse: "${verseText}"

Respond with ONLY 5 bullet points, each starting with a dash (-). No introduction, no conclusion, just the 5 points.`;

    const result = await chatCompletion(
      [{ role: 'user', content: prompt }],
      {
        model: 'gpt-4',
        temperature: 0.7,
        max_tokens: 500
      }
    );

    if (!result.success) {
      console.error('OpenAI error:', result.error);
      return res.status(500).json({
        error: 'Failed to generate explanation',
        details: result.error
      });
    }

    // Parse bullet points
    const text = result.content || '';
    let bulletPoints = text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.startsWith('-') || line.match(/^\d+\./))
      .map(line => line.replace(/^[-\d.]\s*/, '').trim())
      .filter(line => line.length > 0)
      .slice(0, 5);

    console.log(`✅ Generated ${bulletPoints.length} bullet points`);

    const response = {
      reference,
      bulletPoints,
      usage: result.usage
    };

    // Store in cache (default 7 days)
    cache.set(cacheKey, response);

    return res.json(response);

  } catch (error) {
    console.error('Explain route error:', error);
    return res.status(500).json({
      error: 'Server error while generating explanation'
    });
  }
});

module.exports = router;
