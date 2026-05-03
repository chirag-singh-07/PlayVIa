const mongoose = require('mongoose');

const adminLogSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['Create', 'Edit', 'Delete', 'Login', 'Logout'],
      required: true,
    },
    target: {
      type: String,
    },
    ip: {
      type: String,
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('AdminLog', adminLogSchema);
