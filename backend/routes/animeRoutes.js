const express = require('express');
const router = express.Router();
const {
  getAllAnime,
  getAnimeById,
  likeAnime,
  saveAnime,
  getSavedAnime,
  getRecommendations
} = require('../controllers/animeController');
const { protect, optionalAuth } = require('../middleware/auth');

router.get('/', optionalAuth, getAllAnime);
router.get('/recommendations', getRecommendations);
router.get('/saved', protect, getSavedAnime);
router.get('/:id', optionalAuth, getAnimeById);
router.post('/:id/like', protect, likeAnime);
router.post('/:id/save', protect, saveAnime);

module.exports = router;
