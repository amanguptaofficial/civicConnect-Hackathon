const express = require('express');
const router = express.Router();
const {
  getProposals,
  getProposal,
  createProposal,
  updateProposal,
  deleteProposal,
  updateProposalStatus,
} = require('../controllers/proposals.controller');
const { authenticateToken, requirePolicymaker } = require('../middleware/auth.middleware');
const { proposalValidation } = require('../utils/validators');

router.get('/', getProposals);
router.get('/:id', getProposal);
router.post('/', authenticateToken, proposalValidation, createProposal);
router.put('/:id', authenticateToken, updateProposal);
router.delete('/:id', authenticateToken, deleteProposal);
router.post('/:id/status', authenticateToken, requirePolicymaker, updateProposalStatus);

module.exports = router;
