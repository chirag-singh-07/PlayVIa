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

  const bannerPath = req.files && req.files.banner ? req.files.banner[0].location : '';
  const avatarPath = req.files && req.files.avatar ? req.files.avatar[0].location : '';

  const channel = await Channel.create({
    owner: req.user._id,
    name,
    description,
    banner: bannerPath,
    avatar: avatarPath,
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

// @desc    Get my channel
// @route   GET /api/channel/me
// @access  Private
const getMyChannel = asyncHandler(async (req, res) => {
  const channel = await Channel.findOne({ owner: req.user._id });
  res.json(channel); // returns null if no channel
});

// @desc    Get channel videos
// @route   GET /api/channel/:id/videos
// @access  Public
const getChannelVideos = asyncHandler(async (req, res) => {
  const Video = require('../models/Video');
  const videos = await Video.find({ channel: req.params.id, videoType: { $ne: 'short' } })
    .sort({ createdAt: -1 });
  res.json(videos);
});

// @desc    Get channel shorts
// @route   GET /api/channel/:id/shorts
// @access  Public
const getChannelShorts = asyncHandler(async (req, res) => {
  const Video = require('../models/Video');
  const shorts = await Video.find({ channel: req.params.id, videoType: 'short' })
    .sort({ createdAt: -1 });
  res.json(shorts);
});

// @desc    Update channel
// @route   PUT /api/channel/:id
// @access  Private
const updateChannel = asyncHandler(async (req, res) => {
  const channel = await Channel.findById(req.params.id);

  if (!channel) {
    res.status(404);
    throw new Error('Channel not found');
  }

  // Check ownership
  if (channel.owner.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to update this channel');
  }

  const { name, description } = req.body;

  if (name) channel.name = name;
  if (description) channel.description = description;

  if (req.files) {
    if (req.files.banner) {
      channel.banner = req.files.banner[0].location;
    }
    if (req.files.avatar) {
      channel.avatar = req.files.avatar[0].location;
    }
  }

  const updatedChannel = await channel.save();
  res.json(updatedChannel);
});

module.exports = { 
  createChannel, 
  getChannelById, 
  getMyChannel, 
  getChannelVideos, 
  getChannelShorts,
  updateChannel 
};
