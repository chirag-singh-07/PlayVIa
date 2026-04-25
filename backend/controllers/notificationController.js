const asyncHandler = require('express-async-handler');
const Notification = require('../models/Notification');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id })
    .populate('sender', 'username avatar')
    .populate('relatedVideo', 'title thumbnailUrl')
    .sort({ createdAt: -1 })
    .limit(50); // Get latest 50

  res.json(notifications);
});

// @desc    Mark all or single notification as read
// @route   PUT /api/notifications/read
// @access  Private
const markAsRead = asyncHandler(async (req, res) => {
  const { notificationId } = req.body;

  if (notificationId) {
    // Mark specific notification
    const notification = await Notification.findById(notificationId);
    if (notification && notification.user.toString() === req.user._id.toString()) {
      notification.isRead = true;
      await notification.save();
      res.json({ message: 'Notification marked as read' });
    } else {
      res.status(404);
      throw new Error('Notification not found');
    }
  } else {
    // Mark all as read
    await Notification.updateMany({ user: req.user._id, isRead: false }, { isRead: true });
    res.json({ message: 'All notifications marked as read' });
  }
});

module.exports = {
  getNotifications,
  markAsRead,
};
