const { generateSummary, analyzeSentiment, generateCategorySuggestion } = require('../services/ai.service');

const generateProposalSummary = async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text || text.length < 20) {
      return res.status(400).json({
        success: false,
        error: { message: 'Text must be at least 20 characters' },
      });
    }

    const summary = await generateSummary(text);
    const sentiment = await analyzeSentiment(text);
    const category = await generateCategorySuggestion(text);

    res.json({
      success: true,
      data: {
        summary,
        sentiment,
        category,
      },
    });
  } catch (error) {
    next(error);
  }
};

const analyzeText = async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        error: { message: 'Text is required' },
      });
    }

    const [summary, sentiment, category] = await Promise.all([
      generateSummary(text),
      analyzeSentiment(text),
      generateCategorySuggestion(text),
    ]);

    res.json({
      success: true,
      data: {
        summary,
        sentiment,
        category,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateProposalSummary,
  analyzeText,
};
