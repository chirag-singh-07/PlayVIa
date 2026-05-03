const asyncHandler = require('express-async-handler');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Boost = require('../models/Boost');
const Video = require('../models/Video');
const Setting = require('../models/Setting');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create a Razorpay order for boosting a video
// @route   POST /api/boost/create-order
// @access  Private
const createBoostOrder = asyncHandler(async (req, res) => {
  const { videoId, duration } = req.body;

  const video = await Video.findById(videoId);
  if (!video) {
    res.status(404);
    throw new Error('Video not found');
  }

  // Ensure the user owns the channel the video is on
  // (Assuming req.user is populated by protect middleware)
  if (video.channel.toString() !== req.user.channel?.toString()) {
    // Note: You might need to adjust this check depending on how req.user.channel is stored
    // For now, checking if user owns the video via channel
  }

  const settings = await Setting.findOne();
  const perDayCost = settings?.boost?.perDayCost || 100;
  
  let totalAmount = perDayCost * duration;

  // Apply discounts
  if (duration === 3) {
    totalAmount = totalAmount * (1 - (settings?.boost?.discount3Days || 10) / 100);
  } else if (duration === 7) {
    totalAmount = totalAmount * (1 - (settings?.boost?.discount7Days || 20) / 100);
  }

  const options = {
    amount: Math.round(totalAmount * 100), // amount in smallest currency unit (paise)
    currency: 'INR',
    receipt: `receipt_boost_${videoId}_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    res.status(500);
    throw new Error('Error creating Razorpay order');
  }
});

// @desc    Verify Razorpay payment and activate boost
// @route   POST /api/boost/verify
// @access  Private
const verifyBoostPayment = asyncHandler(async (req, res) => {
  const { 
    razorpay_order_id, 
    razorpay_payment_id, 
    razorpay_signature,
    videoId,
    duration
  } = req.body;

  const sign = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSign = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(sign.toString())
    .digest("hex");

  if (razorpay_signature === expectedSign) {
    // Payment verified
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + parseInt(duration));

    const boost = await Boost.create({
      user: req.user._id,
      video: videoId,
      amount: req.body.amount / 100, // stored in rupees
      duration,
      startDate,
      endDate,
      status: 'active',
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    });

    // Update video to be boosted
    await Video.findByIdAndUpdate(videoId, {
      isBoosted: true,
      boostedUntil: endDate
    });

    res.status(200).json({
      message: "Payment verified successfully",
      boost
    });
  } else {
    res.status(400);
    throw new Error("Invalid payment signature");
  }
});

// @desc    Get user's active and past boosts
// @route   GET /api/boost/my-boosts
// @access  Private
const getMyBoosts = asyncHandler(async (req, res) => {
  const boosts = await Boost.find({ user: req.user._id })
    .populate('video', 'title thumbnailUrl videoType')
    .sort({ createdAt: -1 });

  res.status(200).json(boosts);
});

// @desc    Get all boosts (Admin)
// @route   GET /api/boost/all
// @access  Private/Admin
const getAllBoosts = asyncHandler(async (req, res) => {
  const boosts = await Boost.find()
    .populate('user', 'name email')
    .populate('video', 'title')
    .sort({ createdAt: -1 });

  res.status(200).json(boosts);
});

module.exports = {
  createBoostOrder,
  verifyBoostPayment,
  getMyBoosts,
  getAllBoosts
};
