const mongoose = require('mongoose');

const channelSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // One user, one channel
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    banner: {
      type: String,
      default: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
    },
    avatar: {
      type: String,
      default: function() {
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(this.name || 'Channel')}&background=random&color=fff&size=256`;
      },
    },
    subscribersCount: {
      type: Number,
      default: 0,
    },
    totalViews: {
      type: Number,
      default: 0,
    },
    earnings: {
      type: Number,
      default: 0, // Computed earnings based on totalViews or other metrics
    },
  },
  {
    timestamps: true,
  }
);

const Channel = mongoose.model('Channel', channelSchema);
module.exports = Channel;
