const asyncHandler = require('express-async-handler');
const Comment = require('../models/Comment');
const Video = require('../models/Video');

// @desc    Add a comment or reply
// @route   POST /api/comment/add
// @access  Private
const addComment = asyncHandler(async (req, res) => {
  const { videoId, text, parentCommentId } = req.body;

  const video = await Video.findById(videoId);
  if (!video) {
    res.status(404);
    throw new Error('Video not found');
  }

  const comment = await Comment.create({
    video: videoId,
    user: req.user._id,
    text,
    parentComment: parentCommentId || null
  });

  if (parentCommentId) {
    await Comment.findByIdAndUpdate(parentCommentId, { $inc: { repliesCount: 1 } });
  }

  // Notify video owner
  const Notification = require('../models/Notification');
  const Channel = require('../models/Channel');
  const channelOwner = await Channel.findById(video.channel).select('owner');
  
  if (channelOwner && channelOwner.owner.toString() !== req.user._id.toString() && !parentCommentId) {
    await Notification.create({
      user: channelOwner.owner,
      type: 'comment',
      message: `${req.user.username} commented on your video: ${video.title}`,
      relatedVideo: video._id,
      sender: req.user._id,
    });
  }

  await comment.populate('user', 'username avatar');
  res.status(201).json(comment);
});

// @desc    Get comments for a video (top-level only)
// @route   GET /api/comment/:videoId
// @access  Public
const getVideoComments = asyncHandler(async (req, res) => {
  const pageSize = 20;
  const page = Number(req.query.pageNumber) || 1;

  const query = { video: req.params.videoId, parentComment: null };
  const count = await Comment.countDocuments(query);
  const comments = await Comment.find(query)
    .populate('user', 'username avatar')
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ comments, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Get replies for a comment
// @route   GET /api/comment/replies/:commentId
// @access  Public
const getCommentReplies = asyncHandler(async (req, res) => {
  const replies = await Comment.find({ parentComment: req.params.commentId })
    .populate('user', 'username avatar')
    .sort({ createdAt: 1 });
  
  res.json(replies);
});

// @desc    Like or Unlike a comment
// @route   POST /api/comment/:commentId/like
// @access  Private
const likeComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.commentId);
  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }

  const isLiked = comment.likes.includes(req.user._id);
  if (isLiked) {
    comment.likes.pull(req.user._id);
    comment.likesCount = Math.max(0, comment.likesCount - 1);
  } else {
    comment.likes.push(req.user._id);
    comment.likesCount += 1;
  }
  
  await comment.save();
  res.json({ message: isLiked ? 'Comment unliked' : 'Comment liked', likesCount: comment.likesCount, isLiked: !isLiked });
});

// @desc    Delete a comment
// @route   DELETE /api/comment/:commentId
// @access  Private
const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.commentId);
  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }

  if (comment.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this comment');
  }

  if (comment.parentComment) {
    await Comment.findByIdAndUpdate(comment.parentComment, { $inc: { repliesCount: -1 } });
  } else {
    await Comment.deleteMany({ parentComment: comment._id });
  }

  await comment.deleteOne();
  res.json({ message: 'Comment removed' });
});

// @desc    Report a comment
// @route   POST /api/comment/:commentId/report
// @access  Private
const reportComment = asyncHandler(async (req, res) => {
  const Report = require('../models/Report');
  
  const existingReport = await Report.findOne({
    reporter: req.user._id,
    targetType: 'comment',
    targetId: req.params.commentId
  });

  if (existingReport) {
    res.status(400);
    throw new Error('You have already reported this comment');
  }

  await Report.create({
    reporter: req.user._id,
    targetType: 'comment',
    targetId: req.params.commentId,
    reason: req.body.reason || 'Inappropriate content',
    priority: 'Medium'
  });

  res.json({ message: 'Comment reported successfully' });
});

module.exports = { 
  addComment, 
  getVideoComments, 
  getCommentReplies, 
  likeComment, 
  deleteComment, 
  reportComment 
};
