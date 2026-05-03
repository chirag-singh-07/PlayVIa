const mongoose = require('mongoose');

const adSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    advertiser: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['Banner', 'Video', 'Interstitial'],
      default: 'Video',
    },
    budget: {
      type: Number,
      required: true,
    },
    spent: {
      type: Number,
      default: 0,
    },
    impressions: {
      type: Number,
      default: 0,
    },
    clicks: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['Active', 'Paused', 'Completed', 'Pending'],
      default: 'Pending',
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    videoUrl: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    targetLink: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Ad', adSchema);
