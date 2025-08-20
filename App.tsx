import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardPage from './components/pages/DashboardPage';
import ChatPage from './components/pages/ChatPage';
import AIAgentsPage from './components/pages/AIAgentsPage';
import DataPage from './components/pages/DataPage';
import SettingsPage from './components/pages/SettingsPage';
import FloatingOrb from './components/FloatingOrb';
import OrchestrationPage from './components/pages/OrchestrationPage';
import LandingPage from './components/pages/LandingPage';

const DashboardLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-brand-dark text-gray-200 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-brand-dark p-8">
          <Outlet />
        </main>
      </div>
      <FloatingOrb />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/dev-agents" element={<AIAgentsPage />} />
        <Route path="/builder" element={<OrchestrationPage />} />
        <Route path="/data" element={<DataPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;