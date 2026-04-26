const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  verifyOtp,
  resendOtp,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
  getUserProfile,
  googleLogin,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { authRateLimiter } = require('../middleware/rateLimitMiddleware');

// Rate limited routes
router.post('/register', authRateLimiter, registerUser);
router.post('/resend-otp', authRateLimiter, resendOtp);
router.post('/forgot-password', authRateLimiter, forgotPassword);
router.post('/verify-otp', authRateLimiter, verifyOtp);
router.post('/verify-reset-otp', authRateLimiter, verifyResetOtp);

// Standard routes
router.post('/login', loginUser);
router.post('/google', googleLogin);
router.post('/reset-password', resetPassword);
router.get('/profile', protect, getUserProfile);

module.exports = router;
