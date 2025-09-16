export function Legal() {
  const sections = [
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '/#features' },
        { label: 'Pricing', href: '/#pricing' },
        { label: 'Roadmap', href: '/#roadmap' },
        { label: 'Changelog', href: '/#changelog' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '/#about' },
        { label: 'Careers', href: '/#careers' },
        { label: 'Press', href: '/#press' },
        { label: 'Contact', href: '/#contact' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Docs', href: '/#docs' },
        { label: 'API', href: '/#api' },
        { label: 'Community', href: '/#community' },
        { label: 'Status', href: '/#status' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy', href: '/legal/privacy' },
        { label: 'Terms', href: '/legal/terms' },
        { label: 'Security', href: '/legal/security' },
        { label: 'Cookies', href: '/legal/cookies' },
      ],
    },
  ];

  return (
    <footer className="relative z-10">
      <div className="divider-line" />
      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* Top: brand + summary */}
        <div className="mb-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <div className="text-lg font-semibold tracking-tight text-white">Don&apos;t Care</div>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-white/70">
              당신의 주식 투자 비서. 에이전트 기반 인사이트와 자동화를 통해 더 빠르고 스마트한 의사결정을 돕습니다.
            </p>
          </div>
          <div className="flex gap-4 text-sm text-white/80">
            <a className="underline-offset-4 hover:text-white hover:underline" href="/login">Login</a>
            <span className="text-white/30">•</span>
            <a className="underline-offset-4 hover:text-white hover:underline" href="/signup">Sign up</a>
          </div>
        </div>

        {/* Middle: link sections */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-4">
          {sections.map((s) => (
            <div key={s.title}>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/60">
                {s.title}
              </h3>
              <ul className="space-y-2 text-sm">
                {s.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-white/80 underline-offset-4 hover:text-white hover:underline"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom: copyright + socials */}
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/60 sm:flex-row sm:items-center">
          <p>© 2024 Don&apos;t Care. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a className="hover:text-white" href="https://x.com" aria-label="X">X</a>
            <span className="text-white/20">/</span>
            <a className="hover:text-white" href="https://github.com" aria-label="GitHub">GitHub</a>
            <span className="text-white/20">/</span>
            <a className="hover:text-white" href="https://discord.gg" aria-label="Discord">Discord</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
