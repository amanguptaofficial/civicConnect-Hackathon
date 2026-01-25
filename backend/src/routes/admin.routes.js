const express = require('express');
const router = express.Router();
const { getUsers, createUser, createAdmin, getAllAdmins, deleteUser, deleteAdmin } = require('../controllers/admin.controller');
const { authenticateToken, requireAdmin } = require('../middleware/auth.middleware');

router.get('/users', requireAdmin, getUsers);
router.post('/users', requireAdmin, createUser);
router.delete('/users/:id', requireAdmin, deleteUser);
router.post('/create', requireAdmin, createAdmin);
router.get('/', requireAdmin, getAllAdmins);
router.delete('/:id', requireAdmin, deleteAdmin);

module.exports = router;
