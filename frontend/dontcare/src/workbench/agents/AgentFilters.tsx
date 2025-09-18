// 1. React & built-ins
import { memo } from 'react';

// 2. External libs
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';

// 3. Internal modules
// (none)

interface AgentFiltersProps {
  query: string;
  onQueryChange: (v: string) => void;
  onReset?: () => void;
}

export const AgentFilters = memo(function AgentFilters({
  query,
  onQueryChange,
  onReset,
}: AgentFiltersProps) {
  return (
    <section
      aria-label="에이전트 필터"
      className="mb-3 flex items-center gap-2 rounded-2xl border border-[color:var(--dc-border)] bg-[color:var(--dc-card)] p-3 backdrop-blur-md"
    >
      <Input
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="에이전트 검색…"
        aria-label="에이전트 검색"
        className="h-9"
      />
      <Button type="button" variant="ghost" onClick={onReset} aria-label="필터 초기화">
        초기화
      </Button>
    </section>
  );
});
