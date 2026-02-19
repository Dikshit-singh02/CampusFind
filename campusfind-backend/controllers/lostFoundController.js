const LostItem = require('../models/LostItem');
const FoundItem = require('../models/FoundItem');

// Lost Items
const getLostItems = async (req, res) => {
  try {
    const lostItems = await LostItem.find().populate('userId', 'name email');
    res.json(lostItems);
  } catch (error) {
    console.error('Error fetching lost items:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

const createLostItem = async (req, res) => {
  try {
    const { title, description, image, location } = req.body;
    console.log('Creating lost item with data:', { title, description, image, location });
    
    const lostItem = new LostItem({
      title,
      description,
      image,
      location,
      userId: req.user ? req.user.id : null,
    });
    
    const savedItem = await lostItem.save();
    console.log('Lost item saved successfully:', savedItem);
    res.status(201).json(savedItem);
  } catch (error) {
    console.error('Error creating lost item:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
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
      userId: req.user ? req.user.id : null,
    });
    await foundItem.save();
    res.status(201).json(foundItem);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getLostItems, createLostItem, getFoundItems, createFoundItem };
