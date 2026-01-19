import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark } from 'lucide-react';
import AnimeCard from '../components/AnimeCard';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Saved = () => {
  const [savedAnime, setSavedAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchSaved = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/anime/saved');
        setSavedAnime(res.data.data);
      } catch (err) {
        console.error('Error fetching saved anime:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSaved();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Bookmark size={64} className="text-gray-600 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Sign in to view saved anime</h2>
        <p className="text-gray-400 mb-6">Save your favorite anime to watch later</p>
        <Link
          to="/login"
          className="px-6 py-3 bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
        >
          Sign In
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Saved Anime</h1>
        <p className="text-gray-400">{savedAnime.length} anime saved</p>
      </div>

      {savedAnime.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Bookmark size={64} className="text-gray-600 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No saved anime yet</h2>
          <p className="text-gray-400 mb-6">Start exploring and save anime you want to watch!</p>
          <Link
            to="/"
            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
          >
            Explore Anime
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {savedAnime.map((anime) => (
            <AnimeCard key={anime._id} anime={anime} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Saved;
