// named exports only
import type { AgentId } from './agents';

export interface RunStep {
  id: string;
  role: 'plan' | 'action' | 'verify' | 'summarize';
  agent: AgentId;
  name: string; // "collect" | "summarize" 등
  status: 'queued' | 'running' | 'done' | 'error';
  logs?: string[];
  toolName?: string;
  evidence?: { label: string; url?: string }[];
  outputs?: Record<string, unknown>;
}

export interface RunItem {
  id: string;
  createdAt: number;
  prompt: string;
  autonomy: 'ask' | 'semi' | 'auto';
  selectedAgents: AgentId[];
  status: 'queued' | 'running' | 'done' | 'error';
  route: {
    graph: { nodes: AgentId[]; edges: [AgentId, AgentId][] };
    table: { agent: AgentId; reason: string }[];
  };
  steps: RunStep[];
  artifacts?: {
    type: 'chart' | 'table' | 'file' | 'text' | 'image';
    ref: string;
    label?: string;
  }[];
  finalReport?: {
    headline: string;
    opinion: '매수' | '보유' | '매도';
    price: { target?: number; current?: number };
    bullets: string[];
    news: string[];
    financials: string[];
    backtest?: { summary: string };
    riskNotes?: string[];
    chartRefs?: string[];
  };
  error?: string;
}
