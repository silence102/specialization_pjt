import { ONBOARDING_TEXT } from '@/onboarding/constants/ONBOARDING_TEXT';

export function Legal() {
  return (
    <section className="relative z-10">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
          <a
            href={ONBOARDING_TEXT.LEGAL_LINK_HREF}
            className="text-sm text-white/80 underline-offset-4 hover:text-white hover:underline"
          >
            {ONBOARDING_TEXT.LEGAL_LINK_TEXT}
          </a>
          <p className="text-xs text-white/70">{ONBOARDING_TEXT.LEGAL_COPY}</p>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-px bg-white/10" aria-hidden />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-px bg-white/10"
        aria-hidden
      />
    </section>
  );
}
