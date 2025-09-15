import { LoginForm } from '@/auth/components/login/LoginForm';
import { AuthBackground } from '@/shared/components/AuthBackground';

export function LoginPage() {
  return (
    <main className="relative h-screen overflow-hidden bg-black text-white">
      <div className="relative isolate h-full">
        <AuthBackground />
        <div className="relative z-10 flex h-full items-center justify-center p-6">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
