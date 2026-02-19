const mongoose = require('mongoose');

const foundItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String, // URL or path to image
  },
  location: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['lost', 'found'],
    default: 'found',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('FoundItem', foundItemSchema);
