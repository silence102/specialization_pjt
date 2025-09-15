import { Component, type ReactNode, type ErrorInfo } from 'react';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';

/**
 * ErrorBoundary 컴포넌트
 *
 * React 애플리케이션에서 JavaScript 에러를 catch하고 fallback UI를 렌더링하는 컴포넌트입니다.
 *
 * ## 주요 역할
 * - 자식 컴포넌트 트리에서 발생하는 JavaScript 에러를 catch
 * - 에러 발생 시 사용자에게 친화적인 fallback UI 제공
 * - 에러 복구를 위한 "다시 시도" 기능 제공
 * - 개발 환경에서 에러 로깅 및 외부 에러 리포팅 서비스 연동
 *
 * ## 사용 사례
 * - 페이지 레벨에서 전체 애플리케이션 에러 처리
 * - 특정 기능 영역(예: 폼, 차트, 위젯)에서의 에러 격리
 * - API 호출 실패나 데이터 로딩 에러 시 fallback UI 제공
 *
 * ## 주의사항
 * - 이벤트 핸들러, 비동기 코드(setTimeout, Promise), 서버 사이드 렌더링 에러는 catch하지 못함
 * - Error Boundary는 클래스 컴포넌트로만 구현 가능
 * - 성능에 미치는 영향을 고려하여 적절한 위치에 배치
 *
 * ## 사용 예시
 * ```tsx
 * // App.tsx에서 전체 애플리케이션 래핑
 * <ErrorBoundary onError={(error, errorInfo) => console.error('App Error:', error, errorInfo)}>
 *   <App />
 * </ErrorBoundary>
 *
 * // 특정 컴포넌트 래핑
 * <ErrorBoundary fallback={<div>이 기능을 사용할 수 없습니다.</div>}>
 *   <ComplexChart data={chartData} />
 * </ErrorBoundary>
 * ```
 */

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  /** 에러를 catch할 자식 컴포넌트들 */
  children: ReactNode;
  /** 에러 발생 시 표시할 커스텀 fallback UI (기본 에러 UI 대신 사용) */
  fallback?: ReactNode;
  /** 에러 발생 시 호출될 콜백 함수 (에러 리포팅 서비스 연동용) */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

const toError = (e: unknown): Error => (e instanceof Error ? e : new Error(String(e)));

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return { hasError: true, error: toError(error) };
  }

  componentDidCatch(error: unknown, errorInfo: ErrorInfo) {
    const normalized = toError(error);
    // 에러 로깅 (개발 환경에서만)
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', normalized, errorInfo);
    }

    // 외부 에러 리포팅 서비스에 전송 (예: Sentry)
    this.props.onError?.(normalized, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="mx-auto w-full max-w-md" role="alert" aria-live="assertive">
          <CardHeader className="text-center">
            <CardTitle className="text-destructive">오류가 발생했습니다</CardTitle>
            <CardDescription>
              예상치 못한 오류가 발생했습니다. 페이지를 새로고침하거나 다시 시도해주세요.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <Button type="button" onClick={this.handleRetry} className="w-full">
                다시 시도
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}
