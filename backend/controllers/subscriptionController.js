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
    res.status(201).json({ message: 'Subscribed successfully', subscribersCount: channel.subscribersCount });
  }
});

module.exports = { toggleSubscribe };
