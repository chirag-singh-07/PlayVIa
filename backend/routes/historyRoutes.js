const express = require('express');
const router = express.Router();
const { getWatchHistory, deleteHistoryItem, addToHistory } = require('../controllers/historyController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getWatchHistory)
  .post(protect, addToHistory);

router.route('/:id')
  .delete(protect, deleteHistoryItem);

module.exports = router;
