'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(CustomEase, useGSAP);

const desktopMotion =
  '(min-width: 1280px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)';

export default function SiteEntrance() {
  const cover = useRef(null);
  const logoOuter = useRef(null);
  const logoInner = useRef(null);
  useGSAP(() => {
    const media = gsap.matchMedia();
    const ease = CustomEase.create('halevora-entrance', '0.87,0,0.13,1');

    media.add(desktopMotion, () => {
      const blockScroll = (event) => event.preventDefault();
      const options = { passive: false };
      const entrance = cover.current;
      entrance.dataset.scrollLocked = 'true';
      const unlock = () => {
        entrance.dataset.scrollLocked = 'false';
        window.removeEventListener('wheel', blockScroll, options);
        window.removeEventListener('touchmove', blockScroll, options);
      };

      window.addEventListener('wheel', blockScroll, options);
      window.addEventListener('touchmove', blockScroll, options);

      gsap.set(cover.current, { autoAlpha: 1, clipPath: 'inset(0% 0% 0% 0%)' });
      gsap.set(logoOuter.current, { scale: 0.4, opacity: 0 });
      gsap.set(logoInner.current, { scale: 0.3 });
      const heroText = cover.current.closest('main')?.querySelectorAll('[data-hero-reveal]');
      const heroVideo = cover.current.closest('main')?.querySelectorAll('[data-hero-video-reveal]');

      gsap.timeline({
        onComplete: () => { unlock(); },
      })
        .to(logoOuter.current, { scale: 1, opacity: 1, duration: 0.8, ease }, 0)
        .to(logoInner.current, { scale: 1, duration: 1.2, ease }, 0.8)
        .to(cover.current, {
          clipPath: 'inset(0% 100% 0% 0%)', duration: 1.2, ease,
        }, 0.8)
        .call(unlock, [], 1.3)
        .fromTo(heroText, { yPercent: 110, opacity: 0 }, {
          yPercent: 0, opacity: 1, duration: 1, stagger: 0.1,
          ease: CustomEase.create('halevora-text', '0.23,1,0.32,1'),
        }, 1.3)
        .fromTo(document.querySelector('.bird-journey-overlay'), { y: 60, opacity: 0 }, {
          y: 0, opacity: 1, duration: 1, ease: 'halevora-text',
        }, 1.3)
        .fromTo(heroVideo, { xPercent: 40, opacity: 0 }, {
          xPercent: 0, opacity: 1, duration: 1,
          ease: 'halevora-text',
        }, 1.3)
        .set(cover.current, { autoAlpha: 0, pointerEvents: 'none' }, 2);

      return unlock;
    });

    return () => media.revert();
  }, { scope: cover });

  return (
    <>
      <div ref={cover} className="site-entrance" aria-hidden="true">
        <div ref={logoOuter} className="site-entrance__outer">
          <div ref={logoInner} className="site-entrance__inner">
            <span className="site-entrance__logo" />
          </div>
        </div>
      </div>
      <noscript><style>{'.site-entrance { display: none !important; }'}</style></noscript>
    </>
  );
}

