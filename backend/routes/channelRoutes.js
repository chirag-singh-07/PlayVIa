const express = require('express');
const router = express.Router();
const { createChannel, getChannelById } = require('../controllers/channelController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create', protect, createChannel);
router.get('/:id', getChannelById);

module.exports = router;
