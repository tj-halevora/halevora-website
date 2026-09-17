import BackgroundGlowCursor from '@/components/background-glow-cursor';
import SiteHeader from '@/components/site-header';
import SiteEntrance from '@/components/site-entrance';
import Hero from '@/components/hero';
import BirdJourney from '@/components/bird-journey';
import About from '@/components/about';
import Services from '@/components/services';
import Distribution from '@/components/distribution';
import CreatorHouse from '@/components/creator-house';
import ApplyContact from '@/components/apply-contact';
import PlatformNetwork from '@/components/platform-network';
import Reach from '@/components/reach';
import PaidMedia from '@/components/paid-media';
import Approach from '@/components/approach';
import SiteFooter from '@/components/site-footer';
import { MotionController } from '@/components/design-primitives';

export default function Home() {
  return (
    <><main id="top" className="relative min-h-svh" aria-label="Halevora">
      <a href="#hero-title" className="h-skip-link">Skip to content</a>
      <MotionController />
      <BackgroundGlowCursor />
      <SiteHeader />
      <Hero />
      <About />
      <Services />
      <PlatformNetwork />
      <Reach />
      <Distribution />
      <PaidMedia />
      <Approach />
      <CreatorHouse />
      <ApplyContact />
      <SiteFooter />
      <SiteEntrance />
    </main><BirdJourney /></>
  );
}
