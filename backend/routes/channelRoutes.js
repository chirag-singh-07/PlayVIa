const express = require('express');
const router = express.Router();
const { createChannel, getChannelById, getMyChannel, getChannelVideos, getChannelShorts, updateChannel } = require('../controllers/channelController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

router.get('/me', protect, getMyChannel);
router.post(
  '/create',
  protect,
  upload.fields([
    { name: 'banner', maxCount: 1 },
    { name: 'avatar', maxCount: 1 },
  ]),
  createChannel
);
router.get('/:id', getChannelById);
router.get('/:id/videos', getChannelVideos);
router.get('/:id/shorts', getChannelShorts);
router.get('/:id/all', getAllChannelContent);
router.put(
  '/:id',
  protect,
  upload.fields([
    { name: 'banner', maxCount: 1 },
    { name: 'avatar', maxCount: 1 },
  ]),
  updateChannel
);

module.exports = router;
