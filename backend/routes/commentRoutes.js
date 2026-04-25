const express = require('express');
const router = express.Router();
const { addComment, getVideoComments } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/add', protect, addComment);
router.get('/:videoId', getVideoComments);

module.exports = router;
