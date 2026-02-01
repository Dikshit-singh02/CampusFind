const express = require('express');
const { getSOS, createSOS } = require('../controllers/sosController');
const router = express.Router();

router.get('/', getSOS);
router.post('/', createSOS);

module.exports = router;
