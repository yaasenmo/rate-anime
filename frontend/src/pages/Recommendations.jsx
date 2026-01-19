import React, { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
import AnimeCard from '../components/AnimeCard';
import api from '../services/api';

const Recommendations = () => {
  const [anime, setAnime] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await api.get('/anime/recommendations');
        setAnime(res.data.data);
      } catch (err) {
        console.error('Error fetching recommendations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

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
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="text-primary-400" size={32} />
          <h1 className="text-3xl font-bold">Top Recommendations</h1>
        </div>
        <p className="text-gray-400">Highest rated anime by our community</p>
      </div>

      {anime.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No recommendations available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {anime.map((item, index) => (
            <div key={item._id} className="relative">
              {index < 3 && (
                <div className={`absolute -top-2 -left-2 z-10 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-amber-700'
                }`}>
                  #{index + 1}
                </div>
              )}
              <AnimeCard anime={item} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recommendations;
