import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface ComposerState {
  draft: string;
  focusTick: number;                  // focus 신호(증가값)
  setDraft: (v: string) => void;
  requestFocus: () => void;
  clear: () => void;
}

export const useComposerStore = create<ComposerState>()(
  persist(
    (set) => ({
      draft: '',
      focusTick: 0,
      setDraft: (v) => set({ draft: v }),
      requestFocus: () => set((s) => ({ focusTick: s.focusTick + 1 })),
      clear: () => set({ draft: '' }),
    }),
    { name: 'dc:composer', storage: createJSONStorage(() => sessionStorage) },
  ),
);
