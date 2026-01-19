import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Bookmark, Settings, LogOut, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: TrendingUp, label: 'Recommendations', path: '/recommendations' },
    { icon: Bookmark, label: 'Saved', path: '/saved', requiresAuth: true },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      <aside
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-dark-200 border-r border-gray-800 z-40 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full p-4">
          {isAuthenticated && user && (
            <div className="mb-6 p-4 bg-dark-100 rounded-lg">
              <p className="text-sm text-gray-400">Welcome,</p>
              <p className="font-semibold text-primary-400 truncate">
                {user.username}
              </p>
              {user.isGuest && (
                <span className="text-xs text-yellow-500">(Guest)</span>
              )}
            </div>
          )}

          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => {
              if (item.requiresAuth && !isAuthenticated) return null;
              
              const isActive = location.pathname === item.path;
              const Icon = item.icon;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-300 hover:bg-dark-100 hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 mt-4 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
