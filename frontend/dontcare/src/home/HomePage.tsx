import { useLogout } from '@/auth/hooks/useLogout';
import { Button } from '@/shared/components/ui/button';

export function HomePage() {
  const { logout, isLoading, error } = useLogout();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
      <div className="flex min-h-[calc(100dvh-4rem)] items-center justify-center sm:min-h-[calc(100dvh-6rem)] lg:min-h-[calc(100dvh-8rem)]">
        <div className="w-full max-w-2xl text-center">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">홈페이지</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            온보딩을 완료하고 홈페이지에 도착했습니다!
          </p>

          {/* 로그아웃 버튼 */}
          <div className="mt-8">
            <Button
              onClick={handleLogout}
              disabled={isLoading}
              variant="outline" 
              className="px-6 py-2"
            >
              {isLoading ? '로그아웃 중...' : '로그아웃'}
            </Button>

            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
