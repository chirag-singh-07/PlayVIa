const asyncHandler = require('express-async-handler');
const Comment = require('../models/Comment');
const Video = require('../models/Video');

// @desc    Add a comment
// @route   POST /api/comment/add
// @access  Private
const addComment = asyncHandler(async (req, res) => {
  const { videoId, text } = req.body;

  const video = await Video.findById(videoId);
  if (!video) {
    res.status(404);
    throw new Error('Video not found');
  }

  const comment = await Comment.create({
    video: videoId,
    user: req.user._id,
    text,
  });

  // Notify video owner
  const Notification = require('../models/Notification');
  const Channel = require('../models/Channel');
  const channelOwner = await Channel.findById(video.channel).select('owner');
  
  if (channelOwner && channelOwner.owner.toString() !== req.user._id.toString()) {
    await Notification.create({
      user: channelOwner.owner,
      type: 'comment',
      message: `${req.user.username} commented on your video: ${video.title}`,
      relatedVideo: video._id,
      sender: req.user._id,
    });
  }

  res.status(201).json(comment);
});

// @desc    Get comments for a video
// @route   GET /api/comment/:videoId
// @access  Public
const getVideoComments = asyncHandler(async (req, res) => {
  const pageSize = 20;
  const page = Number(req.query.pageNumber) || 1;

  const count = await Comment.countDocuments({ video: req.params.videoId });
  const comments = await Comment.find({ video: req.params.videoId })
    .populate('user', 'username avatar')
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ comments, page, pages: Math.ceil(count / pageSize) });
});

module.exports = { addComment, getVideoComments };
