const express = require('express');
const router = express.Router();
const {
  getFeedback,
  getFeedbackItem,
  createFeedback,
  updateFeedback,
  deleteFeedback,
  updateFeedbackStatus,
} = require('../controllers/feedback.controller');
const { authenticateToken, requirePolicymaker } = require('../middleware/auth.middleware');
const { feedbackValidation } = require('../utils/validators');

router.get('/', getFeedback);
router.get('/:id', getFeedbackItem);
router.post('/', authenticateToken, feedbackValidation, createFeedback);
router.put('/:id', authenticateToken, updateFeedback);
router.delete('/:id', authenticateToken, deleteFeedback);
router.put('/:id/status', authenticateToken, requirePolicymaker, updateFeedbackStatus);

module.exports = router;
