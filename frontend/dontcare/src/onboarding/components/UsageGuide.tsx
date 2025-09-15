export function UsageGuide() {
  return (
    <section className="relative z-10">
      <div className="mx-auto -mt-6 flex min-h-screen max-w-7xl items-center px-6 pb-24 pt-12 supports-[height:100dvh]:min-h-[100dvh] sm:-mt-10">
        <div className="w-full">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-glow gradient-text text-[clamp(24px,3.5vw,44px)] font-semibold">
              이렇게 사용하세요
            </h2>
            <p className="mt-2 text-sm text-white/80 sm:text-base">
              세 가지 단계만으로 개인화된 에이전트 경험을 시작합니다.
            </p>
          </div>

          <ol className="mt-12 grid gap-6 sm:grid-cols-3">
            <Step
              n={1}
              title="관심사 선택"
              desc="관심 섹터·종목을 고르면 맞춤 시그널이 활성화됩니다."
            />
            <Step
              n={2}
              title="알림 받기"
              desc="가격·변동성·뉴스 기준으로 규칙을 정하고 실시간 알림."
            />
            <Step
              n={3}
              title="인사이트 확인"
              desc="요약 리포트와 제안 액션으로 다음 결정을 빠르게."
            />
          </ol>
        </div>
      </div>
    </section>
  );
}

function Step({ n, title, desc }: { n: number; title: string; desc: string }) {
  return (
    <li className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-soft-2xl backdrop-blur-md sm:p-7">
      <div className="flex items-start gap-4">
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-sm text-white/90">
          {n}
        </span>
        <div>
          <p className="text-lg font-medium text-white">{title}</p>
          <p className="mt-1 text-sm text-white/75 sm:text-base">{desc}</p>
        </div>
      </div>
    </li>
  );
}
