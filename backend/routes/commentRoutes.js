const express = require('express');
const router = express.Router();
const { 
  addComment, 
  getVideoComments,
  getCommentReplies,
  likeComment,
  deleteComment,
  reportComment 
} = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/add', protect, addComment);
router.get('/replies/:commentId', getCommentReplies);
router.post('/:commentId/like', protect, likeComment);
router.delete('/:commentId', protect, deleteComment);
router.post('/:commentId/report', protect, reportComment);
router.get('/:videoId', getVideoComments);

module.exports = router;
