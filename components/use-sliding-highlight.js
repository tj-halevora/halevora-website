'use client';

import { useEffect, useRef } from 'react';

export default function useSlidingHighlight() {
  const highlight = useRef(null);
  const animation = useRef(null);
  useEffect(() => () => animation.current?.cancel(), []);

  function animateHighlight(event, entering) {
    if (!window.matchMedia('(min-width: 1280px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches) return;
    const box = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width;
    const y = (event.clientY - box.top) / box.height;
    const edges = [
      [x, 'inset(0 100% 0 0)'],
      [1 - x, 'inset(0 0 0 100%)'],
      [y, 'inset(0 0 100% 0)'],
      [1 - y, 'inset(100% 0 0 0)'],
    ];
    const edge = edges.sort((a, b) => a[0] - b[0])[0][1];
    const current = getComputedStyle(highlight.current).clipPath;
    const interrupted = animation.current?.playState === 'running';
    animation.current?.cancel();
    animation.current = highlight.current.animate([
      { clipPath: entering && !interrupted ? edge : current },
      { clipPath: entering ? 'inset(0 0 0 0)' : edge },
    ], { duration: 480, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'forwards' });
  }

  return { highlight, animateHighlight };
}

