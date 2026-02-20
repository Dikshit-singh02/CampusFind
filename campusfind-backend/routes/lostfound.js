const express = require('express');
const { 
  getLostItems, 
  createLostItem, 
  getFoundItems, 
  createFoundItem,
  getItemByQRCode,
  updateItemStatus
} = require('../controllers/lostFoundController');
const router = express.Router();

// Lost Items
router.get('/lost', getLostItems);
router.post('/lost', createLostItem);

// Found Items
router.get('/found', getFoundItems);
router.post('/found', createFoundItem);

// QR Code endpoints
router.get('/qr/:qrCode', getItemByQRCode);
router.put('/status/:id', updateItemStatus);

module.exports = router;
