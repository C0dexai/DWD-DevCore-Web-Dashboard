import React, { useState, useEffect, useCallback } from 'react';
import { Container, HandoverHistoryEntry, Registry, Template } from '../../types';
import * as dbService from '../../services/dbService';
import { registryData } from '../../data/agentsData';
import { Folder, File, ChevronRight, Plus, History, Trash2, Play, Package, TestTube, Bug, Bot, ChevronDown, CheckCircle, RefreshCw, XCircle } from 'lucide-react';

// Mock service for build processes
const builderService = {
  createContainer: (options: { name: string; prompt: string; base: string; ui: string[]; datastore: string }): Container => {
    const newContainer: Container = {
      id: `cntr_${Date.now()}`,
      name: options.name,
      operator: 'andoy', // As per spec
      prompt: options.prompt,
      chosen_templates: { base: options.base, ui: options.ui, datastore: options.datastore },
      status: 'initialized',
      created_at: new Date().toISOString(),
      history: [{
        action: 'create',
        by: 'andoy',
        at: new Date().toISOString(),
        details: { template: options.base, ui: options.ui, datastore: options.datastore },
      }],
      files: {
        '/package.json': `{ "name": "${options.name.toLowerCase().replace(/\s/g, '-')}", "version": "0.1.0" }`,
        '/src/index.js': `// Main entry file for ${options.name}`,
        '/public/index.html': `<!DOCTYPE html><html><head><title>${options.name}</title></head><body></body></html>`,
      },
      terminal_logs: [{ timestamp: new Date().toISOString(), content: `Container ${options.name} created.`, type: 'output' }],
    };
    return newContainer;
  },
  runCommand: async (container: Container, command: 'install' | 'build' | 'start', onLog: (log: string, type?: 'output' | 'error') => void): Promise<Partial<Container>> => {
    onLog(`> npm run ${command}`);
    const newHistoryEntry: HandoverHistoryEntry = {
      action: 'command', by: 'andoy', at: new Date().toISOString(), details: { command: `npm run ${command}`, status: 'running' }
    };

    const run = (msg: string, delay: number) => new Promise(resolve => setTimeout(() => { onLog(msg); resolve(null); }, delay));

    await run(`Starting '${command}' command...`, 500);
    if (command === 'install') {
      await run('Resolving packages...', 1000);
      await run('Fetching packages...', 1500);
      await run('Linking dependencies...', 1000);
      onLog('Installation complete.');
      newHistoryEntry.details.status = 'success';
      return { status: 'installed', history: [...container.history, newHistoryEntry] };
    }
    if (command === 'build') {
      await run('Building for production...', 1500);
      await run('vite v5.1.0 building for production...', 500);
      await run('✓ 24 modules transformed.', 1000);
      onLog('Build complete.');
      newHistoryEntry.details.status = 'success';
      return { status: 'built', history: [...container.history, newHistoryEntry], files: {...container.files, '/dist/index.js': '// built file'} };
    }
    if (command === 'start') {
        onLog('Starting dev server...');
        await run('> Local: http://localhost:5173/', 1000);
        newHistoryEntry.details.status = 'success';
        return { status: 'running', history: [...container.history, newHistoryEntry] };
    }
    return {};
  }
};


const TemplateRegistry: React.FC<{ onSelect: (type: keyof Registry, key: string) => void, selections: any }> = ({ onSelect, selections }) => {
    return (
        <div className="bg-brand-bg backdrop-blur-md rounded-xl border border-gray-800 p-4 h-full flex flex-col">
            <h3 className="text-lg font-bold text-white mb-4">Template Registry</h3>
            <div className="flex-grow overflow-y-auto space-y-4">
            {Object.entries(registryData).map(([category, templates]) => (
                <div key={category}>
                    <h4 className="font-semibold text-neon-purple mb-2">{category}</h4>
                    <div className="space-y-2">
                    {Object.entries(templates).map(([key, template]) => (
                         <button key={key} onClick={() => onSelect(category as keyof Registry, key)}
                            className={`w-full text-left p-2 rounded-md transition-colors text-sm ${selections[category.toLowerCase()]?.includes(key) ? 'bg-neon-blue/20 text-white' : 'hover:bg-white/5'}`}>
                            {key} <span className="text-gray-500 text-xs">({(template as Template).tags.join(', ')})</span>
                        </button>
                    ))}
                    </div>
                </div>
            ))}
            </div>
        </div>
    );
};

const CreateContainerModal: React.FC<{ isOpen: boolean, onClose: () => void, onCreate: (options: any) => void }> = ({ isOpen, onClose, onCreate }) => {
    const [selections, setSelections] = useState<{ base: string, ui: string[], datastore: string }>({ base: '', ui: [], datastore: ''});
    const [name, setName] = useState('');
    const [prompt, setPrompt] = useState('');

    const handleSelect = (type: keyof Registry, key: string) => {
        setSelections(prev => {
            if (type === 'TEMPLATES') return { ...prev, base: key };
            if (type === 'UI') {
                const newUi = prev.ui.includes(key) ? prev.ui.filter(i => i !== key) : [...prev.ui, key];
                return { ...prev, ui: newUi };
            }
            if (type === 'DATASTORE') return { ...prev, datastore: key };
            return prev;
        });
    };

    const handleCreate = () => {
        onCreate({ name, prompt, ...selections });
        onClose();
        setName(''); setPrompt(''); setSelections({ base: '', ui: [], datastore: ''});
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-brand-surface border border-gray-700 rounded-2xl shadow-lg w-full max-w-4xl grid grid-cols-1 md:grid-cols-2">
                <div className="p-6 border-r border-gray-700">
                    <h2 className="text-2xl font-bold text-white mb-4">Create New Container</h2>
                    <div className="space-y-4">
                        <input type="text" placeholder="Container Name (e.g., 'Fancy To-Do App')" value={name} onChange={e => setName(e.target.value)} className="w-full bg-black/30 text-gray-200 p-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-neon-blue" />
                        <textarea placeholder="Operator Prompt..." value={prompt} onChange={e => setPrompt(e.target.value)} className="w-full bg-black/30 text-gray-200 p-2 rounded-md border border-gray-600 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-neon-blue"></textarea>
                    </div>
                     <div className="mt-6 flex gap-4">
                        <button onClick={handleCreate} disabled={!name || !selections.base} className="bg-neon-purple text-white font-semibold py-2 px-6 rounded-lg hover:shadow-neon-glow-purple disabled:bg-gray-600 transition-all">Create</button>
                        <button onClick={onClose} className="bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg hover:bg-gray-600 transition-all">Cancel</button>
                    </div>
                </div>
                <div className="p-6">
                    <TemplateRegistry onSelect={handleSelect} selections={{templates: [selections.base], ui: selections.ui, datastore: [selections.datastore]}} />
                </div>
            </div>
        </div>
    );
};

const FileExplorer: React.FC<{ files: Record<string, string> }> = ({ files }) => (
    <div className="space-y-1">
        {Object.keys(files).map(path => (
            <div key={path} className="flex items-center gap-2 text-sm text-gray-300">
                <File size={16} className="text-neon-blue"/> {path}
            </div>
        ))}
    </div>
);

const Terminal: React.FC<{ logs: Container['terminal_logs'] }> = ({ logs }) => (
    <div className="bg-black/50 p-4 rounded-lg font-mono text-sm text-white h-full overflow-y-auto">
        {logs.map((log, i) => (
            <p key={i} className={`${log.type === 'error' ? 'text-neon-pink' : 'text-gray-300'}`}>{log.content}</p>
        ))}
    </div>
);

const HistoryLog: React.FC<{ history: HandoverHistoryEntry[] }> = ({ history }) => (
    <div className="space-y-3">
        {history.map((entry, i) => (
            <div key={i} className="text-sm">
                <p className="font-semibold text-white">[{entry.at.split('T')[1].substring(0,8)}] {entry.action.toUpperCase()} by {entry.by}</p>
                <p className="text-gray-400 pl-4 text-xs font-mono">{JSON.stringify(entry.details)}</p>
            </div>
        ))}
    </div>
);


const BuilderPage: React.FC = () => {
    const [containers, setContainers] = useState<Container[]>([]);
    const [selectedContainer, setSelectedContainer] = useState<Container | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'files' | 'terminal' | 'history'>('terminal');

    const loadContainers = useCallback(async () => {
        const storedContainers = await dbService.getAllContainers();
        setContainers(storedContainers);
        if (storedContainers.length > 0 && !selectedContainer) {
            setSelectedContainer(storedContainers[0]);
        }
    }, [selectedContainer]);

    useEffect(() => {
        loadContainers();
    }, [loadContainers]);
    
    const handleCreateContainer = async (options: any) => {
        const newContainer = builderService.createContainer(options);
        await dbService.saveContainer(newContainer);
        loadContainers();
        setSelectedContainer(newContainer);
    };

    const handleRunCommand = async (command: 'install' | 'build' | 'start') => {
        if (!selectedContainer) return;

        const updateContainerState = (updates: Partial<Container>) => {
            setSelectedContainer(prev => {
                if (!prev) return null;
                const updated = { ...prev, ...updates };
                dbService.saveContainer(updated);
                // Also update the list
                setContainers(list => list.map(c => c.id === updated.id ? updated : c));
                return updated;
            });
        };
        
        const onLog = (content: string, type: 'output'| 'error' = 'output') => {
            const logEntry = { timestamp: new Date().toISOString(), content, type };
             setSelectedContainer(prev => prev ? ({...prev, terminal_logs: [...prev.terminal_logs, logEntry]}) : null);
        };
        
        const commandStatusMap = {'install': 'installing', 'build': 'building', 'start': 'running'};
        updateContainerState({ status: commandStatusMap[command] as Container['status']});

        const updates = await builderService.runCommand(selectedContainer, command, onLog);
        updateContainerState(updates);
    };

    const handleDeleteContainer = async (id: string) => {
        await dbService.deleteContainer(id);
        setContainers(prev => prev.filter(c => c.id !== id));
        if (selectedContainer?.id === id) {
            setSelectedContainer(null);
        }
    }
    
    const statusIcons: Record<Container['status'], React.ReactNode> = {
        'initialized': <Package className="w-4 h-4 text-gray-400" />,
        'installing': <RefreshCw className="w-4 h-4 text-neon-blue animate-spin" />,
        'installed': <CheckCircle className="w-4 h-4 text-neon-green" />,
        'building': <RefreshCw className="w-4 h-4 text-neon-blue animate-spin" />,
        'built': <CheckCircle className="w-4 h-4 text-neon-green" />,
        'running': <Play className="w-4 h-4 text-neon-green" />,
        'error': <XCircle className="w-4 h-4 text-neon-pink" />,
    };

    return (
        <div className="h-full flex flex-col space-y-6">
             <CreateContainerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onCreate={handleCreateContainer} />
            <div>
                <h1 className="text-3xl font-bold text-white text-glow">Container Builder</h1>
                <p className="text-gray-400 mt-1">Build & orchestrate applications from the template registry.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow min-h-0">
                {/* Left Panel: Container List */}
                <div className="lg:col-span-1 bg-brand-bg backdrop-blur-md rounded-xl border border-gray-800 p-4 flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-white">Containers</h2>
                        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-neon-purple text-white px-3 py-1.5 rounded-lg text-sm hover:shadow-neon-glow-purple transition-all"><Plus size={16}/> New</button>
                    </div>
                    <div className="space-y-2 overflow-y-auto">
                    {containers.map(c => (
                        <div key={c.id} onClick={() => setSelectedContainer(c)}
                             className={`p-3 rounded-lg border-l-4 cursor-pointer transition-colors ${selectedContainer?.id === c.id ? 'bg-neon-blue/20 border-neon-blue' : 'bg-black/20 border-gray-700 hover:bg-white/5'}`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold text-white">{c.name}</p>
                                    <p className="text-xs text-gray-500 font-mono">{c.id}</p>
                                </div>
                                <button onClick={(e) => {e.stopPropagation(); handleDeleteContainer(c.id);}} className="text-gray-500 hover:text-neon-pink"><Trash2 size={16}/></button>
                            </div>
                            <div className="flex items-center gap-2 mt-2 text-sm text-gray-300">
                                {statusIcons[c.status]}
                                <span className="capitalize">{c.status}</span>
                            </div>
                        </div>
                    ))}
                    </div>
                </div>

                {/* Right Panel: Selected Container */}
                <div className="lg:col-span-2 bg-brand-bg backdrop-blur-md rounded-xl border border-gray-800 flex flex-col min-h-0">
                {selectedContainer ? (
                    <>
                        <div className="p-4 border-b border-gray-800">
                             <h3 className="text-xl font-bold text-white">{selectedContainer.name}</h3>
                             <p className="text-sm text-gray-400 mt-1">{selectedContainer.prompt}</p>
                            <div className="flex items-center gap-2 mt-4">
                                <button onClick={() => handleRunCommand('install')} disabled={!['initialized', 'error'].includes(selectedContainer.status)} className="flex items-center gap-2 text-sm bg-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-600 disabled:opacity-50 transition-colors"><Package size={16}/> Install</button>
                                <button onClick={() => handleRunCommand('build')} disabled={!['installed'].includes(selectedContainer.status)} className="flex items-center gap-2 text-sm bg-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-600 disabled:opacity-50 transition-colors"><TestTube size={16}/> Build</button>
                                <button onClick={() => handleRunCommand('start')} disabled={!['built'].includes(selectedContainer.status)} className="flex items-center gap-2 text-sm bg-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-600 disabled:opacity-50 transition-colors"><Play size={16}/> Start</button>
                                <button className="flex items-center gap-2 text-sm bg-neon-pink/80 px-3 py-1.5 rounded-md hover:bg-neon-pink disabled:opacity-50 transition-colors"><Bug size={16}/> Debug</button>
                            </div>
                        </div>
                        <div className="flex-grow p-4 min-h-0">
                             <div className="border-b border-gray-700 mb-4">
                                <nav className="flex space-x-4">
                                  {['terminal', 'files', 'history'].map((tab) => (
                                    <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-3 py-2 text-sm font-medium transition-colors ${activeTab === tab ? 'text-neon-blue border-b-2 border-neon-blue' : 'text-gray-400 hover:text-white'}`}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</button>
                                  ))}
                                </nav>
                              </div>
                              <div className="h-full max-h-96 overflow-y-auto">
                                  {activeTab === 'files' && <FileExplorer files={selectedContainer.files} />}
                                  {activeTab === 'terminal' && <Terminal logs={selectedContainer.terminal_logs} />}
                                  {activeTab === 'history' && <HistoryLog history={selectedContainer.history} />}
                              </div>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                        <Folder size={64}/>
                        <h3 className="text-xl font-semibold mt-4">No Container Selected</h3>
                        <p>Select a container from the list or create a new one.</p>
                    </div>
                )}
                </div>
            </div>
        </div>
    );
};

export default BuilderPage;