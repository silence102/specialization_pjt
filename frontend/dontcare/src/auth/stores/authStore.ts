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
  setUser: (user: User) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  // 초기 상태
  isAuthenticated: false,
  user: null,
  accessToken: null,
  refreshToken: null,

  // 액션들
  login: (tokens, user) => {
    set({
      isAuthenticated: true,
      accessToken: tokens.access,
      refreshToken: tokens.refresh,
      user,
    });
  },

  logout: () => {
    set({
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,
      user: null,
    });
  },

  setUser: (user) => {
    set({ user });
  },

  setTokens: (accessToken, refreshToken) => {
    set({
      accessToken,
      refreshToken,
      isAuthenticated: true,
    });
  },

  clearAuth: () => {
    set({
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,
      user: null,
    });
  },

  getAccessToken: () => {
    return get().accessToken;
  },

  getRefreshToken: () => {
    return get().refreshToken;
  },
}));
