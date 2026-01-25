const express = require('express');
const router = express.Router();
const { uploadFile, uploadMultiple, getPresignedUrl, deleteFile } = require('../controllers/upload.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

router.post('/single', authenticateToken, uploadFile);
router.post('/multiple', authenticateToken, uploadMultiple);
router.post('/presigned-url', authenticateToken, getPresignedUrl);
router.delete('/', authenticateToken, deleteFile);

module.exports = router;
