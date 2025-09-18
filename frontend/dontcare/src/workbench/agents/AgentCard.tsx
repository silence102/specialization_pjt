// 1. React & built-ins
import { memo } from 'react';
import { useComposerStore } from '@/workbench/stores/useComposerStore';

// 2. External libs
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import {
  Newspaper,
  LibraryBig,
  Activity,
  FlaskConical,
  Layers,
  FileChartColumn,
} from 'lucide-react';

// 3. Internal modules
import type { Agent } from '@/workbench/types/agents';

const ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Newspaper,
  LibraryBig,
  Activity,
  FlaskConical,
  Layers,
  FileChartColumn,
};

interface AgentCardProps {
  agent: Agent;
  /** (선택) 부모에서 별도 처리하고 싶을 때만 사용 — 기본은 store로 드래프트 주입 */
  onPickPreset?: (label: string, prompt: string) => void;
}

export const AgentCard = memo(function AgentCard({ agent, onPickPreset }: AgentCardProps) {
  const setDraft = useComposerStore((s) => s.setDraft);
  const requestFocus = useComposerStore((s) => s.requestFocus);

  const Icon = ICONS[agent.icon] ?? Newspaper;
  const firstPreset = agent.presets?.[0]; // ✅ 안전 접근

  function handlePresetClick() {
    if (!firstPreset) return;
    // 전역 드래프트에 반영 + 포커스 신호
    setDraft(firstPreset.prompt);
    requestFocus();
    // (선택) 상위 콜백도 호출 — 데스크톱/모바일 어디서든 일관
    onPickPreset?.(firstPreset.label, firstPreset.prompt);
  }

  return (
    <Card
      role="article"
      aria-label={`${agent.name} 카드`}
      className="h-full rounded-2xl border border-[color:var(--dc-border)] bg-[color:var(--dc-card)]"
    >
      <CardHeader className="flex flex-row items-center gap-3 space-y-0">
        <div className="rounded-xl border border-[color:var(--dc-border)] p-2">
          <Icon size={18} />
        </div>
        <div className="min-w-0">
          <CardTitle className="truncate text-sm">{agent.name}</CardTitle>
          <p className="truncate text-xs text-muted-foreground">{agent.description}</p>
        </div>
      </CardHeader>

      <CardContent className="mt-2">
        {firstPreset ? (
          <Button
            type="button"                // ✅ submit 방지
            size="sm"
            onClick={handlePresetClick}  // ✅ 존재하지 않는 변수 p 제거
            aria-label={`${agent.name} 프리셋 실행`}
            className="w-full"
          >
            {firstPreset.label}
          </Button>
        ) : (
          <p className="text-xs text-muted-foreground">프리셋 없음</p>
        )}
      </CardContent>
    </Card>
  );
});
