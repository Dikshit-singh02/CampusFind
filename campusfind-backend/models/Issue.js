const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  location: {
    type: String, // Location code
    required: true
  },
  issue: {
    type: String,
    required: true,
    trim: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Issue', issueSchema);

