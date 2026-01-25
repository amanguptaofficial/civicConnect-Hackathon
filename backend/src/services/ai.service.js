const OpenAI = require('openai');

let openai = null;

if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

const generateSummary = async (text) => {
  try {
    if (!openai || !process.env.OPENAI_API_KEY) {
      return null;
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that creates concise, professional summaries of civic proposals and feedback. Keep summaries under 150 words.',
        },
        {
          role: 'user',
          content: `Create a concise summary of this text: ${text}`,
        },
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content?.trim() || null;
  } catch (error) {
    console.error('OpenAI API Error:', error.message);
    return null;
  }
};

const analyzeSentiment = async (text) => {
  try {
    if (!openai || !process.env.OPENAI_API_KEY) {
      return 'neutral';
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Analyze the sentiment of the text and respond with only one word: positive, neutral, or negative.',
        },
        {
          role: 'user',
          content: `Analyze sentiment: ${text}`,
        },
      ],
      max_tokens: 10,
      temperature: 0.3,
    });

    const sentiment = response.choices[0]?.message?.content?.trim().toLowerCase();
    if (['positive', 'neutral', 'negative'].includes(sentiment)) {
      return sentiment;
    }
    return 'neutral';
  } catch (error) {
    console.error('OpenAI Sentiment Analysis Error:', error.message);
    return 'neutral';
  }
};

const generateCategorySuggestion = async (text) => {
  try {
    if (!openai || !process.env.OPENAI_API_KEY) {
      return null;
    }

    const categories = ['education', 'healthcare', 'infrastructure', 'environment', 'economy', 'social', 'other'];
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `Categorize this text into one of these categories: ${categories.join(', ')}. Respond with only the category name.`,
        },
        {
          role: 'user',
          content: `Categorize: ${text}`,
        },
      ],
      max_tokens: 20,
      temperature: 0.3,
    });

    const suggestedCategory = response.choices[0]?.message?.content?.trim().toLowerCase();
    if (categories.includes(suggestedCategory)) {
      return suggestedCategory;
    }
    return null;
  } catch (error) {
    console.error('OpenAI Category Suggestion Error:', error.message);
    return null;
  }
};

module.exports = {
  generateSummary,
  analyzeSentiment,
  generateCategorySuggestion,
};
