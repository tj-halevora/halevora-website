'use client';

import { useEffect, useRef } from 'react';

export default function HeroVideo() {
  const video = useRef(null);
  useEffect(() => {
    const player = video.current;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    const sync = () => {
      if (visible && !document.hidden && !motion.matches) player.play().catch(() => {});
      else player.pause();
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    observer.observe(player);
    motion.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    return () => { observer.disconnect(); motion.removeEventListener('change', sync); document.removeEventListener('visibilitychange', sync); player.pause(); };
  }, []);

  return <div className="h-hero-video">
    <video ref={video} src="/videos/halevora-mountain-background.mp4" poster="/videos/halevora-mountain-poster.jpg" muted loop playsInline preload="auto" aria-label="Halevora Holdings mountain film" />
  </div>;
}
