import Image from 'next/image';
import HeroVideo from '@/components/hero-video';
import PlatformMarquee from '@/components/platform-marquee';

export default function Hero() {
  return <section className="h-hero" aria-labelledby="hero-title">
    <HeroVideo />
    <div className="h-wrap h-hero-grid">
      <div className="h-hero-copy">
        
        <div className="hero-mask"><h1 className="h-hero-wordmark" id="hero-title" aria-label="Halevora" data-hero-reveal><Image className="h-hero-initial" src="/halevora-logo.svg" alt="" width={100} height={100} unoptimized /><span aria-hidden="true">ALEVORA</span></h1></div>
        <p className="h-hero-description" data-hero-reveal>Creator representation. Content production. Paid media.</p>
      </div>
    </div>
    <div className="h-wrap h-hero-bottom"><span>Built around your talent.</span><a href="#about">Discover Halevora <span aria-hidden="true">↓</span></a></div>
    <div className="h-platform-strip"><PlatformMarquee showControls={false} /></div>
  </section>;
}
