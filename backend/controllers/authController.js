const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

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

  const user = await User.create({
    username,
    email,
    password,
    referralCode,
  });

  // Handle referral logic if a referral code was provided
  const { referredBy } = req.body;
  if (referredBy) {
    const referrerUser = await User.findOne({ referralCode: referredBy });
    if (referrerUser) {
      const Referral = require('../models/Referral');
      await Referral.create({
        referrer: referrerUser._id,
        referredUser: user._id,
        isActive: false, // will activate on first login
      });
    }
  }

  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    // Activate referral if this is the first login
    const Referral = require('../models/Referral');
    const pendingReferral = await Referral.findOne({ referredUser: user._id, isActive: false });
    
    if (pendingReferral) {
      pendingReferral.isActive = true;
      await pendingReferral.save();
      
      // Increment referrer's referral count
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

module.exports = { registerUser, loginUser };
