'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';

const Silk = dynamic(() => import('@/components/Silk'), { ssr: false });
const motionQuery = '(prefers-reduced-motion: reduce)';

function subscribe(callback) {
  const media = window.matchMedia(motionQuery);
  media.addEventListener('change', callback);
  return () => media.removeEventListener('change', callback);
}

function getSnapshot() {
  return window.matchMedia(motionQuery).matches;
}

export default function SilkBackground({ color = '#F7F5EF', contained = false, onReady }) {
  const reducedMotion = useSyncExternalStore(subscribe, getSnapshot, () => true);
  const [ready, setReady] = useState(false);
  const [running, setRunning] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const handleReady = useCallback(() => {
    setReady(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setRunning(true);
      onReady?.();
    }, 800);
  }, [onReady]);

  return (
    <div
      className={`silk-background pointer-events-none inset-0 ${contained ? 'absolute' : 'fixed'}`}
      aria-hidden="true"
    >
      <div className="silk-live" data-ready={ready}>
      <Silk
        onReady={handleReady}
        speed={reducedMotion || !running ? 0 : 5}
        scale={1}
        color={color}
        noiseIntensity={1.5}
        rotation={0}
      />
      </div>
    </div>
  );
}
