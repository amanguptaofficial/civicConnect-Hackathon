const PolicyProposal = require('../models/PolicyProposal');
const Feedback = require('../models/Feedback');
const Comment = require('../models/Comment');

const globalSearch = async (req, res, next) => {
  try {
    const { q, type = 'all', page = 1, limit = 10 } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        error: { message: 'Search query is required' },
      });
    }

    const results = {
      proposals: [],
      feedback: [],
      comments: [],
    };

    if (type === 'all' || type === 'proposals') {
      const proposals = await PolicyProposal.find({
        $text: { $search: q },
        isPublic: true,
      })
        .populate('authorId', 'firstName lastName')
        .select('title description category status upvotes createdAt')
        .limit(parseInt(limit))
        .skip((page - 1) * limit)
        .exec();

      results.proposals = proposals;
    }

    if (type === 'all' || type === 'feedback') {
      const feedback = await Feedback.find({
        $text: { $search: q },
      })
        .populate('userId', 'firstName lastName')
        .populate('policyProposalId', 'title')
        .select('title content category status createdAt')
        .limit(parseInt(limit))
        .skip((page - 1) * limit)
        .exec();

      results.feedback = feedback;
    }

    if (type === 'all' || type === 'comments') {
      const comments = await Comment.find({
        $text: { $search: q },
      })
        .populate('userId', 'firstName lastName')
        .select('content createdAt')
        .limit(parseInt(limit))
        .skip((page - 1) * limit)
        .exec();

      results.comments = comments;
    }

    res.json({
      success: true,
      data: results,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  globalSearch,
};
