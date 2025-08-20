import type { ReactNode } from 'react';

export interface NavLinkInfo {
  path: string;
  name: string;
  icon: ReactNode;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  isTyping?: boolean;
  suggestions?: string[];
}

export interface AgentPersonality {
  focus: string;
  style: string;
  motto: string;
  description: string;
}

export interface Agent {
  name: string;
  role: string;
  stack: string[];
  personality: AgentPersonality;
  color_theme: string;
  capabilities: string[];
  quirks: string[];
}

export type PipelineLogType = 'BUILD' | 'TEST' | 'DEPLOY' | 'LINT' | 'ALERT' | 'INFO';

export interface PipelineLogEntry {
  id: string;
  timestamp: string;
  type: PipelineLogType;
  agent: string;
  environment: 'STAGING' | 'PRODUCTION';
  message: string;
}

export type RepoStatus = 'Deployed' | 'Building' | 'PR Open' | 'Failed';

export interface ManagedRepo {
  id: string;
  name: string;
  version: string;
  status: RepoStatus;
  lastUpdated: string;
  lastAgent: string;
}

// Types for Container Builder
export interface Template {
  path: string;
  tags: string[];
}

export interface Registry {
  TEMPLATES: Record<string, Template>;
  UI: Record<string, Template>;
  DATASTORE: Record<string, Template>;
}

export type ContainerStatus = 'initialized' | 'installing' | 'installed' | 'building' | 'built' | 'running' | 'error';

export interface HandoverHistoryEntry {
  action: 'create' | 'command' | 'feature-add' | 'debug';
  by: string;
  at: string;
  details: {
    command?: string;
    status?: 'success' | 'failure' | 'running';
    template?: string;
    ui?: string[];
    datastore?: string;
    feature?: string;
    output?: string;
    error?: string;
  };
}

export interface Container {
  id: string;
  name: string;
  operator: string;
  prompt: string;
  chosen_templates: {
    base: string;
    ui: string[];
    datastore: string;
  };
  status: ContainerStatus;
  created_at: string;
  history: HandoverHistoryEntry[];
  files: Record<string, string>; // Mocked file system: path -> content
  terminal_logs: { timestamp: string, content: string, type: 'command' | 'output' | 'error' }[];
}
