'use client';

import { useEffect, useRef } from 'react';

export default function ServiceCardMotion({ children, columns = 3, className = 'services-core' }) {
  const root = useRef(null);
  useEffect(() => {
    const query = window.matchMedia('(min-width: 1280px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    let observer;
    let cleanups = [];
    const cards = Array.from(root.current.children);
    const reset = () => {
      observer?.disconnect();
      cleanups.forEach(cleanup => cleanup());
      cleanups = [];
      cards.forEach(card => { delete card.dataset.enter; card.style.removeProperty('--enter-delay'); });
    };
    const setup = () => {
      reset();
      if (!query.matches) return;
      cards.forEach((card, index) => {
        card.style.setProperty('--enter-delay', `${(index % columns) * 110}ms`);
        card.dataset.enter = 'waiting';
        const replay = () => {
          if (card.dataset.enter !== 'visible') return;
          if (card.querySelector('.liquid-service-icon[data-ready="true"]')) return;
          const animations = card.querySelector('svg').getAnimations({ subtree: true });
          if (animations.some(animation => animation.playState === 'running')) return;
          animations.forEach(animation => { animation.currentTime = 0; animation.play(); });
        };
        card.addEventListener('pointerenter', replay);
        cleanups.push(() => card.removeEventListener('pointerenter', replay));
      });
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.dataset.enter = 'visible';
          observer.unobserve(entry.target);
        });
      }, { rootMargin: '0px 0px -6% 0px', threshold: .08 });
      cards.forEach(card => observer.observe(card));
    };
    setup();
    query.addEventListener('change', setup);
    return () => { reset(); query.removeEventListener('change', setup); };
  }, [columns]);
  return <div ref={root} className={className}>{children}</div>;
}
