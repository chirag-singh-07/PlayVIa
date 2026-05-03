const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema(
  {
    channel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Channel',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    thumbnailUrl: {
      type: String,
    },
    duration: {
      type: Number, // duration in seconds
    },
    views: {
      type: Number,
      default: 0,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    videoType: {
      type: String,
      enum: ['video', 'short'],
      default: 'video',
      index: true,
    },
    category: {
      type: String,
      default: 'General',
      index: true,
    },
    tags: [
      {
        type: String,
      },
    ],
    trendingScore: {
      type: Number,
      default: 0,
      index: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    isBoosted: {
      type: Boolean,
      default: false,
      index: true,
    },
    boostedUntil: {
      type: Date,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Video = mongoose.model('Video', videoSchema);
module.exports = Video;
