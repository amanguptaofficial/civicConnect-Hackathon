const express = require('express');
const router = express.Router();
const { getUsers, createUser, createAdmin, getAllAdmins, deleteUser, deleteAdmin } = require('../controllers/admin.controller');
const { authenticateToken, requireAdmin } = require('../middleware/auth.middleware');

router.get('/users', authenticateToken, requireAdmin, getUsers);
router.post('/users', authenticateToken, requireAdmin, createUser);
router.delete('/users/:id', authenticateToken, requireAdmin, deleteUser);
router.post('/create', authenticateToken, requireAdmin, createAdmin);
router.get('/', authenticateToken, requireAdmin, getAllAdmins);
router.delete('/:id', authenticateToken, requireAdmin, deleteAdmin);

module.exports = router;
