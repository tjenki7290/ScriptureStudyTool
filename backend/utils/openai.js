const OpenAI = require('openai');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Make a ChatGPT API call with error handling
 */
async function chatCompletion(messages, options = {}) {
  try {
    const response = await openai.chat.completions.create({
      model: options.model || 'gpt-4',
      messages: messages,
      temperature: options.temperature || 0.7,
      max_tokens: options.max_tokens || 1000
      // ← REMOVED ...options from here
    });
    
    return {
      success: true,
      content: response.choices[0].message.content,
      usage: response.usage
    };
  } catch (error) {
    console.error('OpenAI API Error:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = { openai, chatCompletion };