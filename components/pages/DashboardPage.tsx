import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FolderGit, GitCommit, Server } from 'lucide-react';


const chartData = [
  { name: 'Mon', lighthouse: 85, buildTime: 45 },
  { name: 'Tue', lighthouse: 88, buildTime: 42 },
  { name: 'Wed', lighthouse: 92, buildTime: 38 },
  { name: 'Thu', lighthouse: 91, buildTime: 40 },
  { name: 'Fri', lighthouse: 95, buildTime: 35 },
  { name: 'Sat', lighthouse: 98, buildTime: 32 },
];

const projectsData = [
  { id: 'proj-001', name: 'E-commerce Frontend', status: 'Deployed', score: '98', lastUpdate: 'feat: add new checkout flow' },
  { id: 'proj-002', name: 'API Gateway', status: 'Deployed', score: '92', lastUpdate: 'fix: correct auth middleware bug' },
  { id: 'proj-003', name: 'Design System', status: 'Failed', score: 'N/A', lastUpdate: 'ci: update vitest config' },
  { id: 'proj-004', name: 'Marketing Website', status: 'Building', score: '95', lastUpdate: 'refactor: migrate to vue 3.3' },
  { id: 'proj-005', name: 'Admin Dashboard', status: 'Deployed', score: '96', lastUpdate: 'docs: update readme' },
];

const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string; trend: string; neonClasses: string; }> = ({ icon, title, value, trend, neonClasses }) => (
    <div className={`group bg-brand-bg backdrop-blur-md p-6 rounded-xl border border-gray-800 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 ${neonClasses}`}>
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-300">{title}</h3>
            <div className="transition-transform duration-300 group-hover:scale-110">{icon}</div>
        </div>
        <div>
            <p className="text-4xl font-bold text-white">{value}</p>
            <p className="text-sm text-neon-green">{trend}</p>
        </div>
    </div>
);


const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white text-glow">Dashboard</h1>
        <p className="text-gray-400 mt-1">Welcome back, here's an overview of your web development projects.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard icon={<FolderGit size={32}/>} title="Active Repos" value="18" trend="+2 this week" neonClasses="text-neon-purple hover:border-neon-purple hover:shadow-neon-glow-purple" />
        <StatCard icon={<GitCommit size={32}/>} title="Commits (24h)" value="76" trend="+15% since yesterday" neonClasses="text-neon-blue hover:border-neon-blue hover:shadow-neon-glow-blue" />
        <StatCard icon={<Server size={32}/>} title="Live Deployments" value="5" trend="1 new deployment" neonClasses="text-neon-pink hover:border-neon-pink hover:shadow-neon-glow-pink" />
      </div>

      <div className="bg-brand-bg backdrop-blur-md p-6 rounded-xl border border-gray-800">
        <h3 className="text-xl font-semibold text-white mb-4">Project Health</h3>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis yAxisId="left" stroke="#9ca3af" domain={[70, 100]} />
              <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                    backgroundColor: 'rgba(18,18,18,0.8)',
                    border: '1px solid #374151',
                    color: '#e5e7eb',
                    borderRadius: '0.75rem',
                }}
                />
              <Legend wrapperStyle={{ color: '#d1d5db' }}/>
              <defs>
                <linearGradient id="blue-gradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#22d3ee" />
                </linearGradient>
                <linearGradient id="green-gradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#4ade80" />
                    <stop offset="100%" stopColor="#a3e635" />
                </linearGradient>
              </defs>
              <Line yAxisId="left" type="monotone" dataKey="lighthouse" stroke="url(#green-gradient)" strokeWidth={3} name="Lighthouse Score" dot={false} />
              <Line yAxisId="right" type="monotone" dataKey="buildTime" stroke="url(#blue-gradient)" strokeWidth={3} name="Build Time (s)" dot={false}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-brand-bg backdrop-blur-md rounded-xl border border-gray-800 overflow-hidden">
        <div className="p-6">
            <h3 className="text-xl font-semibold text-white">Project Status</h3>
        </div>
        <table className="w-full text-left">
          <thead className="bg-black/30">
            <tr>
              <th className="p-4 font-semibold tracking-wider text-gray-400 uppercase text-sm">Project Name</th>
              <th className="p-4 font-semibold tracking-wider text-gray-400 uppercase text-sm">Status</th>
              <th className="p-4 font-semibold tracking-wider text-gray-400 uppercase text-sm">Lighthouse Score</th>
              <th className="p-4 font-semibold tracking-wider text-gray-400 uppercase text-sm">Last Commit</th>
            </tr>
          </thead>
          <tbody>
            {projectsData.map((proj) => (
              <tr key={proj.id} className="border-t border-gray-800 hover:bg-white/5 transition-colors">
                <td className="p-4 font-medium text-white">{proj.name}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-2 w-fit ${
                      proj.status === 'Deployed' ? 'bg-neon-green/20 text-neon-green' : 
                      proj.status === 'Failed' ? 'bg-neon-pink/20 text-neon-pink' : 
                      'bg-neon-purple/20 text-neon-purple'
                    }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      proj.status === 'Deployed' ? 'bg-neon-green' :
                      proj.status === 'Failed' ? 'bg-neon-pink' :
                      'bg-neon-purple'
                    }`}></div>
                    {proj.status}
                  </span>
                </td>
                <td className="p-4 font-mono text-neon-blue">{proj.score}</td>
                <td className="p-4 text-gray-400 truncate max-w-xs">{proj.lastUpdate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardPage;