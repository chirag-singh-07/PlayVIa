const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { generateOtp, hashOtp } = require('../utils/otpUtils');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/emailService');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Generate unique referral code
  const crypto = require('crypto');
  const referralCode = crypto.randomBytes(4).toString('hex').toUpperCase();

  // Generate OTP
  const rawOtp = generateOtp();
  const hashedOtp = await hashOtp(rawOtp);
  const expiryTime = new Date(Date.now() + (process.env.OTP_EXPIRY_TIME || 10) * 60 * 1000);

  const user = await User.create({
    username,
    email,
    password,
    referralCode,
    otp: hashedOtp,
    otpExpiry: expiryTime,
    isVerified: false,
  });

  // Handle referral logic
  const { referredBy } = req.body;
  if (referredBy) {
    const referrerUser = await User.findOne({ referralCode: referredBy });
    if (referrerUser) {
      const Referral = require('../models/Referral');
      await Referral.create({
        referrer: referrerUser._id,
        referredUser: user._id,
        isActive: false, // will activate on first login/verification
      });
    }
  }

  if (user) {
    await sendVerificationEmail(user.email, rawOtp);
    res.status(201).json({
      message: 'Registration successful. Please check your email for the verification OTP.',
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Verify Registration OTP
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (user.isVerified) {
    res.status(400);
    throw new Error('User is already verified');
  }

  if (user.otpExpiry < Date.now()) {
    res.status(400);
    throw new Error('OTP has expired');
  }

  const isMatch = await user.matchOtp(otp);

  if (isMatch) {
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    user.otpAttempts = 0;
    await user.save();

    res.json({ message: 'Email verified successfully. You can now login.' });
  } else {
    user.otpAttempts += 1;
    await user.save();

    if (user.otpAttempts >= 3) {
      res.status(403);
      throw new Error('Too many failed attempts. Please resend a new OTP.');
    }
    res.status(400);
    throw new Error('Invalid OTP');
  }
});

// @desc    Resend Verification OTP
// @route   POST /api/auth/resend-otp
// @access  Public
const resendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user || user.isVerified) {
    res.status(400);
    throw new Error('Invalid request');
  }

  const rawOtp = generateOtp();
  const hashedOtp = await hashOtp(rawOtp);
  user.otp = hashedOtp;
  user.otpExpiry = new Date(Date.now() + (process.env.OTP_EXPIRY_TIME || 10) * 60 * 1000);
  user.otpAttempts = 0;
  await user.save();

  await sendVerificationEmail(user.email, rawOtp);
  res.json({ message: 'A new OTP has been sent to your email.' });
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    if (!user.isVerified) {
      res.status(401);
      throw new Error('Please verify your email first');
    }

    const Referral = require('../models/Referral');
    const pendingReferral = await Referral.findOne({ referredUser: user._id, isActive: false });
    
    if (pendingReferral) {
      pendingReferral.isActive = true;
      await pendingReferral.save();
      await User.findByIdAndUpdate(pendingReferral.referrer, { $inc: { referralCount: 1 } });
    }

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Forgot Password - Request OTP
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.json({ message: 'If that email exists, we have sent a reset OTP.' });
  }

  const rawOtp = generateOtp();
  const hashedOtp = await hashOtp(rawOtp);
  user.resetOtp = hashedOtp;
  user.resetOtpExpiry = new Date(Date.now() + (process.env.OTP_EXPIRY_TIME || 10) * 60 * 1000);
  user.otpAttempts = 0;
  await user.save();

  await sendPasswordResetEmail(user.email, rawOtp);
  res.json({ message: 'A password reset OTP has been sent to your email.' });
});

// @desc    Verify Reset OTP
// @route   POST /api/auth/verify-reset-otp
// @access  Public
const verifyResetOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });

  if (!user || !user.resetOtp || user.resetOtpExpiry < Date.now()) {
    res.status(400);
    throw new Error('Invalid or expired OTP');
  }

  const isMatch = await user.matchResetOtp(otp);

  if (isMatch) {
    res.json({ success: true, message: 'OTP verified. You can now reset your password.' });
  } else {
    user.otpAttempts += 1;
    await user.save();
    if (user.otpAttempts >= 3) {
      res.status(403);
      throw new Error('Too many failed attempts. Please request a new OTP.');
    }
    res.status(400);
    throw new Error('Invalid OTP');
  }
});

// @desc    Reset Password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const isMatch = await user.matchResetOtp(otp);
  if (!isMatch || user.resetOtpExpiry < Date.now()) {
    res.status(400);
    throw new Error('Invalid or expired OTP');
  }

  user.password = newPassword;
  user.resetOtp = undefined;
  user.resetOtpExpiry = undefined;
  user.otpAttempts = 0;
  await user.save();

  res.json({ message: 'Password reset successful. You can now login.' });
});

module.exports = {
  registerUser,
  loginUser,
  verifyOtp,
  resendOtp,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
};
