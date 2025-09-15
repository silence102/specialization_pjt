export function ServiceIntro() {
  return (
    <section className="relative z-10">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center px-6 pb-12 pt-24 md:min-h-[100dvh]">
        <div className="grid w-full items-center gap-12 lg:grid-cols-2">
          {/* Left: Big statement */}
          <div>
            <span className="inline-flex items-center rounded-full border border-white/15 px-3 py-1 text-xs text-white/80">
              에이전트 소개
            </span>
            <h2 className="text-glow gradient-text mt-4 text-[clamp(28px,4.5vw,56px)] font-semibold leading-tight">
              시장의 노이즈를 정리하고 다음 한 수를 제안합니다.
            </h2>
            <p className="mt-4 max-w-xl text-base text-white/80 sm:text-lg">
              실시간 시그널, 리스크 알림, 포트폴리오 인사이트까지. 복잡한 흐름을 맥락으로 묶어
              당신의 결정을 빠르고 간결하게 만듭니다.
            </p>
          </div>

          {/* Right: Large feature cards */}
          <div className="grid gap-6 sm:grid-cols-2">
            <Card
              title="시그널 에이전트"
              desc="관심 종목의 추세·뉴스·거래대금을 종합하여 타이밍을 포착."
            />
            <Card
              title="리스크 가드"
              desc="급락·변동성 확대를 조기 감지하고 규칙 기반 알림 제공."
            />
            <Card
              title="포트폴리오 코치"
              desc="수익/손실 드라이버를 분석하고 리밸런싱 아이디어 제안."
            />
            <Card title="리서치 요약" desc="긴 리포트와 공시를 한 번에 핵심만 요약." />
          </div>
        </div>
      </div>
    </section>
  );
}

function Card({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-soft-2xl backdrop-blur-md sm:p-7">
      <h3 className="text-lg font-medium text-white">{title}</h3>
      <p className="mt-2 text-sm text-white/75 sm:text-base">{desc}</p>
    </div>
  );
}
