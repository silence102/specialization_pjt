import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Agent, AgentId } from '@/workbench/types/agents';
import { AGENTS_SEED } from '@/workbench/constants/AGENTS_SEED';

interface AgentsState {
  agents: Agent[];
  selected: AgentId[];
  favorites: AgentId[];
  toggleSelect: (id: AgentId) => void;
  clearSelected: () => void;
  toggleFavorite: (id: AgentId) => void;
}

export const useAgentsStore = create<AgentsState>()(
  persist(
    (set) => ({
      agents: AGENTS_SEED,
      selected: [],
      favorites: [],
      toggleSelect: (id) =>
        set((s) => ({
          selected: s.selected.includes(id)
            ? s.selected.filter((x) => x !== id)
            : [...s.selected, id],
        })),
      clearSelected: () => set({ selected: [] }),
      toggleFavorite: (id) =>
        set((s) => ({
          favorites: s.favorites.includes(id)
            ? s.favorites.filter((x) => x !== id)
            : [...s.favorites, id],
        })),
    }),
    {
      name: 'dc:agents',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (s) => ({ selected: s.selected, favorites: s.favorites, agents: s.agents }),
    },
  ),
);
