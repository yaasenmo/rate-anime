import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Heart, Bookmark, Star } from 'lucide-react';
import StarRating from '../components/StarRating';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const AnimeDetail = () => {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const [anime, setAnime] = useState(null);
  const [comments, setComments] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [userRating, setUserRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [animeRes, commentsRes, ratingsRes] = await Promise.all([
          api.get(`/anime/${id}`),
          api.get(`/comments/anime/${id}`),
          api.get(`/ratings/anime/${id}`)
        ]);

        setAnime(animeRes.data.data);
        setComments(commentsRes.data.data);
        setRatings(ratingsRes.data.data);

        if (isAuthenticated) {
          setLiked(animeRes.data.data.likes?.includes(user?.id));
          
          try {
            const userRatingRes = await api.get(`/ratings/anime/${id}/user`);
            if (userRatingRes.data.data) {
              setUserRating(userRatingRes.data.data.rating);
            }
          } catch (err) {
            console.log('No user rating found');
          }

          try {
            const meRes = await api.get('/auth/me');
            setSaved(meRes.data.data.savedAnime?.some(a => a._id === id));
          } catch (err) {
            console.log('Error checking saved status');
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isAuthenticated, user]);

  const handleRate = async (rating) => {
    if (!isAuthenticated) return;

    try {
      await api.post(`/ratings/anime/${id}`, { rating });
      setUserRating(rating);
      
      const animeRes = await api.get(`/anime/${id}`);
      setAnime(animeRes.data.data);
    } catch (err) {
      console.error('Error rating anime:', err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!isAuthenticated || !newComment.trim()) return;

    try {
      const res = await api.post(`/comments/anime/${id}`, { text: newComment });
      setComments([res.data.data, ...comments]);
      setNewComment('');
    } catch (err) {
      console.error('Error posting comment:', err);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) return;

    try {
      const res = await api.post(`/anime/${id}/like`);
      setLiked(res.data.liked);
      setAnime(res.data.data);
    } catch (err) {
      console.error('Error liking anime:', err);
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) return;

    try {
      const res = await api.post(`/anime/${id}/save`);
      setSaved(res.data.saved);
    } catch (err) {
      console.error('Error saving anime:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!anime) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">Anime not found.</p>
        <Link to="/" className="text-primary-400 hover:underline mt-4 inline-block">
          Go back home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        Back to Home
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <img
              src={`http://localhost:5000/uploads/${anime.image}`}
              alt={anime.title}
              className="w-full rounded-xl shadow-2xl"
            />
            
            <div className="mt-4 flex gap-3">
              <button
                onClick={handleLike}
                disabled={!isAuthenticated}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-colors ${
                  liked
                    ? 'bg-red-500 text-white'
                    : 'bg-dark-100 text-gray-300 hover:bg-red-500/20 hover:text-red-400'
                } ${!isAuthenticated && 'opacity-50 cursor-not-allowed'}`}
              >
                <Heart size={20} className={liked ? 'fill-current' : ''} />
                <span>{anime.likes?.length || 0}</span>
              </button>
              
              <button
                onClick={handleSave}
                disabled={!isAuthenticated}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-colors ${
                  saved
                    ? 'bg-primary-500 text-white'
                    : 'bg-dark-100 text-gray-300 hover:bg-primary-500/20 hover:text-primary-400'
                } ${!isAuthenticated && 'opacity-50 cursor-not-allowed'}`}
              >
                <Bookmark size={20} className={saved ? 'fill-current' : ''} />
                <span>{saved ? 'Saved' : 'Save'}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-4">{anime.title}</h1>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Star className="text-yellow-400 fill-yellow-400" size={24} />
                <span className="text-2xl font-bold">{anime.averageRating?.toFixed(1) || '0.0'}</span>
                <span className="text-gray-400">({anime.totalRatings || 0} ratings)</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {anime.genre?.map((g, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-primary-600/20 text-primary-400 rounded-full text-sm"
                >
                  {g}
                </span>
              ))}
            </div>

            <p className="text-gray-300 leading-relaxed">{anime.description}</p>
          </div>

          <div className="bg-dark-200 rounded-xl p-6 border border-gray-800">
            <h2 className="text-xl font-bold mb-4">Rate this Anime</h2>
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <StarRating rating={userRating} onRate={handleRate} size={32} />
                <span className="text-gray-400">
                  {userRating > 0 ? `Your rating: ${userRating}/5` : 'Click to rate'}
                </span>
              </div>
            ) : (
              <p className="text-gray-400">
                <Link to="/login" className="text-primary-400 hover:underline">Login</Link> to rate this anime
              </p>
            )}
          </div>

          <div className="bg-dark-200 rounded-xl p-6 border border-gray-800">
            <h2 className="text-xl font-bold mb-6">Comments ({comments.length})</h2>

            {isAuthenticated ? (
              <form onSubmit={handleComment} className="mb-6">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="w-full p-4 bg-dark-100 border border-gray-700 rounded-lg focus:outline-none focus:border-primary-500 resize-none"
                  rows={3}
                />
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="mt-3 px-6 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  Post Comment
                </button>
              </form>
            ) : (
              <p className="text-gray-400 mb-6">
                <Link to="/login" className="text-primary-400 hover:underline">Login</Link> to leave a comment
              </p>
            )}

            <div className="space-y-4">
              {comments.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No comments yet. Be the first to comment!</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment._id} className="p-4 bg-dark-100 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-primary-400">
                        {comment.user?.username || 'Anonymous'}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-300">{comment.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-dark-200 rounded-xl p-6 border border-gray-800">
            <h2 className="text-xl font-bold mb-6">User Ratings</h2>
            <div className="space-y-3">
              {ratings.length === 0 ? (
                <p className="text-gray-400 text-center py-4">No ratings yet.</p>
              ) : (
                ratings.slice(0, 10).map((r) => (
                  <div key={r._id} className="flex items-center justify-between p-3 bg-dark-100 rounded-lg">
                    <span className="text-gray-300">{r.user?.username || 'Anonymous'}</span>
                    <StarRating rating={r.rating} readonly size={18} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimeDetail;
