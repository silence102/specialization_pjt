import { Link } from 'react-router-dom';
import { ONBOARDING_TEXT } from '@/onboarding/constants/ONBOARDING_TEXT';
import { Button } from '@/shared/components/ui/button';

export function Hero() {
  return (
    <section aria-label={ONBOARDING_TEXT.LABEL} className="relative z-10">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 text-center">
        <div className="overflow-hidden">
          <h1 className="gradient-text text-glow animate-fadeup text-[clamp(40px,9vw,132px)] font-extrabold leading-[0.95] tracking-tight">
            Don&apos;t Care 돈케어
            <span className="relative mx-auto block h-[2px] w-1/3 overflow-hidden">
              <span
                aria-hidden
                className="absolute inset-y-0 -left-1/3 w-1/3 animate-shine bg-white/60 blur-sm"
              />
            </span>
          </h1>
        </div>

        <p className="mt-5 animate-fadeup text-base text-white/80 sm:text-xl">
          당신을 위한 주식 투자 비서
        </p>

        <div className="mt-10">
          <Button
            asChild
            className="btn-cta-primary h-12 rounded-full px-8 text-base sm:h-14 sm:px-10 sm:text-lg"
          >
            <Link to="/login" aria-label="시작하기">
              시작하기
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
