const express = require('express');
const router = express.Router();
const { toggleSubscribe, getSubscribedChannels, getSubscriptionVideos } = require('../controllers/subscriptionController');
const { protect } = require('../middleware/authMiddleware');

router.get('/channels', protect, getSubscribedChannels);
router.get('/videos', protect, getSubscriptionVideos);
router.post('/:channelId', protect, toggleSubscribe);

module.exports = router;
