const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { generateOtp, hashOtp } = require('../utils/otpUtils');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/emailService');
const axios = require('axios');
const crypto = require('crypto');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, name, phone, referredBy } = req.body;

  // Basic validation
  if (!username || !email || !password) {
    res.status(400);
    throw new Error('Please provide username, email and password');
  }

  // Check for duplicate email
  let emailExists = await User.findOne({ email: email.toLowerCase() });
  if (emailExists) {
    if (emailExists.isVerified) {
      res.status(400);
      throw new Error('An account with this email already exists');
    }
    // If it exists but is NOT verified, we will just update the user instead of failing.
  }

  // Check for duplicate username
  const usernameExists = await User.findOne({ username: username.toLowerCase() });
  if (usernameExists) {
    // If it exists, but it belongs to the same unverified user we are trying to update, allow it.
    if (!emailExists || usernameExists._id.toString() !== emailExists._id.toString()) {
      res.status(400);
      throw new Error('This username is already taken. Please choose another.');
    }
  }

  // Generate unique referral code
  const referralCode = require('crypto').randomBytes(4).toString('hex').toUpperCase();

  // Generate OTP
  const rawOtp = generateOtp();
  const hashedOtp = await hashOtp(rawOtp);
  const expiryTime = new Date(Date.now() + (process.env.OTP_EXPIRY_TIME || 10) * 60 * 1000);

  let user;
  try {
    if (emailExists) {
      // Update existing unverified user with new details and new OTP
      emailExists.username = username.toLowerCase();
      emailExists.password = password; // Will be hashed by Mongoose pre-save hook
      if (name) emailExists.name = name;
      if (phone) emailExists.phone = phone;
      emailExists.otp = hashedOtp;
      emailExists.otpExpiry = expiryTime;
      emailExists.otpAttempts = 0;
      await emailExists.save();
      user = emailExists;
    } else {
      user = await User.create({
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        password,
        name,
        phone,
        referralCode,
        otp: hashedOtp,
        otpExpiry: expiryTime,
        isVerified: false,
      });
    }
  } catch (dbError) {
    // Handle MongoDB duplicate key errors that slipped through
    if (dbError.code === 11000) {
      const field = Object.keys(dbError.keyPattern || {})[0] || 'field';
      res.status(400);
      throw new Error(`This ${field} is already registered. Please use a different one.`);
    }
    throw dbError;
  }

  // Handle referral logic (non-fatal)
  if (referredBy) {
    try {
      const referrerUser = await User.findOne({ referralCode: referredBy });
      if (referrerUser) {
        const Referral = require('../models/Referral');
        await Referral.create({
          referrer: referrerUser._id,
          referredUser: user._id,
          isActive: false,
        });
      }
    } catch (refError) {
      console.error('[AUTH] Referral error (non-fatal):', refError.message);
    }
  }

  // Send OTP email (non-fatal — user is created regardless)
  let emailSent = false;
  try {
    await sendVerificationEmail(user.email, rawOtp);
    emailSent = true;
    console.log(`[AUTH] ✅ OTP email sent to ${user.email}`);
  } catch (emailError) {
    console.error('[AUTH] ⚠️ Email sending failed:', emailError.message);
    console.log(`[AUTH] 🔑 OTP for ${user.email}: ${rawOtp}`);
  }

  res.status(201).json({
    message: emailSent
      ? 'Registration successful. Please check your email for the verification OTP.'
      : 'Registration successful. Email delivery failed — please use the OTP from your admin/server logs or request a resend.',
    email: user.email,
    // Return OTP directly in non-production when email fails (for testing)
    ...(process.env.NODE_ENV !== 'production' && !emailSent && { devOtp: rawOtp }),
  });
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

    // Find user's channel
    const Channel = require('../models/Channel');
    const channel = await Channel.findOne({ owner: user._id });

    res.json({
      _id: user._id,
      name: user.name || user.username,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      channel: channel,
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

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    // Find user's channel
    const Channel = require('../models/Channel');
    const channel = await Channel.findOne({ owner: user._id });

    res.json({
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      referralCode: user.referralCode,
      referralCount: user.referralCount,
      channel: channel,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Auth with Google
// @route   POST /api/auth/google
// @access  Public
const googleLogin = asyncHandler(async (req, res) => {
  const { accessToken } = req.body;

  if (!accessToken) {
    res.status(400);
    throw new Error('Access token is required');
  }

  try {
    // Verify token with Google
    const { data: googleUser } = await axios.get(
      `https://www.googleapis.com/oauth2/v3/userinfo`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    if (!googleUser || !googleUser.email) {
      res.status(400);
      throw new Error('Invalid Google token');
    }

    // Find or create user
    let user = await User.findOne({ email: googleUser.email.toLowerCase() });

    if (!user) {
      // Auto-register new Google user
      const randomPassword = crypto.randomBytes(16).toString('hex');
      const baseUsername = (googleUser.name || googleUser.email.split('@')[0])
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9_]/g, '');
      
      const uniqueUsername = `${baseUsername}_${crypto.randomBytes(3).toString('hex')}`;
      const referralCode = crypto.randomBytes(4).toString('hex').toUpperCase();

      user = await User.create({
        name: googleUser.name || uniqueUsername,
        username: uniqueUsername,
        email: googleUser.email.toLowerCase(),
        password: randomPassword,
        avatar: googleUser.picture,
        isVerified: true, // Google emails are pre-verified
        referralCode,
      });
    }

    // Find user's channel
    const Channel = require('../models/Channel');
    const channel = await Channel.findOne({ owner: user._id });

    res.json({
      _id: user._id,
      name: user.name || user.username,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      channel: channel,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Google Auth Error:', error.response?.data || error.message);
    res.status(401);
    throw new Error('Google authentication failed');
  }
});

module.exports = {
  registerUser,
  loginUser,
  googleLogin,
  verifyOtp,
  resendOtp,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
  getUserProfile,
};
