import React from 'react';
import { NavLink } from 'react-router-dom';
import type { NavLinkInfo } from '../types';
import DashboardIcon from './icons/DashboardIcon';
import ChatIcon from './icons/ChatIcon';
import AgentsIcon from './icons/AgentsIcon';
import DataIcon from './icons/DataIcon';
import SettingsIcon from './icons/SettingsIcon';
import LogoIcon from './icons/LogoIcon';
import { Hammer } from 'lucide-react';

const navLinks: NavLinkInfo[] = [
  { path: '/dashboard', name: 'Dashboard', icon: <DashboardIcon className="w-5 h-5" /> },
  { path: '/chat', name: 'Chat', icon: <ChatIcon className="w-5 h-5" /> },
  { path: '/dev-agents', name: 'Dev Agents', icon: <AgentsIcon className="w-5 h-5" /> },
  { path: '/builder', name: 'Container Builder', icon: <Hammer className="w-5 h-5" /> },
  { path: '/data', name: 'Databases', icon: <DataIcon className="w-5 h-5" /> },
];

const Sidebar: React.FC = () => {
  const baseLinkClasses = "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200";
  const inactiveLinkClasses = "text-gray-400 hover:bg-white/5 hover:text-white";
  const activeLinkClasses = "bg-neon-purple/20 text-white font-semibold";

  return (
    <aside className="w-64 flex-shrink-0 bg-brand-surface p-4 flex flex-col justify-between border-r border-gray-800">
      <div>
        <div className="flex items-center space-x-3 p-4 mb-6">
          <div className="text-neon-purple animate-pulse">
            <LogoIcon />
          </div>
          <span className="text-xl font-bold text-white text-glow">DevCore</span>
        </div>
        <nav className="space-y-2">
          {navLinks.map(link => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `${baseLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`
              }
            >
              {link.icon}
              <span>{link.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
      <div>
         <NavLink
            to="/settings"
            className={({ isActive }) =>
              `${baseLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`
            }
          >
            <SettingsIcon className="w-5 h-5" />
            <span>Settings</span>
          </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
