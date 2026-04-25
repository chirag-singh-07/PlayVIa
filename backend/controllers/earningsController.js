const asyncHandler = require('express-async-handler');
const Earnings = require('../models/Earnings');
const Channel = require('../models/Channel');

// @desc    Get channel earnings
// @route   GET /api/earnings/:channelId
// @access  Private
const getChannelEarnings = asyncHandler(async (req, res) => {
  const channel = await Channel.findById(req.params.channelId).populate('owner');

  if (!channel) {
    res.status(404);
    throw new Error('Channel not found');
  }

  // Ensure only owner can view earnings
  if (channel.owner._id.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to view these earnings');
  }

  const subscriberCount = channel.subscribersCount;
  const referralCount = channel.owner.referralCount;

  // Monetization Eligibility Condition
  const isEligible = subscriberCount >= 2000 && referralCount >= 5;

  if (!isEligible) {
    return res.json({
      eligible: false,
      message: 'Need 2000 subscribers and 5 referrals',
      currentSubscribers: subscriberCount,
      currentReferrals: referralCount
    });
  }

  const earningsDoc = await Earnings.findOne({ channel: channel._id });

  res.json({
    eligible: true,
    totalViews: earningsDoc ? earningsDoc.totalViews : 0,
    earnings: earningsDoc ? earningsDoc.totalEarnings : 0,
  });
});

module.exports = {
  getChannelEarnings,
};
