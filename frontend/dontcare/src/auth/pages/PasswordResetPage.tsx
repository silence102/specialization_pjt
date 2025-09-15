import { PasswordResetForm } from '@/auth/components/reset_password/PasswordResetForm';
import { AuthBackground } from '@/shared/components/AuthBackground';

export const PasswordResetPage = () => {
  return (
    <main className="relative h-screen overflow-hidden bg-black text-white">
      <div className="relative isolate h-full">
        <AuthBackground />
        <div className="relative z-10 flex h-full items-center justify-center p-6">
          <PasswordResetForm />
        </div>
      </div>
    </main>
  );
};
