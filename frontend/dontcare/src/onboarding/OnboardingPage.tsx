// import { useNavigate } from 'react-router-dom';
// import { Button } from '@/shared/components/ui/button';

import { Background } from '@/onboarding/components/Background';
import { Hero } from '@/onboarding/components/Hero';
import { ServiceIntro } from '@/onboarding/components/ServiceIntro';
import { UsageGuide } from '@/onboarding/components/UsageGuide';
import { Legal } from '@/onboarding/components/Legal';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel, Pagination, HashNavigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import './styles/onboarding.css';

export function OnboardingPage() {
  return (
    <main className="onboarding relative min-h-screen bg-black text-white">
      <div className="relative isolate">
        <Background />

        {/* Vertical fullpage swiper */}
        <Swiper
          direction="vertical"
          slidesPerView={1}
          mousewheel={{ forceToAxis: true, releaseOnEdges: false }}
          allowTouchMove={false}
          speed={700}
          pagination={{ clickable: true }}
          hashNavigation={{ watchState: true }}
          modules={[Mousewheel, Pagination, HashNavigation]}
          className="relative z-10 h-dvh"
          preventClicks={false}
          preventClicksPropagation={false}
        >
          <SwiperSlide data-hash="hero">
            <section id="hero" className="flex min-h-dvh items-center justify-center">
              <Hero />
            </section>
          </SwiperSlide>
          <SwiperSlide data-hash="service">
            <section id="service" className="flex min-h-dvh items-center justify-center">
              <ServiceIntro />
            </section>
          </SwiperSlide>
          <SwiperSlide data-hash="usage">
            <section id="usage" className="flex min-h-dvh items-center justify-center">
              <UsageGuide />
            </section>
          </SwiperSlide>
          <SwiperSlide data-hash="legal">
            <section id="legal" className="flex min-h-dvh items-center justify-center">
              <Legal />
            </section>
          </SwiperSlide>
        </Swiper>
      </div>
    </main>
  );
}
