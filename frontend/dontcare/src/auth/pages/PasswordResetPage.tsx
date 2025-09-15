import { PasswordResetForm } from '@/auth/components/reset_password/PasswordResetForm';
import { AuthBackground } from '@/shared/components/AuthBackground';

export const PasswordResetPage = () => {
  return (
    <main className="relative h-screen overflow-hidden bg-black text-white">
      <div className="relative isolate h-full">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <AuthBackground />
        </div>
        <div className="relative z-10 flex h-full items-center justify-center p-6">
          <div className="w-full max-w-md">
            <h1 className="sr-only">Reset your password</h1>
            <PasswordResetForm />
          </div>
        </div>
      </div>
    </main>
  );
};
