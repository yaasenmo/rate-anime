# Frontend Code - Line by Line Explanation

## index.js - Entry Point

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
// ReactDOM renders React components to the browser

import './index.css';
// Import Tailwind CSS styles

import App from './App';
// Import main App component

const root = ReactDOM.createRoot(document.getElementById('root'));
// Find <div id="root"> in public/index.html
// This is where our entire React app renders

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
// Render App component inside root div
```

---

## App.jsx - Main Component with Routing

```javascript
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// React Router for navigation:
// - Router: provides routing context
// - Routes: container for Route components
// - Route: maps URL path to component

import { AuthProvider } from './context/AuthContext';
// Provides auth state to entire app

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import AnimeDetail from './pages/AnimeDetail';
// ... other imports

function App() {
  return (
    <AuthProvider>
      {/* Wrap everything so all components can access auth */}
      
      <Router>
        {/* Enable routing */}
        
        <div className="min-h-screen bg-dark-300">
          {/* min-h-screen = minimum height 100vh (full viewport)
              bg-dark-300 = custom dark background */}
          
          <Navbar />
          <Sidebar isOpen={true} onClose={() => {}} />
          
          <main className="pt-16 lg:pl-64 min-h-screen">
            {/* pt-16 = padding-top 4rem (navbar space)
                lg:pl-64 = on large screens, padding-left 16rem (sidebar space)
                lg: prefix = applies on screens ≥1024px */}
            
            <div className="p-6">
              <Routes>
                <Route path="/" element={<Home />} />
                {/* URL "/" shows Home component */}
                
                <Route path="/anime/:id" element={<AnimeDetail />} />
                {/* :id is URL parameter
                    /anime/123 → AnimeDetail gets "123" via useParams() */}
                
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                {/* ... other routes */}
              </Routes>
            </div>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
```

---

## services/api.js - Axios Setup

```javascript
import axios from 'axios';
// Axios = library for HTTP requests (easier than fetch)

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  // All requests prefixed with this URL
  // api.get('/anime') → GET http://localhost:5000/api/anime
  
  headers: { 'Content-Type': 'application/json' }
});

// REQUEST INTERCEPTOR - runs BEFORE every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  // Get JWT from browser storage
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    // Add token to request header
  }
  return config;
});

// RESPONSE INTERCEPTOR - runs AFTER every response
api.interceptors.response.use(
  (response) => response,  // Success: return response
  (error) => {
    if (error.response?.status === 401) {
      // 401 = Unauthorized (token invalid)
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

## context/AuthContext.js - Global Auth State

```javascript
import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();
// Context = way to pass data through component tree
// without passing props manually at every level

export const useAuth = () => useContext(AuthContext);
// Custom hook to access auth context
// Usage: const { user, login } = useAuth();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // Current logged-in user (null if not logged in)
  
  const [token, setToken] = useState(localStorage.getItem('token'));
  // JWT token from localStorage
  
  const [loading, setLoading] = useState(true);

  // Load user when component mounts
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data.data);
        } catch (err) {
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    loadUser();
  }, [token]);
  // [token] = re-run when token changes

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const register = async (username, email, password) => {
    const res = await api.post('/auth/register', { username, email, password });
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const value = {
    user, token, loading, login, register, logout,
    isAuthenticated: !!token  // Convert to boolean
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
  // All children can access 'value' via useAuth()
};
```

---

## pages/Home.jsx - Main Page with Grid

```javascript
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import AnimeCard from '../components/AnimeCard';
import api from '../services/api';

const Home = () => {
  const [anime, setAnime] = useState([]);
  // Array of anime from database
  
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  // Get ?search= from URL

  useEffect(() => {
    const fetchAnime = async () => {
      setLoading(true);
      try {
        const params = searchQuery ? { search: searchQuery } : {};
        const res = await api.get('/anime', { params });
        // GET /api/anime?search=naruto
        
        setAnime(res.data.data);
        // res.data.data = array of anime objects
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnime();
  }, [searchQuery]);
  // Re-fetch when search changes

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
    // Loading spinner
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        {searchQuery ? `Results for "${searchQuery}"` : 'Discover Anime'}
      </h1>

      {/* ========== THE GRID ========== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* 
          grid = Enable CSS Grid
          grid-cols-1 = 1 column (mobile default)
          sm:grid-cols-2 = 2 columns on ≥640px
          lg:grid-cols-3 = 3 columns on ≥1024px
          xl:grid-cols-4 = 4 columns on ≥1280px
          gap-6 = 1.5rem spacing between items
        */}
        
        {anime.map((item) => (
          <AnimeCard key={item._id} anime={item} />
        ))}
        {/* 
          .map() loops through anime array
          Each item becomes an AnimeCard
          key={item._id} helps React track items
        */}
      </div>
    </div>
  );
};

export default Home;
```

---

## components/AnimeCard.jsx - Single Card

```javascript
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const AnimeCard = ({ anime }) => {
  // anime = { _id, title, description, image, likes, averageRating, genre }
  
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
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <div className="bg-dark-200 rounded-xl overflow-hidden border border-gray-800 hover:border-primary-500/50 transition-all duration-300 group">
      {/* 
        bg-dark-200 = dark background
        rounded-xl = large border radius
        overflow-hidden = hide overflow
        border = 1px border
        hover:border-primary-500/50 = change border on hover
        transition-all = animate all changes
        group = enables group-hover: on children
      */}
      
      {/* ========== IMAGE SECTION (Clickable) ========== */}
      <Link to={`/anime/${anime._id}`} className="relative aspect-[3/4] overflow-hidden block">
        {/* 
          Link = navigation without page reload
          to={`/anime/${anime._id}`} = goes to detail page
          aspect-[3/4] = 3:4 aspect ratio (portrait)
        */}
        
        <img
          src={`http://localhost:5000/uploads/${anime.image}`}
          alt={anime.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* 
          src = Full image URL
          anime.image = 'naruto.png' (from database)
          Full URL = http://localhost:5000/uploads/naruto.png
          
          w-full h-full = fill container
          object-cover = cover area, crop if needed
          group-hover:scale-105 = zoom 105% when card hovered
          transition-transform = smooth animation
        */}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-300 via-transparent to-transparent" />
        {/* 
          absolute inset-0 = cover entire parent
          bg-gradient-to-t = gradient going up
          from-dark-300 = dark at bottom
          to-transparent = transparent at top
        */}
        
        {/* Rating badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-dark-300/80 px-2 py-1 rounded-full">
          <Star className="text-yellow-400 fill-yellow-400" size={14} />
          <span className="text-sm">{anime.averageRating?.toFixed(1) || '0.0'}</span>
        </div>
      </Link>

      {/* ========== INFO SECTION ========== */}
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 truncate">
          {anime.title}
        </h3>
        {/* truncate = cut text with ... if too long */}
        
        <p className="text-gray-400 text-sm line-clamp-2 mb-4">
          {anime.description}
        </p>
        {/* line-clamp-2 = max 2 lines, then ... */}

        {/* Genre tags */}
        <div className="flex gap-2 mb-3">
          {anime.genre?.slice(0, 2).map((g, i) => (
            <span key={i} className="px-2 py-1 text-xs bg-primary-600/20 text-primary-400 rounded-full">
              {g}
            </span>
          ))}
        </div>
        {/* .slice(0, 2) = only first 2 genres */}

        {/* Action buttons */}
        <div className="flex justify-between pt-3 border-t border-gray-800">
          <button onClick={handleLike} disabled={!isAuthenticated}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
              liked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
            }`}>
            <Heart size={18} className={liked ? 'fill-current' : ''} />
            <span>{likeCount}</span>
          </button>

          <Link to={`/anime/${anime._id}`}
            className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-primary-400">
            <MessageCircle size={18} />
            <span>Comments</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AnimeCard;
```

---

## components/Navbar.jsx - Top Navigation

```javascript
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  // useNavigate = programmatic navigation

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      // Navigate to home with search query
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-200 border-b border-gray-800">
      {/* fixed = stays at top when scrolling
          z-50 = high z-index (above other content) */}
      
      <div className="flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
          RateMyAnime
        </Link>
        {/* bg-gradient-to-r = gradient left to right
            bg-clip-text = clip gradient to text
            text-transparent = make text transparent to show gradient */}

        {/* Search form */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search anime..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-dark-100 border border-gray-700 rounded-full focus:border-primary-500"
            />
          </div>
        </form>

        {/* Auth buttons */}
        <div className="flex gap-3">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="px-4 py-2 text-gray-300 hover:text-white">
                Login
              </Link>
              <Link to="/signup" className="px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg">
                Sign Up
              </Link>
            </>
          ) : null}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
```

---

## Tailwind CSS Classes Quick Reference

| Class | What it does |
|-------|-------------|
| `flex` | Display: flex |
| `grid` | Display: grid |
| `grid-cols-4` | 4 columns |
| `gap-6` | 1.5rem gap |
| `p-4` | Padding 1rem |
| `m-4` | Margin 1rem |
| `pt-16` | Padding-top 4rem |
| `w-full` | Width 100% |
| `h-full` | Height 100% |
| `min-h-screen` | Min-height 100vh |
| `bg-dark-200` | Background color |
| `text-white` | Text color |
| `text-xl` | Font size |
| `font-bold` | Font weight |
| `rounded-xl` | Border radius |
| `border` | 1px border |
| `hover:bg-red-500` | Background on hover |
| `sm:grid-cols-2` | 2 cols on ≥640px |
| `lg:grid-cols-3` | 3 cols on ≥1024px |
| `transition-all` | Animate changes |
| `duration-300` | 300ms animation |

---

## How Everything Connects

1. **User visits localhost:3000**
2. **index.js** renders **App.jsx**
3. **App.jsx** sets up routing, shows **Navbar**, **Sidebar**, and current page
4. **Home.jsx** fetches anime from API using **api.js**
5. **api.js** sends request to **localhost:5000/api/anime**
6. **Backend** queries MongoDB, returns JSON
7. **Home.jsx** receives data, maps to **AnimeCard** components
8. **AnimeCard** displays image using URL: `http://localhost:5000/uploads/{filename}`
9. **Backend** serves image file from **Anime, photos** folder
10. **CSS Grid** arranges cards in responsive columns
