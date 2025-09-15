import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutApi } from '@/auth/services/authApi';
import { useAuthStore } from '@/auth/stores/authStore';
import { clearTokens } from '@/auth/utils/tokenManager';
import type { ApiRequestStatus } from '@/auth/types/auth.api.types';

interface UseLogoutReturn {
  logout: () => Promise<void>;
  isLoading: boolean;
  status: ApiRequestStatus;
  error: string | null;
}

export function useLogout(): UseLogoutReturn {
  const navigate = useNavigate();
  const { getRefreshToken } = useAuthStore();

  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<ApiRequestStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const logout = async (): Promise<void> => {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      // refresh 토큰이 없으면 로컬에서만 로그아웃 처리
      clearTokens();
      navigate('/login');
      return;
    }

    setIsLoading(true);
    setStatus('loading');
    setError(null);

    try {
      // 서버에 로그아웃 요청
      await logoutApi({ refresh: refreshToken });

      // 성공 시 메모리에서 토큰 정리
      clearTokens();
      setStatus('success');

      // 로그인 페이지로 리다이렉트
      navigate('/login');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '로그아웃 중 오류가 발생했습니다.';
      setError(errorMessage);
      setStatus('error');

      // 에러가 발생해도 로컬에서는 로그아웃 처리
      clearTokens();
      navigate('/login');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    logout,
    isLoading,
    status,
    error,
  };
}
