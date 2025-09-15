import { useEffect, useCallback } from 'react';
import { useAuthStore } from '@/auth/stores/authStore';
import { tokenManager } from '@/auth/utils/tokenManager';

/**
 * 토큰 자동 갱신 훅
 *
 * @description
 * - 토큰 만료 전 자동 갱신
 * - 페이지 새로고침 시 토큰 상태 복원
 * - 토큰 갱신 실패 시 자동 로그아웃
 */
export const useTokenRefresh = () => {
  const { isAuthenticated, getAccessToken } = useAuthStore();

  /**
   * 토큰 갱신 수행
   */
  const refreshToken = useCallback(async () => {
    if (!isAuthenticated) {
      return;
    }

    try {
      await tokenManager.refreshAccessToken();
    } catch (error) {
      console.error('Token refresh failed:', error);
      // 토큰 갱신 실패 시 로그아웃 처리
      tokenManager.clearTokens();
      window.location.href = '/login';
    }
  }, [isAuthenticated]);

  /**
   * 토큰 만료 시간 계산
   */
  const getTokenExpirationTime = useCallback((token: string): number => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000; // 밀리초로 변환
    } catch {
      return 0;
    }
  }, []);

  /**
   * 다음 토큰 갱신 시간 계산 (만료 5분 전)
   */
  const getNextRefreshTime = useCallback(
    (token: string): number => {
      const expirationTime = getTokenExpirationTime(token);
      const refreshTime = expirationTime - 5 * 60 * 1000; // 5분 전
      return Math.max(refreshTime, Date.now() + 1000); // 최소 1초 후
    },
    [getTokenExpirationTime],
  );

  /**
   * 토큰 갱신 타이머 설정
   */
  const setupRefreshTimer = useCallback(() => {
    const accessToken = getAccessToken();
    if (!accessToken) {
      return;
    }

    const nextRefreshTime = getNextRefreshTime(accessToken);
    const timeUntilRefresh = nextRefreshTime - Date.now();

    if (timeUntilRefresh > 0) {
      const timer = setTimeout(() => {
        refreshToken();
      }, timeUntilRefresh);

      return () => clearTimeout(timer);
    } else {
      // 이미 만료되었거나 곧 만료될 예정인 경우 즉시 갱신
      refreshToken();
    }
  }, [getAccessToken, getNextRefreshTime, refreshToken]);

  /**
   * 컴포넌트 마운트 시 토큰 상태 확인 및 갱신 타이머 설정
   */
  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const cleanup = setupRefreshTimer();
    return cleanup;
  }, [isAuthenticated, setupRefreshTimer]);

  /**
   * 페이지 가시성 변경 시 토큰 상태 확인
   */
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isAuthenticated) {
        // 페이지가 다시 보이게 되었을 때 토큰 유효성 확인
        const accessToken = getAccessToken();
        if (accessToken && !tokenManager.isTokenValid()) {
          refreshToken();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAuthenticated, getAccessToken, refreshToken]);

  return {
    refreshToken,
    isTokenValid: tokenManager.isTokenValid(),
  };
};
