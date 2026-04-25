const express = require('express');
const router = express.Router();
const { getChannelEarnings } = require('../controllers/earningsController');
const { protect } = require('../middleware/authMiddleware');

router.route('/:channelId')
  .get(protect, getChannelEarnings);

module.exports = router;
