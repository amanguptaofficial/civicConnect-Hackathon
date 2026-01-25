const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
} = require('../controllers/notifications.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

router.get('/', authenticateToken, getNotifications);
router.put('/:id/read', authenticateToken, markAsRead);
router.put('/read-all', authenticateToken, markAllAsRead);
router.get('/unread-count', authenticateToken, getUnreadCount);

module.exports = router;
