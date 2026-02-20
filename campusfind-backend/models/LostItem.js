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
  // QR Code field - unique identifier for QR scanning
  qrCode: {
    type: String,
    unique: true,
    sparse: true,
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

// Auto-generate QR code before saving
lostItemSchema.pre('save', function(next) {
  if (!this.qrCode) {
    this.qrCode = `LOST-${this._id.toString()}-${Date.now()}`;
  }
  next();
});

module.exports = mongoose.model('LostItem', lostItemSchema);
