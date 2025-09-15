import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
  type AxiosError,
  type AxiosRequestConfig,
} from 'axios';
import { getValidAccessToken, clearTokens } from '@/auth/utils/tokenManager';

/**
 * 커스텀 요청 설정 타입 확장
 */
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  metadata?: {
    startTime: number;
  };
}

/**
 * API 에러 응답 타입
 */
interface ApiErrorResponse {
  message?: string;
  code?: string;
  details?: Record<string, unknown>;
}

/**
 * API 환경 설정
 */
interface ApiConfig {
  readonly baseURL: string;
  readonly timeout: number;
  readonly retryAttempts: number;
  readonly retryDelay: number;
}

const API_CONFIG: ApiConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  timeout: 10000,
  retryAttempts: 3,
  retryDelay: 1000,
} as const;

/**
 * API 응답 타입 정의
 */
export interface ApiResponse<T = unknown> {
  readonly data: T;
  readonly message?: string;
  readonly success: boolean;
  readonly timestamp: string;
}

/**
 * API 에러 타입 정의
 */
export interface ApiError {
  readonly message: string;
  readonly code?: string;
  readonly status?: number;
  readonly details?: Record<string, unknown>;
}

/**
 * 재시도 가능한 HTTP 상태 코드
 */
const RETRYABLE_STATUS_CODES = [408, 429, 500, 502, 503, 504] as const;

/**
 * 로깅 유틸리티
 */
const logger = {
  info: (message: string, data?: unknown) => {
    if (import.meta.env.DEV) {
      console.log(`[API Client] ${message}`, data);
    }
  },
  error: (message: string, error?: unknown) => {
    if (import.meta.env.DEV) {
      console.error(`[API Client] ${message}`, error);
    }
  },
  warn: (message: string, data?: unknown) => {
    if (import.meta.env.DEV) {
      console.warn(`[API Client] ${message}`, data);
    }
  },
};

/**
 * 지연 함수
 */
const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * 재시도 로직
 */
const shouldRetry = (error: AxiosError): boolean => {
  if (!error.response) return true; // 네트워크 에러
  return RETRYABLE_STATUS_CODES.includes(error.response.status as never);
};

/**
 * 재시도 실행
 */
const executeWithRetry = async <T>(requestFn: () => Promise<T>, retryCount = 0): Promise<T> => {
  try {
    return await requestFn();
  } catch (error) {
    const axiosError = error as AxiosError;

    if (retryCount < API_CONFIG.retryAttempts && shouldRetry(axiosError)) {
      logger.warn(`Request failed, retrying... (${retryCount + 1}/${API_CONFIG.retryAttempts})`, {
        status: axiosError.response?.status,
        message: axiosError.message,
      });

      await delay(API_CONFIG.retryDelay * Math.pow(2, retryCount)); // 지수 백오프
      return executeWithRetry(requestFn, retryCount + 1);
    }

    throw error;
  }
};

/**
 * Axios 인스턴스 생성
 */
export const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

/**
 * Request 인터셉터
 */
axiosInstance.interceptors.request.use(
  async (config: CustomAxiosRequestConfig) => {
    // 인증이 필요한 엔드포인트인지 확인
    const authEndpoints = ['/auth/login/', '/auth/signup/', '/auth/password/reset/'];
    const isAuthEndpoint = authEndpoints.some((endpoint) => config.url?.includes(endpoint));

    // 인증 엔드포인트가 아닌 경우에만 토큰 추가
    if (!isAuthEndpoint) {
      const token = await getValidAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // 요청 로깅
    logger.info('Request initiated', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
    });

    // 요청 시간 기록
    config.metadata = { startTime: Date.now() };

    return config;
  },
  (error: AxiosError) => {
    logger.error('Request interceptor error', error);
    return Promise.reject(error);
  },
);

/**
 * Response 인터셉터
 */
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // 응답 시간 계산
    const config = response.config as CustomAxiosRequestConfig;
    const startTime = config.metadata?.startTime;
    const duration = startTime ? Date.now() - startTime : 0;

    // 응답 로깅
    logger.info('Request completed', {
      status: response.status,
      duration: `${duration}ms`,
      url: response.config.url,
    });

    return response;
  },
  async (error: AxiosError) => {
    const config = error.config as CustomAxiosRequestConfig;
    const startTime = config?.metadata?.startTime;
    const duration = startTime ? Date.now() - startTime : 0;

    // 에러 로깅
    logger.error('Request failed', {
      status: error.response?.status,
      message: error.message,
      duration: `${duration}ms`,
      url: error.config?.url,
    });

    // 401 에러 처리 - 토큰 정리 및 로그인 페이지 리다이렉트
    if (error.response?.status === 401) {
      clearTokens();
      logger.warn('Authentication failed, redirecting to login');

      // 현재 페이지가 로그인 페이지가 아닌 경우에만 리다이렉트
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    // 403 에러 처리 - 권한 없음
    if (error.response?.status === 403) {
      logger.warn('Access forbidden', {
        url: error.config?.url,
        message: error.message,
      });
    }

    // 429 에러 처리 - 요청 한도 초과
    if (error.response?.status === 429) {
      logger.warn('Rate limit exceeded', {
        url: error.config?.url,
        retryAfter: error.response.headers['retry-after'],
      });
    }

    return Promise.reject(error);
  },
);

/**
 * API 클라이언트 래퍼 함수들
 */
export const apiClient = {
  /**
   * GET 요청
   */
  get: <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    executeWithRetry(() => axiosInstance.get<T>(url, config)),

  /**
   * POST 요청
   */
  post: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> => executeWithRetry(() => axiosInstance.post<T>(url, data, config)),

  /**
   * PUT 요청
   */
  put: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> => executeWithRetry(() => axiosInstance.put<T>(url, data, config)),

  /**
   * PATCH 요청
   */
  patch: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> => executeWithRetry(() => axiosInstance.patch<T>(url, data, config)),

  /**
   * DELETE 요청
   */
  delete: <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    executeWithRetry(() => axiosInstance.delete<T>(url, config)),

  /**
   * 원본 axios 인스턴스 접근 (고급 사용)
   */
  instance: axiosInstance,
};

/**
 * 에러 처리 유틸리티
 */
export const handleApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    const errorData = axiosError.response?.data as ApiErrorResponse | undefined;

    return {
      message: errorData?.message || axiosError.message || 'Unknown error occurred',
      code: errorData?.code || axiosError.code,
      status: axiosError.response?.status,
      details: errorData?.details,
    };
  }

  return {
    message: error instanceof Error ? error.message : 'Unknown error occurred',
  };
};

/**
 * 기본 내보내기 (하위 호환성을 위해 유지)
 * @deprecated Use named exports instead
 */
export default apiClient;
