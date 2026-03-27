const Notice = require('../models/Notice');

// GET /api/notifications - Get all notifications/notices (latest first)
const getNotices = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    
    // Filter by status if provided and not 'All'
    if (status && status !== 'All') {
      query.status = status;
    }
    
    const notices = await Notice.find(query).sort({ createdAt: -1 });
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// POST /api/notifications - Create a new notification
const createNotice = async (req, res) => {
  try {
    const { title, content, status, itemDetails, type } = req.body;
    
    const notice = new Notice({
      title,
      content,
      status: status || 'General',
      itemDetails: itemDetails || {},
      type: type || 'notice',
      author: req.user ? req.user.id : null,
    });
    
    await notice.save();
    
    // Emit real-time update
    const { emitNoticeUpdate } = require('../server');
    emitNoticeUpdate();
    
    res.status(201).json(notice);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// Create notification for Lost Item
const createLostItemNotification = async (item) => {
  try {
    const notice = new Notice({
      title: `Lost Item: ${item.title}`,
      content: item.description,
      status: 'Lost',
      itemDetails: {
        description: item.description,
        location: item.location,
        image: item.image,
        contactInfo: item.contactInfo,
      },
      type: 'notification',
      author: item.userId,
    });
    
    await notice.save();
    console.log('Lost item notification created:', notice._id);
    return notice;
  } catch (error) {
    console.error('Error creating lost item notification:', error);
    throw error;
  }
};

// Create notification for Found Item
const createFoundItemNotification = async (item) => {
  try {
    const notice = new Notice({
      title: `Found Item: ${item.title}`,
      content: item.description,
      status: 'Found',
      itemDetails: {
        description: item.description,
        location: item.location,
        image: item.image,
        contactInfo: item.contactInfo,
      },
      type: 'notification',
      author: item.userId,
    });
    
    await notice.save();
    console.log('Found item notification created:', notice._id);
    return notice;
  } catch (error) {
    console.error('Error creating found item notification:', error);
    throw error;
  }
};

module.exports = { 
  getNotices, 
  createNotice,
  createLostItemNotification,
  createFoundItemNotification
};
