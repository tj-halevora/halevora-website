"use client";

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const sources = [
  '/about-platforms/fb-0ba9f16fc6.png',
  '/about-platforms/google1-c46ad10a7b.png',
  '/about-platforms/ig-f930072298.png',
  '/about-platforms/linked-9eab5fb3d0.png',
  '/about-platforms/meta-0045068805.png',
  '/about-platforms/reddit-412bd214fe.png',
  '/about-platforms/sc-0972fff313.png',
  '/about-platforms/tiktok-1329cebe69.png',
  '/about-platforms/twitch-ebe7f24e27.png',
  '/about-platforms/wa-6bf80e6d45.png',
  '/about-platforms/x-53dcd49f6f.png',
  '/about-platforms/yt-41e7519772.png',
];

export default function AboutImageTrail() {
  const layer = useRef(null);

  useEffect(() => {
    const surface = layer.current;
    const section = surface.closest('section');
    const media = gsap.matchMedia();
    media.add('(min-width: 1280px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      const entries = new Set();
      let previous = null;
      let pointer = null;
      let scrollFrame;
      let distance = 0;
      let index = 0;
      let idle;
      let loaded = false;
      const remove = (entry) => {
        entry.zTo.tween.kill();
        gsap.killTweensOf(entry.img);
        entry.img.remove();
        entries.delete(entry);
      };
      const clear = () => {
        clearTimeout(idle);
        entries.forEach(remove);
        previous = null;
        distance = 0;
      };
      const fade = () => {
        entries.forEach(entry => {
          if (entry.fading) return;
          entry.fading = true;
          gsap.to(entry.img, { opacity: 0, duration: 0.4, onComplete: () => remove(entry) });
        });
        previous = null;
        distance = 0;
      };
      const preload = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting || loaded) return;
        loaded = true;
        sources.forEach(src => { const image = new Image(); image.src = src; });
      }, { rootMargin: '300px' });
      preload.observe(section);
      const update = () => {
        if (!pointer || document.hidden) return;
        const hit = document.elementFromPoint(pointer.x, pointer.y);
        if (!hit || !section.contains(hit)) { clear(); return; }
        const rect = surface.getBoundingClientRect();
        const x = pointer.x - rect.left;
        const y = pointer.y - rect.top;
        clearTimeout(idle);
        idle = setTimeout(fade, 1400);
        const entering = previous === null;
        const delta = entering ? 0 : Math.hypot(x - previous.x, y - previous.y);
        distance += delta;
        previous = { x, y };
        entries.forEach(entry => {
          if (entry.fading) return;
          entry.recession += delta * 0.06 / 45;
          const progress = Math.min(entry.recession, 1);
          entry.zTo(-(progress ** 3) * window.innerWidth * 10);
          if (progress >= 0.98) {
            entry.fading = true;
            gsap.to(entry.img, { opacity: 0, duration: 0.2, onComplete: () => remove(entry) });
          }
        });
        if (!entering && distance < window.innerWidth / 12) return;
        distance = 0;
        if (entries.size >= 24) remove(entries.values().next().value);
        const img = document.createElement('img');
        img.src = sources[index++ % sources.length];
        img.alt = '';
        img.draggable = false;
        surface.appendChild(img);
        gsap.fromTo(img, { x, y, z: 0, xPercent: -50, yPercent: -50, rotation: (Math.random() - 0.5) * 14, scale: 1.3 }, { scale: 1, ease: 'elastic.out(2, 0.6)', duration: 0.6 });
        entries.add({ img, recession: 0, fading: false, zTo: gsap.quickTo(img, 'z', { duration: 1.2, ease: 'power2' }) });
      };
      const move = event => {
        if (event.pointerType !== 'mouse') return;
        pointer = { x: event.clientX, y: event.clientY };
        update();
      };
      const onScroll = () => {
        if (scrollFrame) return;
        scrollFrame = requestAnimationFrame(() => { scrollFrame = 0; update(); });
      };
      const leave = event => { if (!event.relatedTarget) { pointer = null; clear(); } };
      window.addEventListener('pointermove', move, { passive: true });
      document.addEventListener('pointerout', leave);
      window.addEventListener('scroll', onScroll, { passive: true });
      document.addEventListener('visibilitychange', clear);
      return () => {
        clear();
        preload.disconnect();
        cancelAnimationFrame(scrollFrame);
        window.removeEventListener('pointermove', move);
        document.removeEventListener('pointerout', leave);
        window.removeEventListener('scroll', onScroll);
        document.removeEventListener('visibilitychange', clear);
      };
    });
    return () => media.revert();
  }, []);

  return <div ref={layer} className="about-image-trail" aria-hidden="true" />;
}

