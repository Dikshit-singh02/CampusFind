const Issue = require('../models/Issue');
const auth = require('../middleware/auth'); // optional auth

const createIssue = async (req, res) => {
  try {
    const { location, issue } = req.body;
    const newIssue = new Issue({
      location,
      issue,
      user: req.user ? req.user.id : null
    });
    const savedIssue = await newIssue.save();
    res.status(201).json({ message: 'Issue reported successfully', issue: savedIssue });
  } catch (error) {
    console.error('Error creating issue:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

module.exports = { createIssue };

