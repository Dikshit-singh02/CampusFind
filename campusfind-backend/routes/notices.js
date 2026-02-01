const express = require('express');
const { getNotices, createNotice } = require('../controllers/noticeController');
const router = express.Router();

router.get('/', getNotices);
router.post('/', createNotice);

module.exports = router;
