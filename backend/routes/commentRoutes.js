const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getCommentsByAnime,
  addComment,
  deleteComment
} = require('../controllers/commentController');
const { protect, optionalAuth } = require('../middleware/auth');

router.get('/anime/:animeId', optionalAuth, getCommentsByAnime);

router.post(
  '/anime/:animeId',
  protect,
  [body('text').trim().isLength({ min: 1, max: 1000 }).withMessage('Comment must be 1-1000 characters')],
  addComment
);

router.delete('/:id', protect, deleteComment);

module.exports = router;
