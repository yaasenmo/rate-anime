import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import AnimeDetail from './pages/AnimeDetail';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Saved from './pages/Saved';
import Recommendations from './pages/Recommendations';
import Settings from './pages/Settings';

function App() {

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-dark-300">
          <Navbar />
          <Sidebar isOpen={true} onClose={() => {}} />
          
          <main className="pt-16 lg:pl-64 min-h-screen">
            <div className="p-6">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/anime/:id" element={<AnimeDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/saved" element={<Saved />} />
                <Route path="/recommendations" element={<Recommendations />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </div>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
