const express = require('express');
const { getBuildings, createBuilding } = require('../controllers/buildingController');
const router = express.Router();

router.get('/', getBuildings);
router.post('/', createBuilding);

module.exports = router;
