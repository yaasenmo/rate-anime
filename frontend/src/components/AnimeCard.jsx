import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const AnimeCard = ({ anime, onLike }) => {
  const { isAuthenticated } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(anime.likes?.length || 0);

  const handleLike = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return;

    try {
      const res = await api.post(`/anime/${anime._id}/like`);
      setLiked(res.data.liked);
      setLikeCount(res.data.data.likes.length);
      if (onLike) onLike(anime._id, res.data.liked);
    } catch (err) {
      console.error('Error liking anime:', err);
    }
  };

  return (
    <div className="bg-dark-200 rounded-xl overflow-hidden border border-gray-800 hover:border-primary-500/50 transition-all duration-300 group">
      <Link to={`/anime/${anime._id}`} className="relative aspect-[3/4] overflow-hidden block cursor-pointer">
        <img
          src={`/uploads/${anime.image}`}
          alt={anime.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-300 via-transparent to-transparent" />
        
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-dark-300/80 backdrop-blur-sm px-2 py-1 rounded-full">
          <Star className="text-yellow-400 fill-yellow-400" size={14} />
          <span className="text-sm font-medium">{anime.averageRating?.toFixed(1) || '0.0'}</span>
        </div>
      </Link>

      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 truncate group-hover:text-primary-400 transition-colors">
          {anime.title}
        </h3>
        
        <p className="text-gray-400 text-sm line-clamp-2 mb-4">
          {anime.description}
        </p>

        <div className="flex items-center gap-2 mb-3">
          {anime.genre?.slice(0, 2).map((g, i) => (
            <span
              key={i}
              className="px-2 py-1 text-xs bg-primary-600/20 text-primary-400 rounded-full"
            >
              {g}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-800">
          <button
            onClick={handleLike}
            disabled={!isAuthenticated}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              liked
                ? 'text-red-500 bg-red-500/10'
                : 'text-gray-400 hover:text-red-500 hover:bg-red-500/10'
            } ${!isAuthenticated && 'opacity-50 cursor-not-allowed'}`}
          >
            <Heart size={18} className={liked ? 'fill-current' : ''} />
            <span className="text-sm">{likeCount}</span>
          </button>

          <Link
            to={`/anime/${anime._id}`}
            className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-primary-400 hover:bg-primary-500/10 rounded-lg transition-colors"
          >
            <MessageCircle size={18} />
            <span className="text-sm">Comments</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AnimeCard;
