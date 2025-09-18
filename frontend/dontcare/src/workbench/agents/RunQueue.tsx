// 1. React & built-ins
import { memo } from 'react';

// 2. External libs
// (none)

// 3. Internal modules
// (none)

export interface RunQueueItem {
  id: string;
  title: string;           // 나중에 프롬프트 일부 등
  status: 'queued' | 'running' | 'done' | 'error';
  progress?: number;
}

interface RunQueueProps {
  items: RunQueueItem[];
}

export const RunQueue = memo(function RunQueue({ items }: RunQueueProps) {
  if (items.length === 0) {
    return (
      <section
        aria-label="실행 대기열"
        className="rounded-2xl border border-[color:var(--dc-border)] bg-[color:var(--dc-card)] p-3 text-sm text-muted-foreground"
      >
        대기열이 비어 있습니다.
      </section>
    );
  }

  return (
    <section
      aria-label="실행 대기열"
      className="rounded-2xl border border-[color:var(--dc-border)] bg-[color:var(--dc-card)] p-2"
    >
      <ul className="space-y-2">
        {items.map((it) => (
          <li key={it.id} className="rounded-xl border border-[color:var(--dc-border)] p-2">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-sm">{it.title}</p>
              <span className="text-xs text-muted-foreground">{it.status}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
});
