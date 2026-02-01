const express = require('express');
const { getLostItems, createLostItem, getFoundItems, createFoundItem } = require('../controllers/lostFoundController');
const router = express.Router();

// Lost Items
router.get('/lost', getLostItems);
router.post('/lost', createLostItem);

// Found Items
router.get('/found', getFoundItems);
router.post('/found', createFoundItem);

module.exports = router;
