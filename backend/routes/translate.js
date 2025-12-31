const express = require('express');
const router = express.Router();
const { chatCompletion } = require('../utils/openai');
const cache = require('../utils/cache');

// POST /api/translate
router.post('/translate', async (req, res) => {
  try {
    const { verseText, reference, testament } = req.body;
    
    // Validation
    if (!verseText || !reference || !testament) {
      return res.status(400).json({ 
        error: 'Missing verseText, reference, or testament' 
      });
    }
    
    const language = testament === 'NT' ? 'Greek' : 'Hebrew';
    const textType = testament === 'NT' ? 'NA28' : 'Biblia Hebraica Stuttgartensia';
    
    //cache check
    const cacheKey = cache.generateKey('translate', reference, { testament });
    const cached = cache.get(cacheKey);

    if (cached) {
    return res.json(cached);
    }

    console.log(`🔤 Getting ${language} translation for ${reference}...`);
    
    // Create very specific prompt for ChatGPT
    const prompt = `You are an expert in Biblical ${language} with access to ${textType}. Provide a word-by-word breakdown for ${reference} in this EXACT JSON format:

{
  "originalText": "Full verse in ${language} characters",
  "words": [
    {
      "original": "${language} word in original script",
      "transliteration": "Romanized transliteration",
      "strongs": "Strong's number (e.g., ${testament === 'NT' ? 'G3754' : 'H430'})",
      "meaning": "Primary English meaning (1-3 words)",
      "grammar": "Grammatical form (e.g., 'conjunction' or 'verb, aorist, active, indicative, 3rd person singular')"
    }
  ]
}

CRITICAL REQUIREMENTS:
1. Include EVERY word in the original ${language} text, in order
2. Strong's numbers MUST follow this format: ${testament === 'NT' ? 'G#### (Greek)' : 'H#### (Hebrew)'}
3. Use standard transliteration conventions
4. "meaning" should be concise (1-3 words maximum)
5. "grammar" should be detailed for verbs (tense/mood/voice/person/number) and basic for other parts of speech
6. Return ONLY valid JSON with no markdown formatting, no code blocks, no additional text

Verse for reference: "${verseText}"

Return ONLY the JSON object, nothing else.`;

    // Call OpenAI with specific instructions
    const result = await chatCompletion(
      [
        {
          role: 'system',
          content: `You are a Biblical ${language} expert. You MUST return valid JSON exactly matching the requested structure. Do not include markdown code blocks or any text outside the JSON object.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      { 
        model: 'gpt-4',
        temperature: 0.3, // Low temperature for consistency
        max_tokens: 2500
      }
    );
    
    if (!result.success) {
      console.error('OpenAI error:', result.error);
      return res.status(500).json({ 
        error: 'Failed to generate translation',
        details: result.error 
      });
    }
    
    // Parse JSON response - remove any markdown formatting
    let translation;
    try {
      let cleanedText = result.content.trim();
      
      // Remove markdown code blocks if present
      cleanedText = cleanedText.replace(/```json\n?/g, '');
      cleanedText = cleanedText.replace(/```\n?/g, '');
      cleanedText = cleanedText.trim();
      
      translation = JSON.parse(cleanedText);
      
      // Validate structure
      if (!translation.originalText || !translation.words || !Array.isArray(translation.words)) {
        throw new Error('Invalid translation structure');
      }
      
      // Validate each word has required fields
      translation.words.forEach((word, index) => {
        if (!word.original || !word.transliteration || !word.strongs || !word.meaning || !word.grammar) {
          throw new Error(`Word at index ${index} missing required fields`);
        }
      });
      
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Raw response:', result.content);
      return res.status(500).json({
        error: 'Failed to parse translation response',
        details: 'Invalid JSON format or missing required fields'
      });
    }
    
    console.log(`✅ Generated translation with ${translation.words.length} words`);
    
    const response = {
      reference,
      testament,
      language,
      translation,
      usage: result.usage
    };
    
    cache.set(cacheKey, response);
    res.json(response);
    
  } catch (error) {
    console.error('Translate route error:', error);
    res.status(500).json({ 
      error: 'Server error while generating translation' 
    });
  }
});

module.exports = router;