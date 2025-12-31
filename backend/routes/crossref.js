const express = require('express');
const router = express.Router();
const { chatCompletion } = require('../utils/openai');
const cache = require('../utils/cache');

//POST /api/crossref
router.post('/crossref', async (req, res) => {
    try {
        const { verseText, reference } = req.body;
    
    // Validation
    if (!verseText || !reference) {
      return res.status(400).json({ 
        error: 'Missing verseText or reference' 
      });
    }

    const cacheKey = cache.generateKey('crossref', reference);
    const cached = cache.get(cacheKey);
    
    if (cached) {
      return res.json(cached);
    }
    
    console.log(`Gathering CrossRefs ${reference}...`);

    //create prompt for chatGPT
    const prompt = `You are a biblical historian and scholar. Provide the strongest Scripture cross-references for ${reference} in this exact JSON format:

{
  "primaryTheme": "The central theological or literary theme of the verse/passage (1 sentence)",
  "crossReferences": [
    {
      "reference": "Book Chapter:Verse(s)",
      "type": "Direct verbal echo | Thematic development | Typology | Parallel wisdom | NT fulfillment",
      "explanation": "Why this passage is strongly connected (1–2 sentences)"
    }
  ]
}

Rules:
• List the top 5 strongest cross-references only.
• If fewer than 5 genuinely strong cross-references exist, include fewer.
• Prioritize clear textual echoes, shared imagery, or repeated covenant language.
• Avoid weak or generic thematic connections.
• Scripture must interpret Scripture (no speculative allegory).
• Explanations should be scholarly but concise.

Verse: "${verseText}"

Return ONLY valid JSON with no additional commentary.`;

// Call OpenAI
const result = await chatCompletion(
    [
      {
        role: 'system',
        content: 'You are a Biblical historian expert. Always return valid JSON exactly matching the requested structure.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    { 
      model: 'gpt-4',
      temperature: 0.6,
      max_tokens: 800
    }
  );
  
  if (!result.success) {
    console.error('OpenAI error:', result.error);
    return res.status(500).json({ 
      error: 'Failed to generate cross references',
      details: result.error 
    });
  }
  
  // Parse JSON response
  let crossref;
  try {
    const cleanedText = result.content.replace(/```json|```/g, '').trim();
    crossref = JSON.parse(cleanedText);
  } catch (parseError) {
    console.error('JSON parse error:', parseError);
    console.error('Raw response:', result.content);
    return res.status(500).json({
      error: 'Failed to parse cross-reference response',
      details: 'Invalid JSON format'
    });
  }
  
  console.log(`✅ Generated cross-references for ${reference}`);
  
  const response = {
    reference,
    crossref,
    usage: result.usage
  };
  
  cache.set(cacheKey, response);
  res.json(response);
  
  
    } catch (error) {
        console.error('Context route error:', error);
        res.status(500).json({ 
          error: 'Server error while generating context' 
        });
      }

});

module.exports = router;