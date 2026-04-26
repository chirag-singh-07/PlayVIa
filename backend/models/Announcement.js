const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    target: {
      type: String,
      enum: ['All Users', 'Creators', 'Premium', 'Specific'],
      default: 'All Users',
    },
    status: {
      type: String,
      enum: ['Scheduled', 'Sent'],
      default: 'Sent',
    },
    scheduledAt: {
      type: Date,
    },
    recipientsCount: {
      type: Number,
      default: 0,
    },
    openRate: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Announcement', announcementSchema);
