const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  // New fields for notification system
  status: {
    type: String,
    enum: ['Lost', 'Found', 'General', 'Academic', 'Event', 'Emergency'],
    default: 'General',
  },
  itemDetails: {
    description: String,
    location: String,
    image: String,
    contactInfo: String,
  },
  type: {
    type: String,
    enum: ['notice', 'notification'],
    default: 'notice',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Notice', noticeSchema);
