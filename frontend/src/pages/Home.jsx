import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import AnimeCard from '../components/AnimeCard';
import api from '../services/api';

const Home = () => {
  const [anime, setAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    const fetchAnime = async () => {
      setLoading(true);
      try {
        const params = searchQuery ? { search: searchQuery } : {};
        const res = await api.get('/anime', { params });
        setAnime(res.data.data);
        setError(null);
      } catch (err) {
        setError('Failed to load anime. Please try again.');
        console.error('Error fetching anime:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnime();
  }, [searchQuery]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <p className="text-red-400 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {searchQuery ? `Search Results for "${searchQuery}"` : 'Discover Anime'}
        </h1>
        <p className="text-gray-400">
          {anime.length} anime found
        </p>
      </div>

      {anime.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No anime found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {anime.map((item) => (
            <AnimeCard key={item._id} anime={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
