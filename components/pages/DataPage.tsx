import React from 'react';
import DataIcon from '../icons/DataIcon';

const DataPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
      <DataIcon className="w-24 h-24 mb-4" />
      <h1 className="text-4xl font-bold text-gray-400">Databases</h1>
      <p className="mt-2 text-lg">Connect and manage your databases (e.g., PostgreSQL, MongoDB, Redis).</p>
      <p className="mt-1 text-base">This page is under construction.</p>
    </div>
  );
};

export default DataPage;