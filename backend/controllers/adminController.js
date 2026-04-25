const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Video = require('../models/Video');
const Report = require('../models/Report');
const Category = require('../models/Category');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalVideos = await Video.countDocuments();
  
  // Mocking some data for now that we don't track specifically yet
  const stats = {
    totalUsers,
    totalVideos,
    viewsToday: '2.4M', // This should be calculated from a views tracking table
    monthlyRevenue: '₹8,42,500', // This should be calculated from earnings
  };

  res.json(stats);
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
    .populate('channel', 'name');
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

module.exports = {
  getAdminStats,
  getRecentVideos,
  getRecentUsers,
  getPendingReports,
  getAllUsers,
  toggleUserBan,
  getAllVideos,
  deleteVideo,
  getAllReports,
  resolveReport,
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
};
