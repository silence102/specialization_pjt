// import { useNavigate } from 'react-router-dom';
// import { Button } from '@/shared/components/ui/button';

import { Background } from '@/onboarding/components/Background';
import { Hero } from '@/onboarding/components/Hero';
import { ServiceIntro } from '@/onboarding/components/ServiceIntro';
import { UsageGuide } from '@/onboarding/components/UsageGuide';
import { Legal } from '@/onboarding/components/Legal';

export function OnboardingPage() {
  return (
    <main className="relative min-h-screen bg-black text-white">
      <div className="relative isolate">
        <Background />
        <Hero />
        <ServiceIntro />
        <UsageGuide />
        <Legal />
      </div>
    </main>
  );
}
