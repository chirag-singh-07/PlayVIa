const asyncHandler = require('express-async-handler');
const Channel = require('../models/Channel');

// @desc    Create a channel
// @route   POST /api/channel/create
// @access  Private
const createChannel = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const channelExists = await Channel.findOne({ owner: req.user._id });

  if (channelExists) {
    res.status(400);
    throw new Error('User already has a channel');
  }

  const channel = await Channel.create({
    owner: req.user._id,
    name,
    description,
  });

  if (channel) {
    res.status(201).json(channel);
  } else {
    res.status(400);
    throw new Error('Invalid channel data');
  }
});

// @desc    Get channel by ID
// @route   GET /api/channel/:id
// @access  Public
const getChannelById = asyncHandler(async (req, res) => {
  const channel = await Channel.findById(req.params.id).populate('owner', 'username avatar');

  if (channel) {
    res.json(channel);
  } else {
    res.status(404);
    throw new Error('Channel not found');
  }
});

module.exports = { createChannel, getChannelById };
