const express = require('express');
const router = express.Router();
const { generateProposalSummary, analyzeText } = require('../controllers/ai.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

router.post('/summary', authenticateToken, generateProposalSummary);
router.post('/analyze', authenticateToken, analyzeText);

module.exports = router;
