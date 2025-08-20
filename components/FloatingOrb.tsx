import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, MessageSquare, BrainCircuit, Database, Settings, X, Aperture, Hammer } from 'lucide-react';

const navLinks = [
  { path: '/dashboard', name: 'Dashboard', icon: <Home size={20} /> },
  { path: '/chat', name: 'Chat', icon: <MessageSquare size={20} /> },
  { path: '/dev-agents', name: 'Dev Agents', icon: <BrainCircuit size={20} /> },
  { path: '/builder', name: 'Container Builder', icon: <Hammer size={20} /> },
  { path: '/data', name: 'Databases', icon: <Database size={20} /> },
  { path: '/settings', name: 'Settings', icon: <Settings size={20} /> },
];

const FloatingOrb = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-64 bg-black/70 backdrop-blur-md rounded-lg border border-gray-700 shadow-lg p-2 animate-fade-in-up">
          <nav className="flex flex-col space-y-1">
            {navLinks.map(link => {
              const isActive = location.pathname === link.path;
              return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-3 p-3 rounded-md text-gray-300 hover:bg-neon-purple/20 hover:text-white transition-all duration-200 ${isActive ? 'bg-neon-purple/20 text-white' : ''}`}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            )})}
          </nav>
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-full bg-gradient-to-br from-neon-pink to-neon-purple flex items-center justify-center text-white animate-orb-glow focus:outline-none transition-transform duration-300 hover:scale-110"
        aria-label="Toggle quick navigation"
      >
        {isOpen ? <X size={32} /> : <Aperture size={32} />}
      </button>
       <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default FloatingOrb;
