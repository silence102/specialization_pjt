import { Outlet } from 'react-router-dom';
import { Layout } from '@/shared/components/Layout';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import { useTokenRefresh } from '@/auth/hooks/useTokenRefresh';

function App() {
  // 토큰 자동 갱신 활성화
  useTokenRefresh();

  return (
    <ErrorBoundary>
      <Layout>
        <Outlet />
      </Layout>
    </ErrorBoundary>
  );
}

export { App };
