const asyncHandler = require('express-async-handler');
const WatchHistory = require('../models/WatchHistory');

// @desc    Get user watch history
// @route   GET /api/history
// @access  Private
const getWatchHistory = asyncHandler(async (req, res) => {
  const history = await WatchHistory.find({ user: req.user._id })
    .populate({
      path: 'video',
      populate: {
        path: 'channel',
        select: 'name avatar',
      },
    })
    .sort({ watchedAt: -1 });

  res.json(history);
});

// @desc    Delete from watch history
// @route   DELETE /api/history/:id
// @access  Private
const deleteHistoryItem = asyncHandler(async (req, res) => {
  const historyItem = await WatchHistory.findById(req.params.id);

  if (!historyItem) {
    res.status(404);
    throw new Error('History item not found');
  }

  if (historyItem.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to delete this item');
  }

  await historyItem.deleteOne();
  res.json({ message: 'History item removed' });
});

// @desc    Add video to watch history
// @route   POST /api/history
// @access  Private
const addToHistory = asyncHandler(async (req, res) => {
  const { videoId } = req.body;

  let historyItem = await WatchHistory.findOne({ user: req.user._id, video: videoId });

  if (historyItem) {
    historyItem.watchedAt = Date.now();
    await historyItem.save();
  } else {
    historyItem = await WatchHistory.create({
      user: req.user._id,
      video: videoId,
    });
  }

  res.status(200).json(historyItem);
});

module.exports = {
  getWatchHistory,
  deleteHistoryItem,
  addToHistory,
};
