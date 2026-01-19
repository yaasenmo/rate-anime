const Rating = require('../models/Rating');
const Anime = require('../models/Anime');

exports.getRatingsByAnime = async (req, res, next) => {
  try {
    const ratings = await Rating.find({ anime: req.params.animeId })
      .populate('user', 'username')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: ratings.length,
      data: ratings
    });
  } catch (err) {
    next(err);
  }
};

exports.addOrUpdateRating = async (req, res, next) => {
  try {
    const anime = await Anime.findById(req.params.animeId);

    if (!anime) {
      return res.status(404).json({
        success: false,
        error: 'Anime not found'
      });
    }

    let rating = await Rating.findOne({
      user: req.user.id,
      anime: req.params.animeId
    });

    if (rating) {
      rating.rating = req.body.rating;
      await rating.save();
    } else {
      rating = await Rating.create({
        rating: req.body.rating,
        user: req.user.id,
        anime: req.params.animeId
      });
    }

    const populatedRating = await Rating.findById(rating._id).populate('user', 'username');

    res.status(200).json({
      success: true,
      data: populatedRating
    });
  } catch (err) {
    next(err);
  }
};

exports.getUserRating = async (req, res, next) => {
  try {
    const rating = await Rating.findOne({
      user: req.user.id,
      anime: req.params.animeId
    });

    res.status(200).json({
      success: true,
      data: rating
    });
  } catch (err) {
    next(err);
  }
};
