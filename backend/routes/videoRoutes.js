const express = require('express');
const router = express.Router();
const { uploadVideo, getVideoById, toggleLikeVideo, getVideoFeed, getRecommendations, getTrendingVideos } = require('../controllers/videoController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

router.post(
  '/upload',
  protect,
  upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 },
  ]),
  uploadVideo
);

router.get('/feed', getVideoFeed);
router.get('/trending', getTrendingVideos);
router.get('/recommendations', protect, getRecommendations);
router.get('/:id', getVideoById);
router.post('/like', protect, toggleLikeVideo);

module.exports = router;
