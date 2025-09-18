// 1. React & built-ins
import { memo } from 'react';

// 2. External libs
// (none)

// 3. Internal modules
import type { Agent } from '@/workbench/types/agents';
import { AgentCard } from '@/workbench/agents/AgentCard';

interface AgentGridProps {
  agents: Agent[];
  query?: string;
  onPickPreset: (label: string, prompt: string) => void;
}

export const AgentGrid = memo(function AgentGrid({ agents, query, onPickPreset }: AgentGridProps) {
  const q = (query ?? '').toLowerCase();
  const filtered = agents.filter(
    (a) =>
      a.name.toLowerCase().includes(q) ||
      a.description.toLowerCase().includes(q) ||
      a.presets.some((p) => p.label.toLowerCase().includes(q)),
  );

  if (filtered.length === 0) {
    return (
      <div className="flex h-full items-center justify-center rounded-2xl border border-dashed p-6 text-sm text-muted-foreground">
        에이전트를 찾지 못했어요.
      </div>
    );
  }

  return (
    <div
      aria-label="에이전트 그리드"
      className="grid grid-cols-1 gap-3 md:grid-cols-2 2xl:grid-cols-3"
      role="list"
    >
      {filtered.map((agent) => (
        <div key={agent.id} role="listitem" className="min-h-[140px]">
          <AgentCard agent={agent} onPickPreset={onPickPreset} />
        </div>
      ))}
    </div>
  );
});
