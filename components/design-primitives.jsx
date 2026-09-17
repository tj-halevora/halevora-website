'use client';
import { useEffect, useRef } from 'react';

export function Count({ value, suffix = '', className = '' }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current, reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      if (reduced.matches) return;
      const start = performance.now();
      const draw = now => {
        const progress = Math.min((now - start) / 1500, 1);
        el.textContent = Math.round(value * (1 - Math.pow(1 - progress, 4))).toLocaleString('en-US');
        if (progress < 1 && !reduced.matches) frame = requestAnimationFrame(draw);
        else el.textContent = value.toLocaleString('en-US');
      };
      frame = requestAnimationFrame(draw);
    }, { threshold: .5 });
    observer.observe(el);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, [value]);
  return <span className={'h-count ' + className} aria-label={value.toLocaleString('en-US') + suffix}><span ref={ref} aria-hidden="true">{value.toLocaleString('en-US')}</span><span aria-hidden="true">{suffix}</span></span>;
}

export function MotionController() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointer = window.matchMedia('(min-width: 1280px) and (hover: hover) and (pointer: fine)');
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      entry.target.dataset.inView = String(entry.isIntersecting);
      if (entry.isIntersecting) entry.target.dataset.revealed = 'true';
    }), { threshold: .08, rootMargin: '40px 0px' });
    document.querySelectorAll('.motion-zone').forEach(el => observer.observe(el));
    document.querySelectorAll('[data-reveal]').forEach(el => {
      if (!reduced.matches && el.getBoundingClientRect().top > window.innerHeight) el.dataset.armed = 'true';
      observer.observe(el);
    });
    let frame = 0, card = null, x = 0, y = 0;
    const move = event => {
      if (reduced.matches || !pointer.matches) return;
      const target = event.target.closest?.('[data-spotlight]');
      if (!target) return;
      card = target; x = event.clientX; y = event.clientY;
      if (!frame) frame = requestAnimationFrame(() => {
        const box = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', (x - box.left) + 'px');
        card.style.setProperty('--mouse-y', (y - box.top) + 'px');
        frame = 0;
      });
    };
    const visibility = () => document.documentElement.classList.toggle('h-page-hidden', document.hidden);
    document.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('visibilitychange', visibility);
    return () => {
      observer.disconnect(); cancelAnimationFrame(frame);
      document.removeEventListener('pointermove', move); document.removeEventListener('visibilitychange', visibility);
      document.documentElement.classList.remove('h-page-hidden');
    };
  }, []);
  return null;
}
