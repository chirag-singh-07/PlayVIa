const express = require('express');
const router = express.Router();
const { toggleSubscribe } = require('../controllers/subscriptionController');
const { protect } = require('../middleware/authMiddleware');

router.post('/:channelId', protect, toggleSubscribe);

module.exports = router;
