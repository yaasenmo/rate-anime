const mongoose = require('mongoose');

const AnimeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide anime title'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: 500
  },
  image: {
    type: String,
    required: [true, 'Please provide an image path']
  },
  genre: [{
    type: String
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Anime', AnimeSchema);
