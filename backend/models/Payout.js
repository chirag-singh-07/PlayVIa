const mongoose = require('mongoose');

const payoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    method: {
      type: String,
      enum: ['upi', 'bank'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'paid', 'rejected'],
      default: 'pending',
      index: true,
    },
    details: {
      accountHolder: String,
      accountNumber: String,
      ifsc: String,
      bankName: String,
      upi: String,
    },
    note: String,
    processedAt: Date,
  },
  {
    timestamps: true,
  }
);

const Payout = mongoose.model('Payout', payoutSchema);
module.exports = Payout;
