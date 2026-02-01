const Notice = require('../models/Notice');

const getNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ date: -1 });
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createNotice = async (req, res) => {
  try {
    const { title, description, date } = req.body;
    const notice = new Notice({
      title,
      description,
      date: date || new Date(),
    });
    await notice.save();
    res.status(201).json(notice);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getNotices, createNotice };
