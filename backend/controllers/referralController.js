const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Referral = require('../models/Referral');

// @desc    Get user's referral code and count
// @route   GET /api/referral
// @access  Private
const getReferralStats = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('referralCode referralCount');

  if (user) {
    res.json({
      referralCode: user.referralCode,
      referralCount: user.referralCount,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Apply a referral code manually
// @route   POST /api/referral/apply
// @access  Private
const applyReferral = asyncHandler(async (req, res) => {
  const { referralCode } = req.body;

  if (!referralCode) {
    res.status(400);
    throw new Error('Please provide a referral code');
  }

  // Find the referrer
  const referrerUser = await User.findOne({ referralCode });

  if (!referrerUser) {
    res.status(404);
    throw new Error('Invalid referral code');
  }

  // Prevent self-referral
  if (referrerUser._id.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error('You cannot refer yourself');
  }

  // Check if user already used a referral
  const existingReferral = await Referral.findOne({ referredUser: req.user._id });

  if (existingReferral) {
    res.status(400);
    throw new Error('You have already applied a referral code');
  }

  // Create the referral link and immediately mark as active since they are logged in
  await Referral.create({
    referrer: referrerUser._id,
    referredUser: req.user._id,
    isActive: true,
  });

  // Increment the referrer's count immediately
  await User.findByIdAndUpdate(referrerUser._id, { $inc: { referralCount: 1 } });

  res.json({ message: 'Referral applied successfully' });
});

module.exports = {
  getReferralStats,
  applyReferral,
};
