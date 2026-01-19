const Anime = require('../models/Anime');
const User = require('../models/User');

exports.getAllAnime = async (req, res, next) => {
  try {
    const { search, genre } = req.query;
    let query = {};

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    if (genre) {
      query.genre = { $in: [genre] };
    }

    const anime = await Anime.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: anime.length,
      data: anime
    });
  } catch (err) {
    next(err);
  }
};

exports.getAnimeById = async (req, res, next) => {
  try {
    const anime = await Anime.findById(req.params.id);

    if (!anime) {
      return res.status(404).json({
        success: false,
        error: 'Anime not found'
      });
    }

    res.status(200).json({
      success: true,
      data: anime
    });
  } catch (err) {
    next(err);
  }
};

exports.likeAnime = async (req, res, next) => {
  try {
    const anime = await Anime.findById(req.params.id);

    if (!anime) {
      return res.status(404).json({
        success: false,
        error: 'Anime not found'
      });
    }

    const likeIndex = anime.likes.indexOf(req.user.id);

    if (likeIndex > -1) {
      anime.likes.splice(likeIndex, 1);
    } else {
      anime.likes.push(req.user.id);
    }

    await anime.save();

    res.status(200).json({
      success: true,
      data: anime,
      liked: likeIndex === -1
    });
  } catch (err) {
    next(err);
  }
};

exports.saveAnime = async (req, res, next) => {
  try {
    const anime = await Anime.findById(req.params.id);

    if (!anime) {
      return res.status(404).json({
        success: false,
        error: 'Anime not found'
      });
    }

    const user = await User.findById(req.user.id);
    const savedIndex = user.savedAnime.indexOf(req.params.id);

    if (savedIndex > -1) {
      user.savedAnime.splice(savedIndex, 1);
    } else {
      user.savedAnime.push(req.params.id);
    }

    await user.save();

    res.status(200).json({
      success: true,
      data: user.savedAnime,
      saved: savedIndex === -1
    });
  } catch (err) {
    next(err);
  }
};

exports.getSavedAnime = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('savedAnime');

    res.status(200).json({
      success: true,
      data: user.savedAnime
    });
  } catch (err) {
    next(err);
  }
};

exports.getRecommendations = async (req, res, next) => {
  try {
    const anime = await Anime.find()
      .sort({ averageRating: -1, totalRatings: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: anime
    });
  } catch (err) {
    next(err);
  }
};
