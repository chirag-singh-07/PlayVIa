const cron = require('node-cron');
const Video = require('../models/Video');
const Notification = require('../models/Notification');

const initCronJobs = () => {
  // 1. Update trending score for videos every hour
  cron.schedule('0 * * * *', async () => {
    console.log('Running background job: Updating trending scores...');
    try {
      const videos = await Video.find({});
      for (const video of videos) {
        // Simple formula: score = views / hours_since_upload
        // Prevent division by zero by setting a min of 1 hour
        const hoursSinceUpload = Math.max(1, (Date.now() - new Date(video.createdAt).getTime()) / (1000 * 60 * 60));
        video.trendingScore = video.views / hoursSinceUpload;
        await video.save();
      }
      console.log('Trending scores updated successfully.');
    } catch (error) {
      console.error('Error updating trending scores:', error);
    }
  });

  // 2. Clean old notifications (older than 30 days) every day at midnight
  cron.schedule('0 0 * * *', async () => {
    console.log('Running background job: Cleaning old notifications...');
    try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const result = await Notification.deleteMany({ createdAt: { $lt: thirtyDaysAgo } });
      console.log(`Cleaned up ${result.deletedCount} old notifications.`);
    } catch (error) {
      console.error('Error cleaning old notifications:', error);
    }
  });

  // 3. Expire boosts every 30 minutes
  cron.schedule('*/30 * * * *', async () => {
    console.log('Running background job: Checking for expired boosts...');
    try {
      const now = new Date();
      // Reset isBoosted for videos that have reached their limit
      const result = await Video.updateMany(
        { isBoosted: true, boostedUntil: { $lt: now } },
        { $set: { isBoosted: false } }
      );

      // Mark Boost records as expired
      const Boost = require('../models/Boost');
      await Boost.updateMany(
        { status: 'active', endDate: { $lt: now } },
        { $set: { status: 'expired' } }
      );

      console.log(`Expired ${result.modifiedCount} video boosts.`);
    } catch (error) {
      console.error('Error expiring boosts:', error);
    }
  });
};

module.exports = initCronJobs;
