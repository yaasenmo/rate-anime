const Comment = require('../models/Comment');
const Anime = require('../models/Anime');

exports.getCommentsByAnime = async (req, res, next) => {
  try {
    const comments = await Comment.find({ anime: req.params.animeId })
      .populate('user', 'username')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments
    });
  } catch (err) {
    next(err);
  }
};

exports.addComment = async (req, res, next) => {
  try {
    const anime = await Anime.findById(req.params.animeId);

    if (!anime) {
      return res.status(404).json({
        success: false,
        error: 'Anime not found'
      });
    }

    const comment = await Comment.create({
      text: req.body.text,
      user: req.user.id,
      anime: req.params.animeId
    });

    const populatedComment = await Comment.findById(comment._id).populate('user', 'username');

    res.status(201).json({
      success: true,
      data: populatedComment
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        error: 'Comment not found'
      });
    }

    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this comment'
      });
    }

    await comment.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};
