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
  // Original status field (kept for compatibility)
  status: {
    type: String,
    enum: ['lost', 'found'],
    default: 'found',
  },
  // QR Code field - unique identifier for QR scanning
  qrCode: {
    type: String,
    unique: true,
    sparse: true,
  },
  // Status for claim verification (Available/Claimed/Returned)
  claimStatus: {
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
  // Owner information (who found the item)
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
foundItemSchema.pre('save', function(next) {
  if (!this.qrCode) {
    this.qrCode = `FOUND-${this._id.toString()}-${Date.now()}`;
  }
  next();
});

module.exports = mongoose.model('FoundItem', foundItemSchema);
