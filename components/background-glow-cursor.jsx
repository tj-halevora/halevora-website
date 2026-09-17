"use client";

import dynamic from 'next/dynamic';
import { useSyncExternalStore } from 'react';

const GlowCursor = dynamic(() => import('./GlowCursor'), { ssr: false });
const query = '(min-width: 1280px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)';
function subscribe(callback) {
  const media = window.matchMedia(query);
  media.addEventListener('change', callback);
  return () => media.removeEventListener('change', callback);
}
function getSnapshot() { return window.matchMedia(query).matches; }

export default function BackgroundGlowCursor() {
  const enabled = useSyncExternalStore(subscribe, getSnapshot, () => false);
  if (!enabled) return null;
  return <GlowCursor className="background-glow-cursor" aria-hidden="true"
    color="#A995C9" secondaryColor="#8B5CC0" hotspot={0} blendMode="normal" maxDevicePixelRatio={1}
    trailLength={40} idleFade idleTimeout={700} fadeDuration={900} />;
}
