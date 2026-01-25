const Analytics = require('../models/Analytics');
const PolicyProposal = require('../models/PolicyProposal');
const Feedback = require('../models/Feedback');
const Vote = require('../models/Vote');
const User = require('../models/User');

const getDashboardData = async (req, res, next) => {
  try {
    const { startDate, endDate, category } = req.query;

    const query = {};
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    if (category) query.category = category;

    const totalProposals = await PolicyProposal.countDocuments(query);
    const totalFeedback = await Feedback.countDocuments(query);
    const totalVotes = await Vote.countDocuments(query);
    const totalUsers = await User.countDocuments();

    const categoryBreakdown = await PolicyProposal.aggregate([
      { $match: query },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    const sentimentBreakdown = await Feedback.aggregate([
      { $match: query },
      { $group: { _id: '$sentiment', count: { $sum: 1 } } },
    ]);

    const topProposals = await PolicyProposal.find(query)
      .sort({ upvotes: -1 })
      .limit(10)
      .populate('authorId', 'firstName lastName')
      .select('title upvotes downvotes category status createdAt location')
      .lean();

    res.json({
      success: true,
      data: {
        totalProposals,
        totalFeedback,
        totalVotes,
        totalUsers,
        categoryBreakdown,
        sentimentBreakdown,
        topProposals,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getProposalAnalytics = async (req, res, next) => {
  try {
    const { startDate, endDate, category } = req.query;

    const query = {};
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    if (category) query.category = category;

    const proposals = await PolicyProposal.find(query);
    const statusBreakdown = await PolicyProposal.aggregate([
      { $match: query },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const priorityBreakdown = await PolicyProposal.aggregate([
      { $match: query },
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      data: {
        total: proposals.length,
        statusBreakdown,
        priorityBreakdown,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getFeedbackAnalytics = async (req, res, next) => {
  try {
    const { startDate, endDate, sentiment } = req.query;

    const query = {};
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    if (sentiment) query.sentiment = sentiment;

    const feedback = await Feedback.find(query);
    const categoryBreakdown = await Feedback.aggregate([
      { $match: query },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    const statusBreakdown = await Feedback.aggregate([
      { $match: query },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      data: {
        total: feedback.length,
        categoryBreakdown,
        statusBreakdown,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getEngagementMetrics = async (req, res, next) => {
  try {
    const { period = 'monthly' } = req.query;

    let groupFormat;
    if (period === 'daily') {
      groupFormat = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
    } else if (period === 'weekly') {
      groupFormat = { $dateToString: { format: '%Y-%U', date: '$createdAt' } };
    } else {
      groupFormat = { $dateToString: { format: '%Y-%m', date: '$createdAt' } };
    }

    const proposalEngagement = await PolicyProposal.aggregate([
      {
        $group: {
          _id: groupFormat,
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const feedbackEngagement = await Feedback.aggregate([
      {
        $group: {
          _id: groupFormat,
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      data: {
        period,
        proposalEngagement,
        feedbackEngagement,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getSentimentAnalysis = async (req, res, next) => {
  try {
    const { startDate, endDate, category } = req.query;

    const query = {};
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    if (category) query.category = category;

    const sentimentBreakdown = await Feedback.aggregate([
      { $match: query },
      { $group: { _id: '$sentiment', count: { $sum: 1 } } },
    ]);

    const total = sentimentBreakdown.reduce((sum, item) => sum + item.count, 0);

    res.json({
      success: true,
      data: {
        sentimentBreakdown,
        total,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardData,
  getProposalAnalytics,
  getFeedbackAnalytics,
  getEngagementMetrics,
  getSentimentAnalysis,
};
