const express = require('express');
const router = express.Router();
const { generateProposalSummary, analyzeText, generateIssueDescription } = require('../controllers/ai.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

router.post('/summary', authenticateToken, generateProposalSummary);
router.post('/analyze', authenticateToken, analyzeText);
router.post('/generate-issue-description', authenticateToken, generateIssueDescription);

module.exports = router;
