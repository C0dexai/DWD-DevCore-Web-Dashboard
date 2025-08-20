import React from 'react';
import SettingsIcon from '../icons/SettingsIcon';

const SettingsPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
      <div className="w-28 h-28 text-white animate-orb-glow rounded-full flex items-center justify-center mb-6">
        <SettingsIcon className="w-20 h-20" />
      </div>
      <h1 className="text-4xl font-bold text-gray-400">Settings</h1>
      <p className="mt-2 text-lg">Configure your application and user preferences.</p>
      <p className="mt-1 text-base">This page is under construction.</p>
    </div>
  );
};

export default SettingsPage;