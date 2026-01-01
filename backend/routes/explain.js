const express = require('express');
const router = express.Router();
const { chatCompletion } = require('../utils/openai');


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
    
    console.log(`📖 Explaining ${reference}...`);
    
    // Create prompt for ChatGPT
    const prompt = `You are a biblical scholar. Explain ${reference} in exactly 5 concise bullet points. Keep each bullet to 1-2 sentences maximum. Focus on practical application and theological significance.

Verse: "${verseText}"

Respond with ONLY 5 bullet points, each starting with a dash (-). No introduction, no conclusion, just the 5 points.`;

    // Call OpenAI
    const result = await chatCompletion(
      [{ role: 'user', content: prompt }],
      { 
        model: 'gpt-4',
        temperature: 0.7,
        maxTokens: 500 
      }
    );
    
    if (!result.success) {
      console.error('OpenAI error:', result.error);
      return res.status(500).json({ 
        error: 'Failed to generate explanation',
        details: result.error 
      });
    }
    
    // Parse bullet points from response
    const text = result.content;
    let bulletPoints = text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.startsWith('-') || line.match(/^\d+\./))
      .map(line => line.replace(/^[-\d.]\s*/, '').trim())
      .filter(line => line.length > 0);
    
    // Ensure we have exactly 5 points
    bulletPoints = bulletPoints.slice(0, 5);
    
    console.log(`✅ Generated ${bulletPoints.length} bullet points`);
    
    res.json({ 
      reference,
      bulletPoints,
      usage: result.usage
    });
    
  } catch (error) {
    console.error('Explain route error:', error);
    res.status(500).json({ 
      error: 'Server error while generating explanation' 
    });
  }
});

module.exports = router;