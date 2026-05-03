const mongoose = require('mongoose');

const appVersionSchema = new mongoose.Schema(
  {
    version: {
      type: String,
      required: true,
      unique: true,
    },
    releaseNotes: {
      type: String,
    },
    platform: {
      type: String,
      enum: ['Android', 'iOS', 'Web'],
      default: 'Android',
    },
    forceUpdate: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['Live', 'Archived', 'Beta'],
      default: 'Beta',
    },
    downloads: {
      type: Number,
      default: 0,
    },
    size: {
      type: String,
    },
    downloadUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('AppVersion', appVersionSchema);
