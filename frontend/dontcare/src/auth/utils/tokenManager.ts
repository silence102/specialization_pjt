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
      const payload = this._decodeJwtPayload(token);
      if (!payload || typeof payload.exp !== 'number') return false;
      const now = Math.floor(Date.now() / 1000);
      const leewaySec = 30;
      return payload.exp - leewaySec > now;
    } catch {
      return false;
    }
  }

  // SSR 폴백이 있는 base64url-safe JWT 페이로드 디코딩
  private _decodeJwtPayload(token: string): Record<string, unknown> | null {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    let b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const pad = b64.length % 4;
    if (pad) b64 += '='.repeat(4 - pad);
    let json: string;
    if (typeof globalThis.atob === 'function') {
      json = globalThis.atob(b64);
    } else {
      // Node/SSR 폴백
      json = Buffer.from(b64, 'base64').toString('utf8');
    }
    return JSON.parse(json);
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
      throw new Error('리프레시 토큰을 사용할 수 없습니다');
    }

    try {
      const { access } = await refreshTokenApi({ refresh: refreshToken });

      // 새로운 액세스 토큰 반영 (리프레시 토큰은 기존 값 유지)
      useAuthStore.getState().setTokens(access, refreshToken);

      return access;
    } catch (error) {
      const apiError = error as ApiError;

      // 401 에러인 경우 리프레시 토큰도 만료된 것으로 간주
      if (apiError.status === 401) {
        this.clearTokens();
        throw new Error('리프레시 토큰이 만료되었습니다. 다시 로그인해주세요.');
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
  private _isRetryableError(error: unknown): boolean {
    const status = (error as ApiError)?.status;
    if (status === undefined || status === 0) return true; // 네트워크/페치 에러
    return [408, 429, 500, 502, 503, 504].includes(status);
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
      console.error('토큰 갱신 실패:', error);
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
