const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
  rating: {
    type: Number,
    required: [true, 'Please provide a rating'],
    min: 1,
    max: 5
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  anime: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Anime',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

RatingSchema.index({ user: 1, anime: 1 }, { unique: true });

RatingSchema.statics.calculateAverageRating = async function(animeId) {
  const result = await this.aggregate([
    { $match: { anime: animeId } },
    {
      $group: {
        _id: '$anime',
        averageRating: { $avg: '$rating' },
        totalRatings: { $sum: 1 }
      }
    }
  ]);

  try {
    if (result.length > 0) {
      await mongoose.model('Anime').findByIdAndUpdate(animeId, {
        averageRating: Math.round(result[0].averageRating * 10) / 10,
        totalRatings: result[0].totalRatings
      });
    } else {
      await mongoose.model('Anime').findByIdAndUpdate(animeId, {
        averageRating: 0,
        totalRatings: 0
      });
    }
  } catch (err) {
    console.error(err);
  }
};

RatingSchema.post('save', async function() {
  await this.constructor.calculateAverageRating(this.anime);
});

RatingSchema.post('remove', async function() {
  await this.constructor.calculateAverageRating(this.anime);
});

module.exports = mongoose.model('Rating', RatingSchema);
