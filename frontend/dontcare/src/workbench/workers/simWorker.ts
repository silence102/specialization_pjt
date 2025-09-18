/// <reference lib="webworker" />

// 워커 안에서는 경로/별칭 의존을 줄이기 위해 최소 타입만 로컬 정의
type AgentId =
  | 'router'
  | 'news'
  | 'fundamentals'
  | 'technical'
  | 'backtest'
  | 'strategy'
  | 'report';

interface RunStep {
  id: string;
  role: 'plan' | 'action' | 'verify' | 'summarize';
  agent: AgentId;
  name: string;
  status: 'queued' | 'running' | 'done' | 'error';
  logs?: string[];
  evidence?: { label: string; url?: string }[];
  outputs?: Record<string, unknown>;
}

type SimIn = {
  type: 'simulate';
  id: string;
  prompt: string;
  selectedAgents: AgentId[];
};

type SimOut =
  | {
      type: 'route';
      id: string;
      route: {
        graph: { nodes: AgentId[]; edges: [AgentId, AgentId][] };
        table: { agent: AgentId; reason: string }[];
      };
    }
  | { type: 'step'; id: string; step: RunStep }
  | { type: 'status'; id: string; status: 'queued' | 'running' | 'done' | 'error' }
  | { type: 'error'; id: string; error: string };

const post = (d: SimOut) => (postMessage as (m: SimOut) => void)(d);
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const rid = (p: string) => `${p}_${Math.random().toString(36).slice(2, 9)}`;
const rand = (a: number, b: number) => Math.floor(Math.random() * (b - a + 1)) + a;

const NODES: AgentId[] = [
  'router',
  'news',
  'fundamentals',
  'technical',
  'backtest',
  'strategy',
  'report',
];
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

async function emitStep(runId: string, step: RunStep) {
  post({ type: 'step', id: runId, step });
}

async function simulate(msg: SimIn) {
  post({ type: 'status', id: msg.id, status: 'running' });

  // 경로(고정)
  post({
    type: 'route',
    id: msg.id,
    route: {
      graph: { nodes: NODES, edges: EDGES },
      table: [
        { agent: 'news', reason: '핵심 뉴스 확인' },
        { agent: 'fundamentals', reason: '분기 재무 요약' },
        { agent: 'technical', reason: '추세/지표' },
        { agent: 'backtest', reason: '전략 성능 검증' },
        { agent: 'strategy', reason: '종합 결론' },
        { agent: 'report', reason: '리포트 생성' },
      ],
    },
  });

  // 1) router.plan
  await emitStep(msg.id, {
    id: rid('st'),
    role: 'plan',
    agent: 'router',
    name: 'plan',
    status: 'running',
  });
  await sleep(rand(350, 700));
  await emitStep(msg.id, {
    id: rid('st'),
    role: 'plan',
    agent: 'router',
    name: 'plan',
    status: 'done',
  });

  // 2) 병렬 4개
  const branches: { agent: AgentId; name: string }[] = [
    { agent: 'news', name: 'collect' },
    { agent: 'fundamentals', name: 'summarize' },
    { agent: 'technical', name: 'brief' },
    { agent: 'backtest', name: 'run' },
  ];
  const errorIndex = Math.random() < 0.12 ? rand(0, branches.length - 1) : -1;

  await Promise.all(
    branches.map(async (b, i) => {
      const id = rid('st');
      await emitStep(msg.id, { id, role: 'action', agent: b.agent, name: b.name, status: 'running' });
      await sleep(rand(600, 1200));
      await emitStep(msg.id, {
        id,
        role: 'action',
        agent: b.agent,
        name: b.name,
        status: i === errorIndex ? 'error' : 'done',
      });
    }),
  );

  // 3) strategy.compose
  const sid = rid('st');
  await emitStep(msg.id, { id: sid, role: 'summarize', agent: 'strategy', name: 'compose', status: 'running' });
  await sleep(rand(500, 900));
  await emitStep(msg.id, { id: sid, role: 'summarize', agent: 'strategy', name: 'compose', status: 'done' });

  // 4) report.build
  const rid2 = rid('st');
  await emitStep(msg.id, { id: rid2, role: 'summarize', agent: 'report', name: 'build', status: 'running' });
  await sleep(rand(400, 800));
  await emitStep(msg.id, { id: rid2, role: 'summarize', agent: 'report', name: 'build', status: 'done' });

  post({ type: 'status', id: msg.id, status: 'done' });
}

self.onmessage = (ev: MessageEvent<SimIn>) => {
  const data = ev.data;
  if (!data || data.type !== 'simulate') return;
  simulate(data).catch((e) =>
    post({ type: 'error', id: data.id, error: (e as Error)?.message ?? 'sim error' }),
  );
};
