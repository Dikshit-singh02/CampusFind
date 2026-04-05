const mongoose = require('mongoose');

const lostItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  location: {
    type: String,
    required: true,
  },

  // Status for claim verification
  status: {
    type: String,
    enum: ['Available', 'Claimed', 'Returned'],
    default: 'Available',
  },
  // Claim information
  claimedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  claimedAt: {
    type: Date,
  },
  // Owner information
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  // Contact info for claimants
  contactInfo: {
    type: String,
  },
}, {
  timestamps: true,
});



module.exports = mongoose.model('LostItem', lostItemSchema);
