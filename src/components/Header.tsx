import React from 'react';
import { Radio, User } from 'lucide-react';

interface HeaderProps {
  userData?: { name: string; email: string } | null;
  onShowLogin?: () => void;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ userData, onShowLogin, onLogout }) => {
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-30"></div>
              <div className="relative p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
                <Radio className="w-7 h-7 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">PodcastAI</h1>
              <p className="text-sm text-gray-500 font-medium">Intelligent Podcast Creation</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {userData ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-3 bg-blue-50 px-4 py-2 rounded-full border border-blue-200">
                  <User className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">{userData.name}</span>
                </div>
                <button
                  onClick={onLogout}
                  className="text-sm text-gray-500 hover:text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={onShowLogin}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors duration-200"
              >
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">Sign In</span>
              </button>
            )}
            <div className="hidden md:flex items-center space-x-3 bg-green-50 px-4 py-2 rounded-full border border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-700">AI Ready</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;