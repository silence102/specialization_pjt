import { ONBOARDING_ASSETS } from '@/onboarding/constants/ONBOARDING_ASSETS';

export function Background() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Dark base with subtle radial glows to mimic reference */}
      <div className="absolute inset-0 bg-black" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_300px_at_18%_22%,rgba(167,139,250,0.16),transparent),radial-gradient(800px_420px_at_82%_28%,rgba(99,102,241,0.12),transparent)]" />
      {/* keep a faint animated aurora for depth */}
      <div className="bg-aurora/30 absolute inset-0 animate-aurora bg-[length:200%_200%]" />

      {/* Concentric arch behind the title */}
      <img
        src={ONBOARDING_ASSETS.BG.ARCH}
        alt=""
        className="pointer-events-none absolute left-1/2 top-[12%] h-[420px] -translate-x-1/2 animate-float-slow opacity-80 sm:h-[500px]"
      />
      {/* Floating accents */}
      <img
        src={ONBOARDING_ASSETS.BG.SHAPE}
        alt=""
        className="pointer-events-none absolute left-[10%] top-[10%] h-10 animate-float-mid opacity-80"
      />
      <img
        src={ONBOARDING_ASSETS.BG.DECO2}
        alt=""
        className="pointer-events-none absolute right-[8%] top-[18%] h-24 -rotate-[12deg] animate-float-fast opacity-90"
      />
      <img
        src={ONBOARDING_ASSETS.BG.DECO3}
        alt=""
        className="pointer-events-none absolute left-[8%] top-[38%] h-10 animate-float-mid opacity-80"
      />
      <img
        src={ONBOARDING_ASSETS.BG.DECO4}
        alt=""
        className="pointer-events-none absolute right-[18%] top-[42%] h-16 -rotate-6 animate-float-slow opacity-80"
      />
      <img
        src={ONBOARDING_ASSETS.BG.DECO1}
        alt=""
        className="pointer-events-none absolute left-[22%] top-[22%] h-20 -rotate-90 animate-float-slow opacity-80"
      />
    </div>
  );
}
