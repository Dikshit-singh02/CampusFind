const express = require('express');
const { getNotices, createNotice } = require('../controllers/noticeController');
const router = express.Router();

// GET /api/notifications - Get all notifications
router.get('/', getNotices);

// POST /api/notifications - Create a new notification
router.post('/', createNotice);

module.exports = router;
