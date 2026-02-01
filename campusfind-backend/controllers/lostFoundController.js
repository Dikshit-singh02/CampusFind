const LostItem = require('../models/LostItem');
const FoundItem = require('../models/FoundItem');

// Lost Items
const getLostItems = async (req, res) => {
  try {
    const lostItems = await LostItem.find().populate('userId', 'name email');
    res.json(lostItems);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createLostItem = async (req, res) => {
  try {
    const { title, description, image, location } = req.body;
    const lostItem = new LostItem({
      title,
      description,
      image,
      location,
      userId: req.user.id,
    });
    await lostItem.save();
    res.status(201).json(lostItem);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Found Items
const getFoundItems = async (req, res) => {
  try {
    const foundItems = await FoundItem.find().populate('userId', 'name email');
    res.json(foundItems);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createFoundItem = async (req, res) => {
  try {
    const { title, description, image, location } = req.body;
    const foundItem = new FoundItem({
      title,
      description,
      image,
      location,
      userId: req.user.id,
    });
    await foundItem.save();
    res.status(201).json(foundItem);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getLostItems, createLostItem, getFoundItems, createFoundItem };
