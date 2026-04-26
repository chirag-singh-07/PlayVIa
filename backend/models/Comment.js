const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Video',
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    likesCount: {
      type: Number,
      default: 0
    },
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
      index: true
    },
    repliesCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
