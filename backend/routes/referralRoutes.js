const express = require('express');
const router = express.Router();
const { getReferralStats, applyReferral } = require('../controllers/referralController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getReferralStats);

router.route('/apply')
  .post(protect, applyReferral);

module.exports = router;
