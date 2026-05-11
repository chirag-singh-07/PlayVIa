const asyncHandler = require('express-async-handler');
const Video = require('../models/Video');
const Channel = require('../models/Channel');
const Earnings = require('../models/Earnings');
const Subscription = require('../models/Subscription');

// @desc    Get creator dashboard stats
// @route   GET /api/creator/stats
// @access  Private
const getCreatorStats = asyncHandler(async (req, res) => {
  const channel = await Channel.findOne({ owner: req.user._id });

  if (!channel) {
    return res.status(404).json({ message: 'Channel not found' });
  }

  const videos = await Video.find({ channel: channel._id });
  const totalViews = videos.reduce((acc, video) => acc + (video.views || 0), 0);
  const totalVideos = videos.length;

  const earnings = await Earnings.findOne({ channel: channel._id });
  const totalEarnings = earnings ? earnings.totalEarnings : 0;

  const subscriberCount = await Subscription.countDocuments({ channel: channel._id });

  // Get recent 5 videos
  const recentVideos = await Video.find({ channel: channel._id })
    .sort({ createdAt: -1 })
    .limit(5);

  // Get top 5 videos by views
  const topVideos = await Video.find({ channel: channel._id })
    .sort({ views: -1 })
    .limit(5);

  res.json({
    channel: {
      id: channel._id,
      name: channel.name,
      avatar: channel.avatar,
    },
    stats: {
      totalViews,
      totalVideos,
      totalEarnings,
      subscriberCount,
    },
    recentVideos,
    topVideos,
  });
});

// @desc    Get creator videos with pagination
// @route   GET /api/creator/videos
// @access  Private
const getCreatorVideos = asyncHandler(async (req, res) => {
  const channel = await Channel.findOne({ owner: req.user._id });

  if (!channel) {
    return res.status(404).json({ message: 'Channel not found' });
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const videos = await Video.find({ channel: channel._id })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Video.countDocuments({ channel: channel._id });

  res.json({
    videos,
    page,
    pages: Math.ceil(total / limit),
    total,
  });
});

// @desc    Get creator analytics (charts data)
// @route   GET /api/creator/analytics
// @access  Private
const getCreatorAnalytics = asyncHandler(async (req, res) => {
  const channel = await Channel.findOne({ owner: req.user._id });

  if (!channel) {
    return res.status(404).json({ message: 'Channel not found' });
  }

  // For demo purposes, we'll return some mock time-series data
  // In a real app, you'd aggregate views/earnings by day/month from a 'VideoView' or 'Transaction' model
  const viewsOverTime = [
    { day: 'Mon', views: 1200 },
    { day: 'Tue', views: 1900 },
    { day: 'Wed', views: 1500 },
    { day: 'Thu', views: 2100 },
    { day: 'Fri', views: 2400 },
    { day: 'Sat', views: 2800 },
    { day: 'Sun', views: 2200 },
  ];

  const earningsOverTime = [
    { month: 'Jan', amount: 4500 },
    { month: 'Feb', amount: 5200 },
    { month: 'Mar', amount: 4800 },
    { month: 'Apr', amount: 6100 },
    { month: 'May', amount: 5900 },
    { month: 'Jun', amount: 7200 },
    { month: 'Jul', amount: 8100 },
    { month: 'Aug', amount: 7800 },
    { month: 'Sep', amount: 9200 },
    { month: 'Oct', amount: 8800 },
    { month: 'Nov', amount: 10500 },
    { month: 'Dec', amount: 12000 },
  ];

  res.json({
    viewsOverTime,
    earningsOverTime,
  });
});

// @desc    Get creator subscribers
// @route   GET /api/creator/subscribers
// @access  Private
const getCreatorSubscribers = asyncHandler(async (req, res) => {
  const channel = await Channel.findOne({ owner: req.user._id });

  if (!channel) {
    return res.status(404).json({ message: 'Channel not found' });
  }

  const subscriptions = await Subscription.find({ channel: channel._id })
    .populate('user', 'name avatar createdAt')
    .sort({ createdAt: -1 })
    .limit(20);

  res.json(subscriptions);
});

// @desc    Get creator comments
// @route   GET /api/creator/comments
// @access  Private
const getCreatorComments = asyncHandler(async (req, res) => {
  const channel = await Channel.findOne({ owner: req.user._id });

  if (!channel) {
    return res.status(404).json({ message: 'Channel not found' });
  }

  const Video = require('../models/Video');
  const Comment = require('../models/Comment');

  const videoIds = await Video.find({ channel: channel._id }).distinct('_id');

  const comments = await Comment.find({ video: { $in: videoIds } })
    .populate('user', 'name avatar')
    .populate('video', 'title')
    .sort({ createdAt: -1 })
    .limit(50);

  res.json(comments);
});

// @desc    Get creator payouts
// @route   GET /api/creator/payouts
// @access  Private
const getCreatorPayouts = asyncHandler(async (req, res) => {
  const Payout = require('../models/Payout');
  const payouts = await Payout.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(payouts);
});

// @desc    Create payout request
// @route   POST /api/creator/payouts
// @access  Private
const createPayoutRequest = asyncHandler(async (req, res) => {
  const { amount, method, details, note } = req.body;
  const Payout = require('../models/Payout');

  // Validate minimum withdrawal amount
  const MINIMUM_WITHDRAWAL = 5000;
  if (amount < MINIMUM_WITHDRAWAL) {
    res.status(400);
    throw new Error(`Minimum withdrawal amount is ₹${MINIMUM_WITHDRAWAL}. Current amount: ₹${amount}`);
  }

  // Validate method
  if (!['upi', 'bank'].includes(method)) {
    res.status(400);
    throw new Error('Invalid withdrawal method. Must be "upi" or "bank"');
  }

  // Validate details based on method
  if (method === 'bank') {
    if (!details?.accountHolder || !details?.accountNumber || !details?.ifsc || !details?.bankName) {
      res.status(400);
      throw new Error('Bank details required: accountHolder, accountNumber, ifsc, bankName');
    }
  } else if (method === 'upi') {
    if (!details?.upi) {
      res.status(400);
      throw new Error('UPI ID is required');
    }
  }

  // Check if user has enough earnings
  const Channel = require('../models/Channel');
  const Earnings = require('../models/Earnings');
  
  const channel = await Channel.findOne({ owner: req.user._id });
  if (!channel) {
    res.status(404);
    throw new Error('Channel not found');
  }

  const earnings = await Earnings.findOne({ channel: channel._id });
  const availableEarnings = earnings ? earnings.totalEarnings : 0;

  if (amount > availableEarnings) {
    res.status(400);
    throw new Error(`Insufficient earnings. Available: ₹${availableEarnings}, Requested: ₹${amount}`);
  }

  const payout = await Payout.create({
    user: req.user._id,
    amount,
    method,
    details,
    note,
  });

  res.status(201).json({
    success: true,
    message: 'Withdrawal request submitted. You will receive the amount within 7 business days.',
    payout
  });
});

module.exports = {
  getCreatorStats,
  getCreatorVideos,
  getCreatorAnalytics,
  getCreatorSubscribers,
  getCreatorComments,
  getCreatorPayouts,
  createPayoutRequest,
};



