// named export only
import { memo, useEffect, useMemo, useState } from 'react';
import type { AgentId } from '@/workbench/types/agents';

type StepStatus = 'idle' | 'queued' | 'running' | 'done' | 'error';

interface AgentRoutingVizProps {
  /** 각 에이전트 상태 맵. 없으면 idle로 표시 */
  status?: Partial<Record<AgentId, StepStatus>>;
  className?: string;
  /** 강조할 엣지(선택) */
  highlightEdge?: [AgentId, AgentId];
}

/** 고정 좌표(viewBox 600x360) — 디자인 토대로 튜닝됨 */
const NODE_POS: Record<AgentId, { x: number; y: number }> = {
  router: { x: 300, y: 180 },
  news: { x: 410, y: 150 },
  fundamentals: { x: 330, y: 70 },
  technical: { x: 260, y: 150 },
  backtest: { x: 330, y: 310 },
  strategy: { x: 520, y: 300 },
  report: { x: 590, y: 180 },
};

const EDGES: [AgentId, AgentId][] = [
  ['router', 'news'],
  ['router', 'fundamentals'],
  ['router', 'technical'],
  ['router', 'backtest'],
  ['news', 'strategy'],
  ['fundamentals', 'strategy'],
  ['technical', 'strategy'],
  ['backtest', 'strategy'],
  ['strategy', 'report'],
];

function statusClasses(s: StepStatus): { stroke: string; fill: string; ring?: string } {
  switch (s) {
    case 'running':
      return {
        stroke: 'stroke-[color:var(--dc-accent-2)]',
        fill: 'fill-[color:var(--dc-card)]',
        ring: 'animate-pulse',
      };
    case 'queued':
      return {
        stroke: 'stroke-[color:var(--dc-accent)]/70',
        fill: 'fill-[color:var(--dc-card)]',
      };
    case 'done':
      return {
        stroke: 'stroke-[color:var(--dc-success)]',
        fill: 'fill-[color:var(--dc-card)]',
      };
    case 'error':
      return {
        stroke: 'stroke-[color:var(--dc-error)]',
        fill: 'fill-[color:var(--dc-card)]',
      };
    default:
      return {
        stroke: 'stroke-[color:var(--dc-border)]',
        fill: 'fill-[color:var(--dc-card)]',
      };
  }
}

export const AgentRoutingViz = memo(function AgentRoutingViz({
  status,
  className,
  highlightEdge,
}: AgentRoutingVizProps) {
  // 접근성: 사용자 선호 모션 감지 (fallback: 정적)
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    setReduced(Boolean(mq?.matches));
    const onChange = () => setReduced(Boolean(mq?.matches));
    mq?.addEventListener?.('change', onChange);
    return () => mq?.removeEventListener?.('change', onChange);
  }, []);

  const nodeStatus = useMemo<Record<AgentId, StepStatus>>(() => {
    const base: Record<AgentId, StepStatus> = {
      router: 'idle',
      news: 'idle',
      fundamentals: 'idle',
      technical: 'idle',
      backtest: 'idle',
      strategy: 'idle',
      report: 'idle',
    };
    if (status) {
      for (const k of Object.keys(status) as AgentId[]) {
        const v = status[k];
        if (v) base[k] = v;
      }
    }
    return base;
  }, [status]);

  const edgeKey = highlightEdge ? `${highlightEdge[0]}->${highlightEdge[1]}` : '';

  return (
    <section
      aria-label="작업 경로 시각화"
      className={[
        'rounded-2xl border border-[color:var(--dc-border)] bg-[color:var(--dc-card)] p-3 backdrop-blur-md',
        className ?? '',
      ].join(' ')}
    >
      <svg
        viewBox="0 0 600 360"
        role="img"
        aria-describedby="viz-desc"
        className="h-[260px] w-full"
      >
        <desc id="viz-desc">
          사용자 요청이 라우터를 통해 각 분석 비서로 분기된 뒤 전략과 리포트로 이어지는 경로를 나타냅니다.
        </desc>

        {/* 궤도 가이드 (점선 타원) */}
        <g className="stroke-[color:var(--dc-border)]/60 fill-none">
          <ellipse cx="300" cy="180" rx="210" ry="120" className="stroke-[3] [stroke-dasharray:6_6]" />
          <ellipse cx="300" cy="180" rx="150" ry="85" className="stroke-[3] [stroke-dasharray:6_6]" />
          <ellipse cx="300" cy="180" rx="90" ry="50" className="stroke-[3] [stroke-dasharray:6_6]" />
        </g>

        {/* 엣지 */}
        <g>
          {EDGES.map(([a, b]) => {
            const p1 = NODE_POS[a];
            const p2 = NODE_POS[b];
            const isHL = edgeKey === `${a}->${b}`;
            return (
              <line
                key={`${a}-${b}`}
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                className={[
                  'stroke-2',
                  isHL
                    ? 'stroke-[color:var(--dc-accent-2)]'
                    : 'stroke-[color:var(--dc-border)]/70',
                  isHL ? '' : '[stroke-dasharray:6_6]',
                ].join(' ')}
              />
            );
          })}
        </g>

        {/* 노드 */}
        <g>
          {(Object.keys(NODE_POS) as AgentId[]).map((id) => {
            const p = NODE_POS[id];
            const s = nodeStatus[id];
            const cls = statusClasses(s);
            const label =
              id === 'router'
                ? '라우터'
                : id === 'news'
                ? '뉴스'
                : id === 'fundamentals'
                ? '재무'
                : id === 'technical'
                ? '기술'
                : id === 'backtest'
                ? '백테스트'
                : id === 'strategy'
                ? '전략'
                : '리포트';

            return (
              <g key={id} transform={`translate(${p.x},${p.y})`} aria-label={`${label} 노드`}>
                {/* glow/pulse ring (running) */}
                {!reduced && cls.ring ? (
                  <circle r={18} className={`opacity-60 ${cls.stroke} ${cls.ring}`} />
                ) : null}
                <circle r={16} className={`${cls.fill} ${cls.stroke}`} strokeWidth={2} />
                <text
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="select-none text-[10px] fill-[color:var(--dc-text)]"
                >
                  {label}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </section>
  );
});
