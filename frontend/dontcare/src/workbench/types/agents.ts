export type AgentId =
  | 'router'
  | 'news'
  | 'fundamentals'
  | 'technical'
  | 'backtest'
  | 'strategy'
  | 'report';

export interface AgentPreset {
  label: string;
  prompt: string;
}

export interface Agent {
  id: AgentId;
  name: string;
  icon: string; // lucide-react 아이콘 이름
  description: string;
  presets: AgentPreset[];
}
