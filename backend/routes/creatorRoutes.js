const express = require('express');
const router = express.Router();
const { getCreatorStats, getCreatorVideos, getCreatorAnalytics, getCreatorSubscribers, getCreatorComments, getCreatorPayouts, createPayoutRequest } = require('../controllers/creatorController');
const { protect } = require('../middleware/authMiddleware');

router.get('/stats', protect, getCreatorStats);
router.get('/videos', protect, getCreatorVideos);
router.get('/analytics', protect, getCreatorAnalytics);
router.get('/subscribers', protect, getCreatorSubscribers);
router.get('/comments', protect, getCreatorComments);
router.get('/payouts', protect, getCreatorPayouts);
router.post('/payouts', protect, createPayoutRequest);




module.exports = router;
