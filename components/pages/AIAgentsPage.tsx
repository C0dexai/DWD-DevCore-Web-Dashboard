import React from 'react';
import type { Agent } from '../../types';
import { Code, Users, Beaker, Shield, SwatchBook, Workflow } from 'lucide-react';

const devTeamData = {
  signature: "DevCore Team - Shipping Beautiful & Performant Web Apps.",
  version: "1.0",
  build_system: "Vite",
  core_framework: "Vue.js",
  team_lead: "Vanessa",
  primary_stack: "VNV (Vue, Node, Vite)",
  code_formatter: "prettier",
  preferred_language: "TypeScript",
  logging: { style: "json" },
  members: [
    {
      name: "Vicky",
      role: "Vite & Build Specialist",
      stack: ["Vite", "Rollup", "ESBuild", "TypeScript"],
      personality: {
        description: "A speed demon obsessed with optimizing build times and developer experience. She makes the DX buttery smooth.",
        focus: "Performance, speed, and efficiency",
        style: "energetic",
        motto: "If it's not instant, it's too slow.",
      },
      color_theme: "#646cff",
      capabilities: ["Lightning-fast HMR", "Plugin integration", "Bundle size reduction"],
      quirks: ["Measures time in ms", "Allergic to Webpack", "Has a `vite.config.ts` for her life"],
    },
    {
      name: "Vanessa",
      role: "Vue & Component Architect",
      stack: ["Vue 3", "Pinia", "Vue Router", "TypeScript"],
      personality: {
        description: "A pragmatic artist who crafts elegant, reusable, and highly performant Vue components. The heart of the frontend.",
        focus: "Reusability, reactivity, and clean architecture",
        style: "methodical",
        motto: "Composition over inheritance, always.",
      },
      color_theme: "#42b883",
      capabilities: ["Composition API patterns", "State management with Pinia", "Component library design"],
      quirks: ["Sees the world as components", "SFC stands for 'Super Fun Component'"],
    },
    {
      name: "Nolan",
      role: "Node.js & Backend Virtuoso",
      stack: ["Node.js", "Express", "PostgreSQL", "Docker"],
      personality: {
        description: "The unshakable foundation of the backend. Nolan builds secure, scalable, and resilient APIs.",
        focus: "Security, scalability, and data integrity",
        style: "robust",
        motto: "Handle every error, trust no input.",
      },
      color_theme: "#68a063",
      capabilities: ["REST & GraphQL APIs", "Database schema design", "Authentication (JWT)"],
      quirks: ["Dreams in async/await", "Loves a normalized database"],
    },
  ],
};


const roleIcons: { [key: string]: React.ReactNode } = {
    'Vite & Build Specialist': <Workflow size={24} />,
    'Vue & Component Architect': <SwatchBook size={24} />,
    'Node.js & Backend Virtuoso': <Code size={24} />,
    'UI/UX & ShadCN Specialist': <Users size={24} />,
    'Vanilla JS Purist': <Beaker size={24} />,
    'Testing & QA Guardian': <Shield size={24} />,
}

const AgentCard: React.FC<{ agent: Agent }> = ({ agent }) => {
    return (
        <div 
            className="group relative bg-brand-bg backdrop-blur-md rounded-xl border border-gray-800 overflow-hidden transition-all duration-300 hover:-translate-y-1 flex flex-col"
            style={{ '--agent-color': agent.color_theme } as React.CSSProperties}
        >
            <div className="absolute top-0 left-0 w-full h-1 bg-[var(--agent-color)] transition-all duration-300 group-hover:shadow-[0_0_15px_var(--agent-color)]"></div>
            <div className="p-6 pt-8 flex-grow">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110" style={{ backgroundColor: `${agent.color_theme}20`, color: agent.color_theme }}>
                        {roleIcons[agent.role] || <Code size={24} />}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold" style={{ color: agent.color_theme }}>{agent.name}</h3>
                        <p className="text-sm text-gray-400">{agent.role}</p>
                    </div>
                </div>
                
                <blockquote className="text-sm text-gray-300 mb-6 p-4 bg-black/20 rounded-lg border-l-4 italic" style={{ borderColor: agent.color_theme }}>
                    {agent.personality.description}
                </blockquote>
                
                <div className="space-y-4 text-gray-300">
                    <div>
                        <h4 className="font-semibold text-gray-200 flex items-center gap-2 mb-2">
                           Personality
                        </h4>
                        <div className="text-sm space-y-1 pl-4 border-l-2" style={{ borderColor: `${agent.color_theme}80` }}>
                            <p><span className="font-medium text-gray-400">Focus:</span> {agent.personality.focus}</p>
                            <p><span className="font-medium text-gray-400">Style:</span> {agent.personality.style}</p>
                            <p><span className="font-medium text-gray-400">Motto:</span> "{agent.personality.motto}"</p>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-200 flex items-center gap-2 mb-2">
                            Capabilities
                        </h4>
                        <ul className="text-sm space-y-1 pl-6 list-disc list-inside" style={{ color: agent.color_theme }}>
                            {agent.capabilities.map((cap, i) => <li key={i} className="truncate text-gray-300">{cap}</li>)}
                        </ul>
                    </div>
                    
                    <div>
                        <h4 className="font-semibold text-gray-200 flex items-center gap-2 mb-2">
                            Quirks
                        </h4>
                        <ul className="text-sm space-y-1 pl-6 list-disc list-inside">
                           {agent.quirks.map((quirk, i) => <li key={i}>{quirk}</li>)}
                        </ul>
                    </div>
                </div>
            </div>
            <div className="p-4 bg-black/30 mt-auto">
                 <p className="text-xs text-gray-500 text-right">Stack: {agent.stack.join(', ')}</p>
            </div>
        </div>
    );
};

const AIAgentsPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white text-glow">The Dev Team</h1>
        <p className="text-gray-400 mt-1">{devTeamData.signature}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {devTeamData.members.map(agent => (
          <AgentCard key={agent.name} agent={agent} />
        ))}
      </div>

       <div className="bg-brand-bg backdrop-blur-md p-6 rounded-xl border border-gray-800">
        <h3 className="text-xl font-semibold text-white mb-4">Team Configuration</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div><strong className="text-gray-400">Version:</strong> {devTeamData.version}</div>
            <div><strong className="text-gray-400">Build System:</strong> {devTeamData.build_system}</div>
            <div><strong className="text-gray-400">Core Framework:</strong> {devTeamData.core_framework}</div>
            <div><strong className="text-gray-400">Team Lead:</strong> {devTeamData.team_lead}</div>
            <div><strong className="text-gray-400">Primary Stack:</strong> {devTeamData.primary_stack}</div>
            <div><strong className="text-gray-400">Code Formatter:</strong> <span className="capitalize">{devTeamData.code_formatter}</span></div>
            <div><strong className="text-gray-400">Language:</strong> {devTeamData.preferred_language}</div>
            <div><strong className="text-gray-400">Logging Style:</strong> <span className="capitalize">{devTeamData.logging.style}</span></div>
        </div>
      </div>
    </div>
  );
};

export default AIAgentsPage;
