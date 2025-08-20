import React from 'react';
import SearchIcon from './icons/SearchIcon';
import BellIcon from './icons/BellIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';

const Header: React.FC = () => {
  return (
    <header className="flex-shrink-0 bg-brand-surface/80 backdrop-blur-sm border-b border-gray-800 px-8 py-4 flex items-center justify-between">
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <SearchIcon className="w-5 h-5 text-gray-500" />
        </span>
        <input
          type="text"
          placeholder="Search projects, packages..."
          className="w-full md:w-96 bg-black/30 text-gray-200 placeholder-gray-500 border border-gray-700 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-neon-blue focus:border-transparent transition-all"
        />
      </div>
      <div className="flex items-center space-x-6">
        <button className="relative text-gray-400 hover:text-neon-pink transition-colors duration-200">
          <BellIcon className="w-6 h-6" />
          <span className="absolute top-0 right-0 h-2 w-2 bg-neon-pink rounded-full animate-pulse"></span>
        </button>
        <div className="flex items-center space-x-3 cursor-pointer group">
          <img
            src="https://picsum.photos/seed/user/40/40"
            alt="User avatar"
            className="w-10 h-10 rounded-full border-2 border-gray-600 group-hover:border-neon-purple transition-all"
          />
          <div>
            <p className="text-white font-semibold text-sm">Alex Hartman</p>
            <p className="text-gray-400 text-xs">Admin</p>
          </div>
          <ChevronDownIcon className="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </header>
  );
};

export default Header;