const express = require('express');
const router = express.Router();
const { requestPayout, getPayoutHistory } = require('../controllers/payoutController');
const { protect } = require('../middleware/authMiddleware');

router.post('/request', protect, requestPayout);
router.get('/history', protect, getPayoutHistory);

module.exports = router;
