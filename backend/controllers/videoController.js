const asyncHandler = require('express-async-handler');
const Video = require('../models/Video');
const Channel = require('../models/Channel');

// @desc    Upload a video
// @route   POST /api/video/upload
// @access  Private
const uploadVideo = asyncHandler(async (req, res) => {
  const { title, description, videoType } = req.body;

  const channel = await Channel.findOne({ owner: req.user._id });
  if (!channel) {
    res.status(400);
    throw new Error('You need to create a channel first to upload videos');
  }

  if (!req.files || !req.files.video) {
    res.status(400);
    throw new Error('No video file provided');
  }

  const videoFile = req.files.video[0];
  const thumbnailFile = req.files.thumbnail ? req.files.thumbnail[0] : null;

  const video = await Video.create({
    channel: channel._id,
    title,
    description,
    videoUrl: videoFile.path, // Cloudinary URL
    thumbnailUrl: thumbnailFile ? thumbnailFile.path : '',
    videoType: videoType || 'video',
    category: req.body.category || 'General',
    tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : [],
  });

  // Notify subscribers
  const Subscription = require('../models/Subscription');
  const Notification = require('../models/Notification');
  const subscribers = await Subscription.find({ channel: channel._id });
  
  const notifications = subscribers.map((sub) => ({
    user: sub.subscriber,
    type: 'video',
    message: `New video uploaded by ${channel.name}: ${video.title}`,
    relatedVideo: video._id,
    sender: req.user._id,
  }));
  
  if (notifications.length > 0) {
    await Notification.insertMany(notifications);
  }

  res.status(201).json(video);
});

// @desc    Get video by ID and increment view
// @route   GET /api/video/:id
// @access  Public
const getVideoById = asyncHandler(async (req, res) => {
  const video = await Video.findById(req.params.id).populate('channel', 'name subscribersCount banner');

  if (video) {
    // Increment view
    video.views += 1;
    await video.save();

    // Fetch channel and its owner to check eligibility
    const channel = await Channel.findById(video.channel._id).populate('owner');
    
    if (channel && channel.owner) {
      channel.totalViews += 1;
      await channel.save();

      const subscriberCount = channel.subscribersCount;
      const referralCount = channel.owner.referralCount;

      // Check Monetization Eligibility: >= 2000 subs and >= 5 referrals
      if (subscriberCount >= 2000 && referralCount >= 5) {
        const Earnings = require('../models/Earnings');
        
        let earningsDoc = await Earnings.findOne({ channel: channel._id });
        if (!earningsDoc) {
          earningsDoc = await Earnings.create({ channel: channel._id });
        }

        earningsDoc.totalViews += 1;
        
        // Calculate total earnings: (totalViews / 1000) * EARNINGS_RATE
        const earningsRate = process.env.EARNINGS_RATE_PER_1000 || 50;
        earningsDoc.totalEarnings = (earningsDoc.totalViews / 1000) * Number(earningsRate);
        earningsDoc.lastUpdated = Date.now();
        await earningsDoc.save();
      }
    }

    res.json(video);
  } else {
    res.status(404);
    throw new Error('Video not found');
  }
});

// @desc    Like / Unlike a video
// @route   POST /api/video/like
// @access  Private
const toggleLikeVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.body;

  const video = await Video.findById(videoId);

  if (video) {
    const isLiked = video.likes.includes(req.user._id);

    if (isLiked) {
      // Unlike
      video.likes = video.likes.filter((userId) => userId.toString() !== req.user._id.toString());
      video.likesCount -= 1;
    } else {
      // Like
      video.likes.push(req.user._id);
      video.likesCount += 1;

      // Notify video owner
      const Notification = require('../models/Notification');
      const channelOwner = await Channel.findById(video.channel).select('owner');
      if (channelOwner && channelOwner.owner.toString() !== req.user._id.toString()) {
        await Notification.create({
          user: channelOwner.owner,
          type: 'like',
          message: `${req.user.username} liked your video: ${video.title}`,
          relatedVideo: video._id,
          sender: req.user._id,
        });
      }
    }

    await video.save();
    res.json({ message: isLiked ? 'Video unliked' : 'Video liked', likesCount: video.likesCount });
  } else {
    res.status(404);
    throw new Error('Video not found');
  }
});

// @desc    Get video feed (with pagination and optional search)
// @route   GET /api/video/feed
// @access  Public
const getVideoFeed = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;
  const keyword = req.query.keyword
    ? {
        title: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const count = await Video.countDocuments({ ...keyword });
  const videos = await Video.find({ ...keyword })
    .populate('channel', 'name avatar')
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ videos, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Get recommended videos
// @route   GET /api/video/recommendations
// @access  Private
const getRecommendations = asyncHandler(async (req, res) => {
  // Fetch user's history
  const WatchHistory = require('../models/WatchHistory');
  const history = await WatchHistory.find({ user: req.user._id }).populate('video');
  
  // Extract categories and tags from history
  const categories = history.map((h) => h.video.category).filter(Boolean);
  const tags = history.map((h) => h.video.tags).flat().filter(Boolean);

  // Find videos matching these categories or tags, sort by trendingScore
  const recommendations = await Video.find({
    $or: [
      { category: { $in: categories } },
      { tags: { $in: tags } }
    ],
    _id: { $nin: history.map((h) => h.video._id) } // exclude already watched
  })
    .populate('channel', 'name avatar')
    .sort({ trendingScore: -1 })
    .limit(10);

  // If not enough recommendations, fallback to trending videos
  if (recommendations.length < 5) {
    const fallback = await Video.find({
      _id: { $nin: [...history.map(h => h.video._id), ...recommendations.map(r => r._id)] }
    })
      .populate('channel', 'name avatar')
      .sort({ trendingScore: -1 })
      .limit(10 - recommendations.length);
    
    recommendations.push(...fallback);
  }

  res.json(recommendations);
});

// @desc    Get trending videos
// @route   GET /api/video/trending
// @access  Public
const getTrendingVideos = asyncHandler(async (req, res) => {
  const trending = await Video.find({})
    .populate('channel', 'name avatar')
    .sort({ trendingScore: -1 })
    .limit(20);

  res.json(trending);
});

module.exports = {
  uploadVideo,
  getVideoById,
  toggleLikeVideo,
  getVideoFeed,
  getRecommendations,
  getTrendingVideos,
};
