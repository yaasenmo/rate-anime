import React, { useState } from 'react';
import { Settings as SettingsIcon, User, Bell, Moon, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Settings = () => {
  const { isAuthenticated, user } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <SettingsIcon size={64} className="text-gray-600 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Sign in to access settings</h2>
        <p className="text-gray-400 mb-6">Customize your experience</p>
        <Link
          to="/login"
          className="px-6 py-3 bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-400">Manage your account and preferences</p>
      </div>

      <div className="space-y-6">
        <div className="bg-dark-200 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center gap-3 mb-6">
            <User className="text-primary-400" size={24} />
            <h2 className="text-xl font-semibold">Account</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-800">
              <span className="text-gray-300">Username</span>
              <span className="text-white font-medium">{user?.username}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-800">
              <span className="text-gray-300">Email</span>
              <span className="text-white font-medium">{user?.email}</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-gray-300">Account Type</span>
              <span className={`px-3 py-1 rounded-full text-sm ${
                user?.isGuest 
                  ? 'bg-yellow-500/20 text-yellow-400' 
                  : 'bg-green-500/20 text-green-400'
              }`}>
                {user?.isGuest ? 'Guest' : 'Member'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-dark-200 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="text-primary-400" size={24} />
            <h2 className="text-xl font-semibold">Notifications</h2>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white">Push Notifications</p>
              <p className="text-sm text-gray-400">Receive updates about new anime and comments</p>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                notifications ? 'bg-primary-600' : 'bg-gray-600'
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  notifications ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="bg-dark-200 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center gap-3 mb-6">
            <Moon className="text-primary-400" size={24} />
            <h2 className="text-xl font-semibold">Appearance</h2>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white">Dark Mode</p>
              <p className="text-sm text-gray-400">Use dark theme for the interface</p>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                darkMode ? 'bg-primary-600' : 'bg-gray-600'
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  darkMode ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="bg-dark-200 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="text-primary-400" size={24} />
            <h2 className="text-xl font-semibold">Privacy</h2>
          </div>
          
          <div className="space-y-4">
            <p className="text-gray-400 text-sm">
              Your data is securely stored and never shared with third parties. 
              We only use your information to provide you with the best anime rating experience.
            </p>
            <button className="text-primary-400 hover:underline text-sm">
              View Privacy Policy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
