import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import { loginApi } from '@/auth/services/authApi';
import { useAuthStore } from '@/auth/stores/authStore';
import type { LoginRequest, TokenResponse } from '@/auth/types/auth.api.types';

/**
 * 로그인 커스텀 훅
 *
 * @description
 * - TanStack Query의 useMutation을 사용한 로그인 로직
 * - 로딩, 에러, 성공 상태를 자동으로 관리
 * - 타입 안전한 API 호출
 */
export const useLogin = () => {
  const navigate = useNavigate();
  const { login: setAuth } = useAuthStore();
  const isProcessingRef = useRef(false);

  return useMutation<TokenResponse, Error, LoginRequest>({
    mutationFn: async (data) => {
      // 중복 요청 방지
      if (isProcessingRef.current) {
        throw new Error('Login request already in progress');
      }

      isProcessingRef.current = true;
      try {
        return await loginApi(data);
      } finally {
        isProcessingRef.current = false;
      }
    },
    onSuccess: (data) => {
      // 로그인 응답에 이미 user 정보가 포함되어 있음

      // 메모리 기반 스토어에 저장 (localStorage 사용 안함)
      setAuth(data, data.user);

      // 홈페이지로 리다이렉트
      navigate('/home');
    },
    onError: (error) => {
      // 에러 처리 로직
      console.error('Login failed:', error);

      // 에러는 LoginForm에서 처리됨 (UI에 표시)
    },
  });
};
