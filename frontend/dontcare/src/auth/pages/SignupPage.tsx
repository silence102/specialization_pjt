import { SignupForm } from '@/auth/components/signup/SignupForm';
import { AuthBackground } from '@/shared/components/AuthBackground';

export const SignupPage = () => {
  return (
    <main className="relative h-screen overflow-hidden bg-black text-white">
      <div className="relative isolate h-full">
        <AuthBackground />
        <div className="relative z-10 flex h-full items-center justify-center p-6">
          <SignupForm />
        </div>
      </div>
    </main>
  );
};
