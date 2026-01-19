import React from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating, onRate, readonly = false, size = 24 }) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center gap-1">
      {stars.map((star) => (
        <button
          key={star}
          onClick={() => !readonly && onRate && onRate(star)}
          disabled={readonly}
          className={`transition-colors ${
            readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
          }`}
        >
          <Star
            size={size}
            className={`${
              star <= rating
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-600'
            } transition-colors`}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;
