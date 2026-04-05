const express = require('express');
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');
const { 
  getLostItems, createLostItem, getLostItemById, updateLostItem, deleteLostItem,
  getFoundItems, createFoundItem, getFoundItemById, updateFoundItem, deleteFoundItem
} = require('../controllers/lostFoundController');

const router = express.Router();

// Public/User Routes (no auth needed for GET)
router.get('/lost', getLostItems);
router.post('/lost', auth, createLostItem);

router.get('/found', getFoundItems);
router.post('/found', auth, createFoundItem);



// ========== ADMIN ROUTES ==========
router.get('/admin/lost/:id', admin, getLostItemById);
router.put('/admin/lost/:id', admin, updateLostItem);
router.delete('/admin/lost/:id', admin, deleteLostItem);

router.get('/admin/found/:id', admin, getFoundItemById);
router.put('/admin/found/:id', admin, updateFoundItem);
router.delete('/admin/found/:id', admin, deleteFoundItem);

module.exports = router;
