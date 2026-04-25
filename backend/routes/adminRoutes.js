const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/stats', protect, admin, getAdminStats);
router.get('/recent-videos', protect, admin, getRecentVideos);
router.get('/recent-users', protect, admin, getRecentUsers);
router.get('/reports', protect, admin, getPendingReports);
router.get('/users', protect, admin, getAllUsers);
router.put('/users/:id/ban', protect, admin, toggleUserBan);
router.get('/videos', protect, admin, getAllVideos);
router.delete('/videos/:id', protect, admin, deleteVideo);
router.get('/reports/all', protect, admin, getAllReports);
router.put('/reports/:id/resolve', protect, admin, resolveReport);

module.exports = router;
