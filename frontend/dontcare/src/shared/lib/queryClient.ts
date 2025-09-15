import { QueryClient } from '@tanstack/react-query';

/**
 * TanStack Query 클라이언트 설정
 *
 * @description
 * - staleTime: 60초로 설정하여 SSR 환경에서 즉시 refetch 방지
 * - gcTime: 24시간으로 설정하여 캐시 유지 시간 연장
 * - retry: 기본값 3회로 설정
 * - refetchOnWindowFocus: false로 설정하여 윈도우 포커스 시 자동 refetch 비활성화
 */
const defaultOptions = {
  queries: {
    // SSR 환경에서 즉시 refetch 방지
    staleTime: 60 * 1000, // 60초
    // 캐시 유지 시간 (garbage collection time)
    gcTime: 1000 * 60 * 60 * 24, // 24시간
    // 재시도 횟수
    retry: 3,
    // 윈도우 포커스 시 자동 refetch 비활성화
    refetchOnWindowFocus: false,
    // 네트워크 재연결 시 자동 refetch 활성화
    refetchOnReconnect: true,
    // 마운트 시 자동 refetch 활성화
    refetchOnMount: true,
  },
  mutations: {
    // 뮤테이션 재시도 로직 - 500번대 서버 에러에만 재시도
    retry: (failureCount: number, error: unknown) => {
      // Axios 에러인지 확인
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number } };
        const status = axiosError.response?.status;

        // 500번대 서버 에러인 경우에만 재시도 (최대 1회)
        if (status && status >= 500 && status < 600) {
          // 첫 실패 시 failureCount === 1 -> 1회 재시도 허용
          return failureCount < 2; // 1회까지만 재시도
        }
      }

      // 400번대 클라이언트 에러나 기타 에러는 재시도하지 않음
      return false;
    },
  },
} as const;

let browserQueryClient: QueryClient | undefined;

export function createQueryClient() {
  return new QueryClient({ defaultOptions });
}

export function getQueryClient() {
  // 서버에서는 요청마다 새로운 인스턴스 생성
  if (typeof window === 'undefined') return createQueryClient();
  // 브라우저에서는 싱글턴 재사용
  if (!browserQueryClient) browserQueryClient = createQueryClient();
  return browserQueryClient;
}
