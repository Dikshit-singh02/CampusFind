const Building = require('../models/Building');

const getBuildings = async (req, res) => {
  try {
    const buildings = await Building.find();
    res.json(buildings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createBuilding = async (req, res) => {
  const { name, location } = req.body;
  try {
    const building = new Building({ name, location });
    await building.save();
    res.status(201).json(building);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getBuildings, createBuilding };
