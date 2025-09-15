import { refreshTokenApi } from '@/auth/services/authApi';
import { useAuthStore } from '@/auth/stores/authStore';
import type { ApiError } from '@/auth/types/auth.api.types';

/**
 * 토큰 관리 유틸리티
 *
 * @description
 * - 메모리 기반 토큰 저장 및 관리
 * - 자동 토큰 갱신 및 로테이션
 * - XSS 공격으로부터 토큰 보호
 * - httpOnly 쿠키와 함께 사용하여 보안 강화
 */

interface TokenRefreshOptions {
  retryCount?: number;
  maxRetries?: number;
}

class TokenManager {
  private static instance: TokenManager;
  private refreshPromise: Promise<string> | null = null;

  private constructor() {}

  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  /**
   * 현재 액세스 토큰 가져오기
   */
  getAccessToken(): string | null {
    return useAuthStore.getState().getAccessToken();
  }

  /**
   * 현재 리프레시 토큰 가져오기
   */
  getRefreshToken(): string | null {
    return useAuthStore.getState().getRefreshToken();
  }

  /**
   * 토큰이 유효한지 확인
   */
  isTokenValid(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;

    try {
      // JWT 토큰 디코딩하여 만료 시간 확인
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp > currentTime;
    } catch {
      return false;
    }
  }

  /**
   * 토큰 갱신 (중복 요청 방지)
   */
  async refreshAccessToken(options: TokenRefreshOptions = {}): Promise<string> {
    const { retryCount = 0, maxRetries = 3 } = options;

    // 이미 갱신 중인 경우 동일한 Promise 반환
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this._performTokenRefresh(retryCount, maxRetries);

    try {
      const newToken = await this.refreshPromise;
      return newToken;
    } finally {
      this.refreshPromise = null;
    }
  }

  /**
   * 실제 토큰 갱신 수행
   */
  private async _performTokenRefresh(retryCount: number, maxRetries: number): Promise<string> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await refreshTokenApi({ refresh: refreshToken });

      // 새로운 액세스 토큰으로 업데이트
      useAuthStore.getState().setTokens(response.access, refreshToken);

      return response.access;
    } catch (error) {
      const apiError = error as ApiError;

      // 401 에러인 경우 리프레시 토큰도 만료된 것으로 간주
      if (apiError.status === 401) {
        this.clearTokens();
        throw new Error('Refresh token expired. Please login again.');
      }

      // 재시도 가능한 에러인 경우 재시도
      if (retryCount < maxRetries && this._isRetryableError(apiError)) {
        await this._delay(Math.pow(2, retryCount) * 1000); // 지수 백오프
        return this._performTokenRefresh(retryCount + 1, maxRetries);
      }

      throw error;
    }
  }

  /**
   * 재시도 가능한 에러인지 확인
   */
  private _isRetryableError(error: ApiError): boolean {
    const retryableStatuses = [408, 429, 500, 502, 503, 504];
    return retryableStatuses.includes(error.status || 0);
  }

  /**
   * 지연 함수
   */
  private _delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * 토큰 정리
   */
  clearTokens(): void {
    useAuthStore.getState().clearAuth();
  }

  /**
   * 유효한 액세스 토큰 가져오기 (필요시 자동 갱신)
   */
  async getValidAccessToken(): Promise<string | null> {
    // 토큰이 유효한 경우 바로 반환
    if (this.isTokenValid()) {
      return this.getAccessToken();
    }

    // 토큰이 만료된 경우 갱신 시도
    try {
      return await this.refreshAccessToken();
    } catch (error) {
      console.error('Failed to refresh token:', error);
      this.clearTokens();
      return null;
    }
  }
}

// 싱글톤 인스턴스 내보내기
export const tokenManager = TokenManager.getInstance();

// 편의 함수들
export const getAccessToken = () => tokenManager.getAccessToken();
export const getRefreshToken = () => tokenManager.getRefreshToken();
export const isTokenValid = () => tokenManager.isTokenValid();
export const refreshAccessToken = (options?: TokenRefreshOptions) =>
  tokenManager.refreshAccessToken(options);
export const getValidAccessToken = () => tokenManager.getValidAccessToken();
export const clearTokens = () => tokenManager.clearTokens();
