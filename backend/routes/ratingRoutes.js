const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getRatingsByAnime,
  addOrUpdateRating,
  getUserRating
} = require('../controllers/ratingController');
const { protect, optionalAuth } = require('../middleware/auth');

router.get('/anime/:animeId', optionalAuth, getRatingsByAnime);

router.get('/anime/:animeId/user', protect, getUserRating);

router.post(
  '/anime/:animeId',
  protect,
  [body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5')],
  addOrUpdateRating
);

module.exports = router;
