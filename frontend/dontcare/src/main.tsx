import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, type RouteObject } from 'react-router-dom';
import '@/index.css';
import { App } from '@/App';
import { HydrateFallback } from '@/shared/components/HydrateFallback';
import { QueryProvider } from '@/shared/components/QueryProvider';
import { AppErrorBoundary } from '@/shared/components/AppErrorBoundary';

/**
 * 라우트 생성 로직을 추상화하는 함수
 * lazy loading과 공통 설정을 포함하여 중복을 제거합니다.
 */
function createLazyRoute(
  path: string,
  lazyImport: () => Promise<{ [key: string]: React.ComponentType }>,
): RouteObject {
  return {
    path,
    async lazy() {
      const module = await lazyImport();
      const Component = Object.values(module)[0]; // 첫 번째 export된 컴포넌트 사용
      return { Component };
    },
  };
}

/**
 * 인덱스 라우트 생성 함수
 * index: true를 포함한 라우트를 생성합니다.
 */
function createIndexRoute(
  lazyImport: () => Promise<{ [key: string]: React.ComponentType }>,
): RouteObject {
  return {
    index: true,
    async lazy() {
      const module = await lazyImport();
      const Component = Object.values(module)[0]; // 첫 번째 export된 컴포넌트 사용
      return { Component };
    },
  };
}

const router = createBrowserRouter(
  [
    {
      path: '/',
      Component: App,
      HydrateFallback: HydrateFallback,
      errorElement: <AppErrorBoundary />,
      children: [
        {
          ...createIndexRoute(() => import('@/onboarding/OnboardingPage')),
        },
        {
          ...createLazyRoute('/login', () => import('@/auth/pages/LoginPage')),
        },
        {
          ...createLazyRoute('/signup', () => import('@/auth/pages/SignupPage')),
        },
        {
          ...createLazyRoute('/password-reset', () => import('@/auth/pages/PasswordResetPage')),
        },
        {
          ...createLazyRoute('/home', () => import('@/home/HomePage')),
        },
        {
          ...createLazyRoute('/workbench', () => import('@/workbench/AgentWorkbenchPage')),
        },
        {
          path: '*',
          async lazy() {
            const { NotFoundPage } = await import('@/shared/pages/NotFoundPage');
            return { Component: NotFoundPage };
          },
        },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
    future: {
      v7_partialHydration: true,
    },
  },
);

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find root element');
}
createRoot(rootElement).render(
  <StrictMode>
    <QueryProvider>
      <RouterProvider router={router} />
    </QueryProvider>
  </StrictMode>,
);
