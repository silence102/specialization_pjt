import { create } from 'zustand';
import type { User, TokenResponse } from '@/auth/types/auth.api.types';

interface AuthState {
  // 상태
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;

  // 액션
  login: (tokens: TokenResponse, user: User) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
}

const initialState: Pick<AuthState, 'isAuthenticated' | 'user' | 'accessToken' | 'refreshToken'> = {
  isAuthenticated: false,
  user: null,
  accessToken: null,
  refreshToken: null,
};

export const useAuthStore = create<AuthState>((set, get) => ({
  // 초기 상태
  ...initialState,

  // 액션들
  login: (tokens, user) => {
    set({
      isAuthenticated: true,
      accessToken: tokens.access,
      refreshToken: tokens.refresh,
      user,
    });
  },

  logout: () => get().clearAuth(),

  setUser: (user) => {
    set({ user });
  },

  setTokens: (accessToken, refreshToken) => {
    set({
      accessToken,
      refreshToken,
      isAuthenticated: Boolean(accessToken),
    });
  },

  clearAuth: () => set(() => ({ ...initialState })),

  getAccessToken: () => {
    return get().accessToken;
  },

  getRefreshToken: () => {
    return get().refreshToken;
  },
}));
