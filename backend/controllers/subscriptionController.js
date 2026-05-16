const asyncHandler = require('express-async-handler');
const Subscription = require('../models/Subscription');
const Channel = require('../models/Channel');

// @desc    Subscribe / Unsubscribe a channel
// @route   POST /api/subscribe/:channelId
// @access  Private
const toggleSubscribe = asyncHandler(async (req, res) => {
  const channelId = req.params.channelId;

  const channel = await Channel.findById(channelId);
  if (!channel) {
    res.status(404);
    throw new Error('Channel not found');
  }

  if (channel.owner.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error('You cannot subscribe to your own channel');
  }

  const existingSubscription = await Subscription.findOne({
    subscriber: req.user._id,
    channel: channelId,
  });

  if (existingSubscription) {
    // Unsubscribe
    await existingSubscription.deleteOne();
    channel.subscribersCount -= 1;
    await channel.save();
    res.json({ message: 'Unsubscribed successfully', subscribersCount: channel.subscribersCount });
  } else {
    // Subscribe
    await Subscription.create({
      subscriber: req.user._id,
      channel: channelId,
    });
    channel.subscribersCount += 1;
    await channel.save();

    // Notify channel owner
    const Notification = require('../models/Notification');
    await Notification.create({
      user: channel.owner,
      type: 'subscriber',
      message: `${req.user.username} subscribed to your channel! 🚀`,
      sender: req.user._id,
    });

    res.status(201).json({ message: 'Subscribed successfully', subscribersCount: channel.subscribersCount });
  }
});

// @desc    Get subscribed channels
// @route   GET /api/subscribe/channels
// @access  Private
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const subscriptions = await Subscription.find({ subscriber: req.user._id })
    .populate('channel', 'name avatar subscribersCount');
  
  const channels = subscriptions.map(sub => sub.channel);
  res.json(channels);
});

// @desc    Get videos from subscribed channels
// @route   GET /api/subscribe/videos
// @access  Private
const getSubscriptionVideos = asyncHandler(async (req, res) => {
  const subscriptions = await Subscription.find({ subscriber: req.user._id });
  const channelIds = subscriptions.map(sub => sub.channel);

  const Video = require('../models/Video');
  const videos = await Video.find({ channel: { $in: channelIds } })
    .populate('channel', 'name avatar')
    .sort({ createdAt: -1 });

  res.json(videos);
});

module.exports = { toggleSubscribe, getSubscribedChannels, getSubscriptionVideos };
