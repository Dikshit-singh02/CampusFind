const express = require('express');
const auth = require('../middleware/auth');
const { getLocationByCode } = require('../controllers/locationController');
const { createIssue } = require('../controllers/issueController');
const router = express.Router();

// Public: Get location by code (for QR scan)
router.get('/:code', getLocationByCode);

// Optional auth: Report issue
router.post('/issues', createIssue);

module.exports = router;

