const express = require('express');
const router = express.Router();
const {
  getComments,
  createComment,
  updateComment,
  deleteComment,
} = require('../controllers/comments.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { commentValidation } = require('../utils/validators');

router.get('/', getComments);
router.post('/', authenticateToken, commentValidation, createComment);
router.put('/:id', authenticateToken, updateComment);
router.delete('/:id', authenticateToken, deleteComment);

module.exports = router;
