// src/workbench/layout/HomeSplit.tsx

// 1. React & built-ins
import { useState } from 'react';

// 2. External libs
// (none)

// 3. Internal modules 
// (좌측)
import { NowBar } from '@/workbench/chat/NowBar';
import { ContextBar } from '@/workbench/chat/ContextBar';
import { MessageList } from '@/workbench/chat/MessageList';
import { Composer } from '@/workbench/chat/Composer';

// (우측)
import { AgentFilters } from '@/workbench/agents/AgentFilters';
import { AgentGrid } from '@/workbench/agents/AgentGrid';
import { RunQueue } from '@/workbench/agents/RunQueue';
import { AgentRoutingViz } from '@/workbench/chat/AgentRoutingViz';

// Store & Types 
import { useAgentsStore } from '@/workbench/stores/useAgentsStore';
import { useRunsStore } from '@/workbench/stores/useRunsStore';
import type { ChatMessage } from '@/workbench/types/chatTypes';
import type { AgentId } from '@/workbench/types/agents';

// Lib
import { createId } from '@/workbench/lib/id';
import { DEMO_ASSISTANT_ECHO } from '@/workbench/constants/UI_CONSTANTS';
// import { useIsDesktop } from '@/workbench/hooks/useBreakpoint';
import { useComposerStore } from '@/workbench/stores/useComposerStore'; 
import { Button } from '@/shared/components/ui/button';

// 임시로 주석 처리해둔 상태 -> 화면 비율 문제가 있어서 보류 중
// import {
//   ResizablePanelGroup,
//   ResizablePanel,
//   ResizableHandle,
// } from '@/shared/components/ui/resizable';

// const ENABLE_RESIZABLE = true;

export function HomeSplit() {
  // const isDesktop = useIsDesktop();

  // 좌측 채팅 - 데모
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // 우측 패널 상태
  const [query, setQuery] = useState('');

  // const composerRef = useRef<ComposerHandle | null>(null);

  // Stores
  const agents = useAgentsStore((s) => s.agents);
  const selectedAgents = useAgentsStore((s) => s.selected);
  
  const enqueue = useRunsStore((s) => s.enqueue);
  const simulate = useRunsStore((s) => s.simulate);
  const runs = useRunsStore((s) => s.runs);
  
  // Composer 전역 드래프트 사용(프리셋 주입 전용)
  const setDraft = useComposerStore((s) => s.setDraft);
  const requestFocus = useComposerStore((s) => s.requestFocus);
  
  function handleSubmit(text: string) {
    // 0) 입력 정리
    const input = text.trim();
    if (!input) return;

    // 1) 대화 메시지 준비
    const now = Date.now();
    const userMsg: ChatMessage = {
      id: createId('msg'),
      role: 'user',
      content: input,
      createdAt: now,
    };
    const assistantEcho: ChatMessage = {
      id: createId('msg'),
      role: 'assistant',
      content: DEMO_ASSISTANT_ECHO,
      createdAt: now,
    };

    // 2) 메시지 반영
    setMessages((prev) => [...prev, userMsg, assistantEcho]);

    // 3) 실행 큐 payload 분리
    const runPayload: Parameters<typeof enqueue>[0] = {
      prompt: input,
      autonomy: 'ask',
      selectedAgents, // store에서 가져온 현재 선택 에이전트
    };

    // 4) 한 번만 enqueue → simulate
    const runId = enqueue(runPayload);
    simulate(runId);
  }

  function handlePickPreset(_label: string, prompt: string) {
    setDraft(prompt);
    requestFocus();
  }

  // RunQueue로 보낼 표시 전용 아이템
  const queueItems = runs.map((r) => ({
    id: r.id,
    title: r.prompt,
    status: r.status,
    progress: r.steps.length ? Math.round((r.steps.filter(s => s.status === 'done').length / r.steps.length) * 100) : 0,
  }));
  
  // RoutingViz 상태 매핑
 const activeRun = runs[0];
  const statusMap: Partial<Record<AgentId, 'idle' | 'queued' | 'running' | 'done' | 'error'>> =
    activeRun
      ? activeRun.steps.reduce((m, s) => {
          m[s.agent] = s.status;
          return m;
        }, {} as Partial<Record<AgentId, 'idle' | 'queued' | 'running' | 'done' | 'error'>>)
      : {};
  
  
  return (
    <div className="flex min-h-screen w-full flex-col bg-[color:var(--dc-bg)] text-[color:var(--dc-text)]">
      {/* Mobile: 탭 placeholder */}
      <div className="md:hidden">
        <div className="flex items-center gap-2 border-b border-[color:var(--dc-border)] px-3 py-2">
          <button
            type="button"
            className="rounded px-3 py-1.5 text-sm font-medium text-[color:var(--dc-text)] ring-offset-background transition-colors hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            aria-current="page"
          >
            대화
          </button>
          <button
            type="button"
            className="rounded px-3 py-1.5 text-sm font-medium text-[color:var(--dc-text)]/60 ring-offset-background transition-colors hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            에이전트
          </button>
        </div>
      </div>

      {/* Tablet: 에이전트 열기 버튼(추후 Sheet 연동) */}
      <div className="hidden items-center justify-end gap-2 border-b border-[color:var(--dc-border)] px-3 py-2 md:flex xl:hidden">
        <Button variant="outline" size="sm" type="button" aria-label="에이전트 패널 열기">
          에이전트 열기
        </Button>
      </div>

      {/* Main */}
      <div className="flex-1">
        {/* Desktop */}
        <div className="hidden h-[calc(100dvh)] xl:flex">
          {/* Left */}
          <section aria-label="대화 영역" className="flex min-w-0 flex-[7] flex-col overflow-hidden p-4">
            <NowBar />
            <ContextBar ticker="AAPL" periodLabel="최근 6개월" attachmentsCount={0} />
            <MessageList messages={messages} />
            <Composer onSubmit={handleSubmit} />
          </section>

          {/* Resize handle placeholder (shadcn Resizable로 교체 예정) */}
          <button
            type="button"
            aria-label="패널 크기 조절"
            className="group relative w-2 cursor-col-resize select-none bg-transparent hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            title="드래그로 크기 조절 (미구현)"
          >
            <span className="absolute inset-y-0 left-1/2 -ml-px w-0.5 rounded bg-white/20 transition-colors group-hover:bg-white/40" />
          </button>

          {/* Right */}
          <aside aria-label="에이전트 패널" className="flex min-w-[420px] flex-[5] flex-col overflow-hidden border-l border-[color:var(--dc-border)] p-4">
            <div className="flex flex-col gap-3">
              <AgentFilters query={query} onQueryChange={setQuery} onReset={() => setQuery('')} />
              <AgentRoutingViz status={statusMap} />
              <AgentGrid agents={agents} query={query} onPickPreset={handlePickPreset} />
              <RunQueue items={queueItems} />
            </div>
          </aside>
        </div>

        {/* Mobile & Tablet (<1280px): only conversation area */}
        <div className="h-[calc(100dvh-88px)] xl:hidden">
          <section aria-label="대화 영역" className="flex min-h-[100svh] w-full min-w-0 flex-col p-4">
            <NowBar />
            <ContextBar ticker="AAPL" periodLabel="최근 6개월" attachmentsCount={0} />
              <div className="min-h-0 flex-1">
                  <MessageList messages={messages} />
              </div>
            <Composer onSubmit={handleSubmit} />
          </section>
        </div>
      </div>
    </div>
  );
}