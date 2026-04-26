const express = require('express');
const router = express.Router();
const { uploadVideo, getVideoById, toggleLikeVideo, getVideoFeed, getRecommendations, getTrendingVideos, getCategories, updateVideoDuration } = require('../controllers/videoController');
const { protect, protectOptional } = require('../middleware/authMiddleware');
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

router.get('/feed', protectOptional, getVideoFeed);
router.get('/trending', getTrendingVideos);
router.get('/recommendations', protect, getRecommendations);
router.get('/categories', getCategories);
router.get('/:id', getVideoById);
router.post('/:id/like', protect, toggleLikeVideo);
router.post('/like', protect, toggleLikeVideo); // Keep old route for compatibility

router.put('/:id/duration', protectOptional, updateVideoDuration);
module.exports = router;
