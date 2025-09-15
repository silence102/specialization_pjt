import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import '@/index.css';
import { App } from '@/App';
import { HydrateFallback } from '@/shared/components/HydrateFallback';
import { QueryProvider } from '@/shared/components/QueryProvider';
import { RouteErrorBoundary } from '@/shared/components/RouteErrorBoundary';

const router = createBrowserRouter(
  [
    {
      path: '/',
      Component: App,
      HydrateFallback: HydrateFallback,
      children: [
        {
          index: true,
          async lazy() {
            const { OnboardingPage } = await import('@/onboarding/OnboardingPage');
            return { Component: OnboardingPage };
          },
          HydrateFallback: HydrateFallback,
          errorElement: <RouteErrorBoundary />,
        },
        {
          path: '/login',
          async lazy() {
            const { LoginPage } = await import('@/auth/pages/LoginPage');
            return { Component: LoginPage };
          },
          HydrateFallback: HydrateFallback,
          errorElement: <RouteErrorBoundary />,
        },
        {
          path: '/signup',
          async lazy() {
            const { SignupPage } = await import('@/auth/pages/SignupPage');
            return { Component: SignupPage };
          },
          HydrateFallback: HydrateFallback,
          errorElement: <RouteErrorBoundary />,
        },
        {
          path: '/password-reset',
          async lazy() {
            const { PasswordResetPage } = await import('@/auth/pages/PasswordResetPage');
            return { Component: PasswordResetPage };
          },
          HydrateFallback: HydrateFallback,
          errorElement: <RouteErrorBoundary />,
        },
        {
          path: '/home',
          async lazy() {
            const { HomePage } = await import('@/home/HomePage');
            return { Component: HomePage };
          },
          HydrateFallback: HydrateFallback,
          errorElement: <RouteErrorBoundary />,
        },
      ],
    },
  ],
  {
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
