const asyncHandler = require('express-async-handler');
const Payout = require('../models/Payout');
const Earnings = require('../models/Earnings');
const Channel = require('../models/Channel');

// @desc    Request a payout
// @route   POST /api/payout/request
// @access  Private
const requestPayout = asyncHandler(async (req, res) => {
  const { amount, method, details } = req.body;

  const channel = await Channel.findOne({ owner: req.user._id });
  if (!channel) {
    res.status(404);
    throw new Error('Channel not found');
  }

  const earnings = await Earnings.findOne({ channel: channel._id });
  if (!earnings) {
    res.status(400);
    throw new Error('No earnings found for this channel');
  }

  const MIN_PAYOUT = 5000;
  if (amount < MIN_PAYOUT) {
    res.status(400);
    throw new Error(`Minimum payout amount is ₹${MIN_PAYOUT}`);
  }

  if (earnings.totalEarnings < amount) {
    res.status(400);
    throw new Error('Insufficient balance');
  }

  // Create payout request
  const payout = await Payout.create({
    user: req.user._id,
    amount,
    method,
    details,
    status: 'pending'
  });

  // Deduct from earnings (or mark as pending deduction)
  // For now, we'll deduct it immediately to prevent double requests
  earnings.totalEarnings -= amount;
  await earnings.save();

  res.status(201).json(payout);
});

// @desc    Get payout history for current user
// @route   GET /api/payout/history
// @access  Private
const getPayoutHistory = asyncHandler(async (req, res) => {
  const payouts = await Payout.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(payouts);
});

module.exports = { requestPayout, getPayoutHistory };
