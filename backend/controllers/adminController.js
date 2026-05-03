const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Video = require('../models/Video');
const Report = require('../models/Report');
const Category = require('../models/Category');
const Announcement = require('../models/Announcement');
const Setting = require('../models/Setting');
const Comment = require('../models/Comment');
const CreatorApplication = require('../models/CreatorApplication');
const Channel = require('../models/Channel');
const Payout = require('../models/Payout');
const Banner = require('../models/Banner');
const Ad = require('../models/Ad');
const AppVersion = require('../models/AppVersion');
const AdminLog = require('../models/AdminLog');
const Boost = require('../models/Boost');
const { cloudinary } = require('../config/cloudinary');

// @desc    Get admin dashboard stats
const getAdminStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalVideos = await Video.countDocuments();
  
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  // Views Today
  const videosUpdatedToday = await Video.find({ updatedAt: { $gte: startOfDay } });
  const viewsTodayCount = videosUpdatedToday.reduce((acc, v) => acc + (v.views || 0), 0);

  // Monthly Revenue (from Boosts)
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthlyBoosts = await Boost.find({ createdAt: { $gte: startOfMonth } });
  const monthlyRevenueTotal = monthlyBoosts.reduce((acc, b) => acc + b.amount, 0);

  // Uploads Data (Last 14 days)
  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
  const uploads = await Video.aggregate([
    { $match: { createdAt: { $gte: fourteenDaysAgo } } },
    { $group: {
        _id: { $dateToString: { format: "%d/%m", date: "$createdAt" } },
        count: { $sum: 1 }
    }},
    { $sort: { "_id": 1 } }
  ]);
  const uploadsData = uploads.map(u => ({ day: u._id, uploads: u.count }));

  // Revenue Data (Last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const revenue = await Boost.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo } } },
    { $group: {
        _id: { $dateToString: { format: "%b", date: "$createdAt" } },
        total: { $sum: "$amount" }
    }}
  ]);
  const revenueByMonth = revenue.map(r => ({ month: r._id, revenue: r.total }));

  res.json({
    totalUsers,
    totalVideos,
    viewsToday: viewsTodayCount > 1000000 ? `${(viewsTodayCount / 1000000).toFixed(1)}M` : viewsTodayCount.toLocaleString('en-IN'),
    monthlyRevenue: `₹${monthlyRevenueTotal.toLocaleString('en-IN')}`,
    uploadsData,
    revenueByMonth,
    // Add mock DAU for now as we don't have a login session tracker yet
    dauData: Array.from({ length: 30 }, (_, i) => ({
      day: `${i+1}/5`,
      users: 380000 + Math.floor(Math.random() * 50000)
    }))
  });
});

// @desc    Get recent videos
// @route   GET /api/admin/recent-videos
// @access  Private/Admin
const getRecentVideos = asyncHandler(async (req, res) => {
  const videos = await Video.find()
    .sort({ createdAt: -1 })
    .limit(6)
    .populate('channel', 'name');
    
  res.json(videos);
});

// @desc    Get recent users
// @route   GET /api/admin/recent-users
// @access  Private/Admin
const getRecentUsers = asyncHandler(async (req, res) => {
  const users = await User.find()
    .sort({ createdAt: -1 })
    .limit(6)
    .select('-password');
    
  res.json(users);
});

// @desc    Get pending reports
// @route   GET /api/admin/reports
// @access  Private/Admin
const getPendingReports = asyncHandler(async (req, res) => {
  const reports = await Report.find({ status: 'pending' })
    .sort({ createdAt: -1 })
    .limit(5);
    
  res.json(reports);
});

// @desc    Get all users for admin
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json(users);
});

// @desc    Ban/Unban user
// @route   PUT /api/admin/users/:id/ban
// @access  Private/Admin
const toggleUserBan = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.isBanned = !user.isBanned;
    await user.save();
    res.json({ message: `User ${user.isBanned ? 'banned' : 'unbanned'} successfully` });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get all videos for admin
// @route   GET /api/admin/videos
// @access  Private/Admin
const getAllVideos = asyncHandler(async (req, res) => {
  const videos = await Video.find()
    .sort({ createdAt: -1 })
    .populate('channel', 'name avatar');
  res.json(videos);
});

// @desc    Delete video
// @route   DELETE /api/admin/videos/:id
// @access  Private/Admin
const deleteVideo = asyncHandler(async (req, res) => {
  const video = await Video.findById(req.params.id);

  if (video) {
    await video.deleteOne();
    res.json({ message: 'Video removed' });
  } else {
    res.status(404);
    throw new Error('Video not found');
  }
});

// @desc    Get all reports
// @route   GET /api/admin/reports/all
// @access  Private/Admin
const getAllReports = asyncHandler(async (req, res) => {
  const reports = await Report.find()
    .sort({ createdAt: -1 })
    .populate('reporter', 'username email');
  res.json(reports);
});

// @desc    Resolve report
// @route   PUT /api/admin/reports/:id/resolve
// @access  Private/Admin
const resolveReport = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id);

  if (report) {
    report.status = req.body.status || 'resolved';
    await report.save();
    res.json({ message: 'Report resolved' });
  } else {
    res.status(404);
    throw new Error('Report not found');
  }
});

// @desc    Get all categories
// @route   GET /api/admin/categories
// @access  Private/Admin
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ order: 1 });
  res.json(categories);
});

// @desc    Add category
// @route   POST /api/admin/categories
// @access  Private/Admin
const addCategory = asyncHandler(async (req, res) => {
  const { name, slug, icon, description, active } = req.body;
  const category = await Category.create({ name, slug, icon, description, active });
  res.status(201).json(category);
});

// @desc    Update category
// @route   PUT /api/admin/categories/:id
// @access  Private/Admin
const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (category) {
    category.name = req.body.name || category.name;
    category.slug = req.body.slug || category.slug;
    category.icon = req.body.icon || category.icon;
    category.description = req.body.description || category.description;
    category.active = req.body.active !== undefined ? req.body.active : category.active;
    const updated = await category.save();
    res.json(updated);
  } else {
    res.status(404);
    throw new Error('Category not found');
  }
});

// @desc    Delete category
// @route   DELETE /api/admin/categories/:id
// @access  Private/Admin
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (category) {
    await category.deleteOne();
    res.json({ message: 'Category removed' });
  } else {
    res.status(404);
    throw new Error('Category not found');
  }
});

// @desc    Get all announcements
// @route   GET /api/admin/announcements
// @access  Private/Admin
const getAnnouncements = asyncHandler(async (req, res) => {
  const announcements = await Announcement.find().sort({ createdAt: -1 });
  res.json(announcements);
});

// @desc    Create announcement
// @route   POST /api/admin/announcements
// @access  Private/Admin
const createAnnouncement = asyncHandler(async (req, res) => {
  const { title, message, target, when, scheduleAt } = req.body;
  
  // Calculate mock recipients count based on target
  let recipientsCount = 0;
  if (target === "All Users") recipientsCount = 524891;
  else if (target === "Creators") recipientsCount = 12400;
  else if (target === "Premium") recipientsCount = 38200;
  else recipientsCount = 1;

  const status = when === "later" ? "Scheduled" : "Sent";
  const scheduledTime = when === "later" ? new Date(scheduleAt) : new Date();

  const announcement = await Announcement.create({
    title,
    message,
    target,
    status,
    scheduledAt: scheduledTime,
    recipientsCount,
    openRate: 0,
  });

  res.status(201).json(announcement);
});

// @desc    Get settings
// @route   GET /api/admin/settings
// @access  Private/Admin
const getSettings = asyncHandler(async (req, res) => {
  let settings = await Setting.findOne();
  if (!settings) {
    settings = await Setting.create({});
  }
  res.json(settings);
});

// @desc    Update settings
// @route   PUT /api/admin/settings
// @access  Private/Admin
const updateSettings = asyncHandler(async (req, res) => {
  let settings = await Setting.findOne();
  if (!settings) {
    settings = await Setting.create({});
  }
  
  settings.general = req.body.general || settings.general;
  settings.upload = req.body.upload || settings.upload;
  settings.monetization = req.body.monetization || settings.monetization;
  settings.email = req.body.email || settings.email;
  settings.security = req.body.security || settings.security;
  settings.boost = req.body.boost || settings.boost;

  const updatedSettings = await settings.save();
  res.json(updatedSettings);
});

// @desc    Get all comments
// @route   GET /api/admin/comments
// @access  Private/Admin
const getAllComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find()
    .populate('user', 'username email avatar')
    .populate('video', 'title')
    .sort('-createdAt');
  res.json(comments);
});

// @desc    Delete comment
// @route   DELETE /api/admin/comments/:id
// @access  Private/Admin
const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (comment) {
    await comment.remove();
    res.json({ message: 'Comment removed' });
  } else {
    res.status(404);
    throw new Error('Comment not found');
  }
});

// @desc    Get all creator applications
// @route   GET /api/admin/creator-applications
// @access  Private/Admin
const getCreatorApplications = asyncHandler(async (req, res) => {
  const applications = await CreatorApplication.find()
    .populate('user', 'username email avatar')
    .sort('-createdAt');
  res.json(applications);
});

// @desc    Update creator application
// @route   PUT /api/admin/creator-applications/:id
// @access  Private/Admin
const updateCreatorApplication = asyncHandler(async (req, res) => {
  const application = await CreatorApplication.findById(req.params.id);
  if (application) {
    application.status = req.body.status || application.status;
    const updatedApplication = await application.save();
    res.json(updatedApplication);
  } else {
    res.status(404);
    throw new Error('Creator application not found');
  }
});

// @desc    Get all channels with stats
// @route   GET /api/admin/channels
// @access  Private/Admin
const getAllChannels = asyncHandler(async (req, res) => {
  const channels = await Channel.aggregate([
    {
      $lookup: {
        from: 'users',
        localField: 'owner',
        foreignField: '_id',
        as: 'owner'
      }
    },
    { $unwind: '$owner' },
    {
      $lookup: {
        from: 'videos',
        localField: '_id',
        foreignField: 'channel',
        as: 'videos'
      }
    },
    {
      $project: {
        _id: 1,
        name: 1,
        description: 1,
        avatar: 1,
        banner: 1,
        subscribers: 1,
        subscribersCount: { $size: '$subscribers' },
        owner: {
          _id: 1,
          username: 1,
          email: 1,
          avatar: 1
        },
        videoCount: { $size: '$videos' },
        totalViews: { $sum: '$videos.views' },
        createdAt: 1
      }
    },
    { $sort: { subscribersCount: -1 } }
  ]);
  res.json(channels);
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.role === 'admin') {
      res.status(400);
      throw new Error('Cannot delete admin user');
    }
    await user.deleteOne();
    res.json({ message: 'User removed successfully' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Upload a video by admin
// @route   POST /api/admin/videos/upload
// @access  Private/Admin
const uploadVideoByAdmin = asyncHandler(async (req, res) => {
  const { title, description, videoType, category } = req.body;

  let channel = await Channel.findOne({ owner: req.user._id });
  if (!channel) {
    // Auto-create a channel for admin if they don't have one
    channel = await Channel.create({
      owner: req.user._id,
      name: `${req.user.username} Admin`,
      description: 'Official Admin Channel',
    });
  }

  if (!req.files || !req.files.video) {
    res.status(400);
    throw new Error('No video file provided');
  }

  const videoFile = req.files.video[0];
  const thumbnailFile = req.files.thumbnail ? req.files.thumbnail[0] : null;

  // Extract duration from file metadata (Cloudinary) or request body
  const finalDuration = req.body.duration ? Number(req.body.duration) : (videoFile.duration ? Math.round(videoFile.duration) : 0);

  // Fallback thumbnail if not provided
  let finalThumbnailUrl = thumbnailFile ? thumbnailFile.location : '';
  if (!finalThumbnailUrl && videoFile.location && videoFile.location.includes('cloudinary.com')) {
    // Generate a frame capture from Cloudinary video
    finalThumbnailUrl = videoFile.location
      .replace(/\.[^/.]+$/, ".jpg")
      .replace("/video/upload/", "/video/upload/so_auto/");
  }

  const video = await Video.create({
    channel: channel._id,
    title,
    description,
    videoUrl: videoFile.location,
    thumbnailUrl: finalThumbnailUrl,
    videoType: videoType || 'video',
    duration: finalDuration,
    category: category || 'General',
    isPublished: true,
  });

  res.status(201).json(video);
});

// @desc    Get storage statistics
// @route   GET /api/admin/storage
// @access  Private/Admin
const getStorageStats = asyncHandler(async (req, res) => {
  let storageUsage = {};
  try {
    storageUsage = await cloudinary.api.usage();
  } catch (error) {
    console.error('Storage usage fetch failed:', error);
    // Return empty or mock usage if Cloudinary fails
    storageUsage = {
      plan: {
        storage: { used: 0, limit: 10 * 1024 * 1024 * 1024 },
        bandwidth: { used: 0, limit: 10 * 1024 * 1024 * 1024 }
      }
    };
  }
  
  const videoCount = await Video.countDocuments();
  const shortCount = await Video.countDocuments({ videoType: 'short' });
  const totalViews = await Video.aggregate([
    { $group: { _id: null, total: { $sum: "$views" } } }
  ]);

  res.json({
    cloudinary: storageUsage,
    db: {
      videoCount,
      shortCount,
      totalViews: totalViews[0]?.total || 0,
    }
  });
});

// @desc    Get all withdrawals for admin
// @route   GET /api/admin/withdrawals
// @access  Private/Admin
const getWithdrawals = asyncHandler(async (req, res) => {
  const withdrawals = await Payout.find()
    .populate('user', 'username email avatar')
    .sort('-createdAt');
  res.json(withdrawals);
});

// @desc    Update withdrawal status
// @route   PUT /api/admin/withdrawals/:id
// @access  Private/Admin
const updateWithdrawalStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const withdrawal = await Payout.findById(req.params.id);

  if (withdrawal) {
    withdrawal.status = status;
    if (status === 'paid') {
      withdrawal.processedAt = Date.now();
    }
    await withdrawal.save();
    res.json(withdrawal);
  } else {
    res.status(404);
    throw new Error('Withdrawal request not found');
  }
});

// @desc    Get all banners
// @route   GET /api/admin/banners
// @access  Private/Admin
const getBanners = asyncHandler(async (req, res) => {
  const banners = await Banner.find().sort({ order: 1 });
  res.json(banners);
});

// @desc    Add banner
// @route   POST /api/admin/banners
// @access  Private/Admin
const addBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.create(req.body);
  res.status(201).json(banner);
});

// @desc    Update banner
// @route   PUT /api/admin/banners/:id
// @access  Private/Admin
const updateBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(banner);
});

// @desc    Delete banner
// @route   DELETE /api/admin/banners/:id
// @access  Private/Admin
const deleteBanner = asyncHandler(async (req, res) => {
  await Banner.findByIdAndDelete(req.params.id);
  res.json({ message: 'Banner removed' });
});

// @desc    Get all ads
// @route   GET /api/admin/ads
// @access  Private/Admin
const getAds = asyncHandler(async (req, res) => {
  const ads = await Ad.find().sort({ createdAt: -1 });
  res.json(ads);
});

// @desc    Add ad
// @route   POST /api/admin/ads
// @access  Private/Admin
const addAd = asyncHandler(async (req, res) => {
  const ad = await Ad.create(req.body);
  res.status(201).json(ad);
});

// @desc    Update ad
// @route   PUT /api/admin/ads/:id
// @access  Private/Admin
const updateAd = asyncHandler(async (req, res) => {
  const ad = await Ad.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(ad);
});

// @desc    Delete ad
// @route   DELETE /api/admin/ads/:id
// @access  Private/Admin
const deleteAd = asyncHandler(async (req, res) => {
  await Ad.findByIdAndDelete(req.params.id);
  res.json({ message: 'Ad removed' });
});

// @desc    Get all admin logs
// @route   GET /api/admin/logs
// @access  Private/Admin
const getAdminLogs = asyncHandler(async (req, res) => {
  const logs = await AdminLog.find()
    .populate('admin', 'username email')
    .sort({ createdAt: -1 })
    .limit(100);
  res.json(logs);
});

// @desc    Get all app versions
// @route   GET /api/admin/app-versions
// @access  Private/Admin
const getAppVersions = asyncHandler(async (req, res) => {
  const versions = await AppVersion.find().sort({ createdAt: -1 });
  res.json(versions);
});

// @desc    Add app version
// @route   POST /api/admin/app-versions
// @access  Private/Admin
const addAppVersion = asyncHandler(async (req, res) => {
  const version = await AppVersion.create(req.body);
  res.status(201).json(version);
});

module.exports = {
  getAdminStats,
  getRecentVideos,
  getRecentUsers,
  getPendingReports,
  getAllUsers,
  toggleUserBan,
  deleteUser,
  getAllVideos,
  deleteVideo,
  uploadVideoByAdmin,
  getAllReports,
  resolveReport,
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  getAnnouncements,
  createAnnouncement,
  getSettings,
  updateSettings,
  getAllComments,
  deleteComment,
  getCreatorApplications,
  updateCreatorApplication,
  getAllChannels,
  getStorageStats,
  getWithdrawals,
  updateWithdrawalStatus,
  getBanners,
  addBanner,
  updateBanner,
  deleteBanner,
  getAds,
  addAd,
  updateAd,
  deleteAd,
  getAdminLogs,
  getAppVersions,
  addAppVersion,
};
