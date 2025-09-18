// named exports only
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { RunItem, RunStep } from '@/workbench/types/runTypes';
import type { AgentId } from '@/workbench/types/agents';
import { createId } from '@/workbench/lib/id';

interface EnqueueInput {
  prompt: string;
  autonomy: 'ask' | 'semi' | 'auto';
  selectedAgents: AgentId[];
}

interface RunsState {
  runs: RunItem[];
  activeId?: string;
  enqueue: (input: EnqueueInput) => string;
  update: (id: string, patch: Partial<RunItem>) => void;
  simulate: (id: string) => void;
}

function upsertStep(steps: RunStep[], incoming: RunStep): RunStep[] {
  const idx = steps.findIndex((s) => s.id === incoming.id);
  if (idx >= 0) {
    const next = steps.slice();
    next[idx] = { ...next[idx], ...incoming };
    return next;
  }
  return [...steps, incoming];
}

export const useRunsStore = create<RunsState>()(
  persist(
    (set, get) => {
      // 워커 싱글톤
      const worker = new Worker(new URL('../workers/simWorker.ts', import.meta.url), {
        type: 'module',
      });

      worker.onmessage = (ev: MessageEvent) => {
        const data = ev.data as
          | { type: 'route'; id: string; route: RunItem['route'] }
          | { type: 'step'; id: string; step: RunStep }
          | { type: 'status'; id: string; status: RunItem['status'] }
          | { type: 'error'; id: string; error: string };

        if (data.type === 'route') {
          set((s) => ({
            runs: s.runs.map((r) => (r.id === data.id ? { ...r, route: data.route } : r)),
          }));
          return;
        }
        if (data.type === 'step') {
          set((s) => ({
            runs: s.runs.map((r) =>
              r.id === data.id ? { ...r, steps: upsertStep(r.steps, data.step) } : r,
            ),
          }));
          return;
        }
        if (data.type === 'status') {
          set((s) => ({
            runs: s.runs.map((r) => (r.id === data.id ? { ...r, status: data.status } : r)),
          }));
          return;
        }
        if (data.type === 'error') {
          set((s) => ({
            runs: s.runs.map((r) =>
              r.id === data.id ? { ...r, status: 'error', error: data.error } : r,
            ),
          }));
        }
      };

      return {
        runs: [],
        activeId: undefined,

        enqueue: (input) => {
          const id = createId('run');
          const now = Date.now();
          const newRun: RunItem = {
            id,
            createdAt: now,
            prompt: input.prompt,
            autonomy: input.autonomy,
            selectedAgents: input.selectedAgents,
            status: 'queued',
            route: { graph: { nodes: [], edges: [] }, table: [] },
            steps: [],
          };
          set((s) => ({ runs: [newRun, ...s.runs], activeId: id }));
          return id;
        },

        update: (id, patch) =>
          set((s) => ({ runs: s.runs.map((r) => (r.id === id ? { ...r, ...patch } : r)) })),

        simulate: (id) => {
          const run = get().runs.find((r) => r.id === id);
          if (!run) return;

          // running 전환
          set((s) => ({
            runs: s.runs.map((r) => (r.id === id ? { ...r, status: 'running' } : r)),
          }));

          try {
            worker.postMessage({
              type: 'simulate' as const,
              id,
              prompt: run.prompt,
              selectedAgents: run.selectedAgents,
            });
          } catch (e) {
            set((s) => ({
              runs: s.runs.map((r) =>
                r.id === id
                  ? { ...r, status: 'error', error: (e as Error)?.message ?? 'worker error' }
                  : r,
              ),
            }));
          }
        },
      };
    },
    {
      name: 'dc:runs',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (s) => ({ runs: s.runs, activeId: s.activeId }),
    },
  ),
);
