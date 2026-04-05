// Lost & Found Admin Controller
const LostItem = require('../models/LostItem');
const FoundItem = require('../models/FoundItem');
const { createLostItemNotification, createFoundItemNotification } = require('./noticeController');

// ========== LOST ITEMS ==========
const getLostItems = async (req, res) => {
  try {
    const lostItems = await LostItem.find().populate('userId', 'name email').populate('claimedBy', 'name email');
    res.json(lostItems);
  } catch (error) {
    console.error('Error fetching lost items:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

const createLostItem = async (req, res) => {
  try {
    const { title, description, image, location, contactInfo } = req.body;
    console.log('Creating lost item with data:', { title, description, image, location });
    
    const lostItem = new LostItem({
      title,
      description,
      image,
      location,
      contactInfo,
      userId: req.user ? req.user.id : null,
      status: 'Available',
    });

    
    const savedItem = await lostItem.save();
    console.log('Lost item saved successfully:', savedItem);
    
    // Create notification for the lost item
    try {
      await createLostItemNotification(savedItem);
    } catch (notifError) {
      console.error('Error creating notification:', notifError);
    }
    
    res.status(201).json(savedItem);
  } catch (error) {
    console.error('Error creating lost item:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

const getLostItemById = async (req, res) => {
  try {
    const item = await LostItem.findById(req.params.id).populate('userId', 'name email').populate('claimedBy', 'name email');
    if (!item) {
      return res.status(404).json({ message: 'Lost item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateLostItem = async (req, res) => {
  try {
    const { title, description, image, location, contactInfo, status } = req.body;
    const item = await LostItem.findByIdAndUpdate(
      req.params.id,
      { title, description, image, location, contactInfo, status },
      { new: true, runValidators: true }
    ).populate('userId', 'name email').populate('claimedBy', 'name email');
    
    if (!item) {
      return res.status(404).json({ message: 'Lost item not found' });
    }
    
    res.json({ message: 'Lost item updated', item });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

const deleteLostItem = async (req, res) => {
  try {
    const item = await LostItem.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Lost item not found' });
    }
    res.json({ message: 'Lost item deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ========== FOUND ITEMS ==========
const getFoundItems = async (req, res) => {
  try {
    const foundItems = await FoundItem.find().populate('userId', 'name email').populate('claimedBy', 'name email');
    res.json(foundItems);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createFoundItem = async (req, res) => {
  try {
    const { title, description, image, location, contactInfo } = req.body;
    
    const foundItem = new FoundItem({
      title,
      description,
      image,
      location,
      contactInfo,
      userId: req.user ? req.user.id : null,
      status: 'found',
      claimStatus: 'Available',
    });

    
    const savedItem = await foundItem.save();
    
    // Create notification for the found item
    try {
      await createFoundItemNotification(savedItem);
    } catch (notifError) {
      console.error('Error creating notification:', notifError);
    }
    
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getFoundItemById = async (req, res) => {
  try {
    const item = await FoundItem.findById(req.params.id).populate('userId', 'name email').populate('claimedBy', 'name email');
    if (!item) {
      return res.status(404).json({ message: 'Found item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateFoundItem = async (req, res) => {
  try {
    const { title, description, image, location, contactInfo, claimStatus } = req.body;
    const item = await FoundItem.findByIdAndUpdate(
      req.params.id,
      { title, description, image, location, contactInfo, claimStatus },
      { new: true, runValidators: true }
    ).populate('userId', 'name email').populate('claimedBy', 'name email');
    
    if (!item) {
      return res.status(404).json({ message: 'Found item not found' });
    }
    
    res.json({ message: 'Found item updated', item });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

const deleteFoundItem = async (req, res) => {
  try {
    const item = await FoundItem.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Found item not found' });
    }
    res.json({ message: 'Found item deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};



module.exports = { 
  getLostItems, createLostItem, getLostItemById, updateLostItem, deleteLostItem,
  getFoundItems, createFoundItem, getFoundItemById, updateFoundItem, deleteFoundItem
};
