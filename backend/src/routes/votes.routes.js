const express = require('express');
const router = express.Router();
const {
  createVote,
  removeVote,
  getUserVotes,
} = require('../controllers/votes.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

router.post('/', authenticateToken, createVote);
router.delete('/:id', authenticateToken, removeVote);
router.get('/user/:userId', getUserVotes);

module.exports = router;
