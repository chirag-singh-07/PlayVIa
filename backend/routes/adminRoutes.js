const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getRecentVideos,
  getRecentUsers,
  getPendingReports,
  getAllUsers,
  toggleUserBan,
  deleteUser,
  getAllVideos,
  deleteVideo,
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
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/stats', protect, admin, getAdminStats);
router.get('/recent-videos', protect, admin, getRecentVideos);
router.get('/recent-users', protect, admin, getRecentUsers);
router.get('/reports', protect, admin, getPendingReports);
router.get('/users', protect, admin, getAllUsers);
router.put('/users/:id/ban', protect, admin, toggleUserBan);
router.delete('/users/:id', protect, admin, deleteUser);
router.get('/videos', protect, admin, getAllVideos);
router.delete('/videos/:id', protect, admin, deleteVideo);
router.get('/reports/all', protect, admin, getAllReports);
router.put('/reports/:id/resolve', protect, admin, resolveReport);

router.get('/categories', protect, admin, getCategories);
router.post('/categories', protect, admin, addCategory);
router.put('/categories/:id', protect, admin, updateCategory);
router.delete('/categories/:id', protect, admin, deleteCategory);

router.get('/announcements', protect, admin, getAnnouncements);
router.post('/announcements', protect, admin, createAnnouncement);

router.get('/settings', protect, admin, getSettings);
router.put('/settings', protect, admin, updateSettings);

router.get('/comments', protect, admin, getAllComments);
router.delete('/comments/:id', protect, admin, deleteComment);

router.get('/creator-applications', protect, admin, getCreatorApplications);
router.put('/creator-applications/:id', protect, admin, updateCreatorApplication);

router.get('/channels', protect, admin, getAllChannels);

module.exports = router;
