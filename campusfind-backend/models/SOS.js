const mongoose = require('mongoose');

const sosSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('SOS', sosSchema);
