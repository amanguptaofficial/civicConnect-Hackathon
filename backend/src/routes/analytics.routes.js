const express = require('express');
const router = express.Router();
const {
  getDashboardData,
  getProposalAnalytics,
  getFeedbackAnalytics,
  getEngagementMetrics,
  getSentimentAnalysis,
} = require('../controllers/analytics.controller');
const { authenticateToken, requirePolicymaker } = require('../middleware/auth.middleware');

router.get('/dashboard', authenticateToken, requirePolicymaker, getDashboardData);
router.get('/proposals', authenticateToken, requirePolicymaker, getProposalAnalytics);
router.get('/feedback', authenticateToken, requirePolicymaker, getFeedbackAnalytics);
router.get('/engagement', authenticateToken, requirePolicymaker, getEngagementMetrics);
router.get('/sentiment', authenticateToken, requirePolicymaker, getSentimentAnalysis);

module.exports = router;
