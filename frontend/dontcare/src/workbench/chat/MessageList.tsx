// 1. React & built-ins
import { useEffect, useRef } from 'react';

// 2. External libs
// (none)

// 3. Internal modules
import type { ChatMessage } from '@/workbench/types/chatTypes';

interface MessageListProps {
  messages: ChatMessage[];
}

export function MessageList({ messages }: MessageListProps) {
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    return () => {
      // cleanup 없음
    };
  }, [messages]);

  return (
    <section
      aria-label="대화 메시지 목록"
      className="flex-1 overflow-y-auto rounded-2xl border border-[color:var(--dc-border)] bg-[color:var(--dc-card)] p-4"
      role="feed"
    >
      <ul role="list" className="space-y-3">
        {messages.map((m) => (
          <li key={m.id} role="listitem" aria-label={m.role === 'user' ? '사용자 메시지' : '에이전트 메시지'}>
            <article
              className={[
                'rounded-xl border p-3',
                m.role === 'assistant' ? 'bg-background/20' : 'bg-background/5',
              ].join(' ')}
            >
              <header className="mb-1 text-xs text-muted-foreground">
                {m.role === 'user' ? '사용자' : m.role === 'assistant' ? '에이전트' : '시스템'}
              </header>
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{m.content}</p>
            </article>
          </li>
        ))}
      </ul>
      <div ref={endRef} />
    </section>
  );
}
