'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function CreatorJourney({ children }) {
  const stage = useRef(null);
  const film = useRef(null);

  useEffect(() => {
    const video = film.current;
    const media = gsap.matchMedia();
    media.add('(min-width:1280px) and (hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)', () => {
      let target = 0, frame = 0, active = true;
      video.controls = false;
      video.pause();
      // Coalesce scroll updates and allow only one decoder seek at a time.
      const seek = () => {
        frame = 0;
        if (!active || video.readyState < 1 || video.seeking) return;
        if (Math.abs(video.currentTime - target) > 1 / 30) video.currentTime = target;
      };
      const schedule = () => { if (!frame) frame = requestAnimationFrame(seek); };
      // The source is 24 fps: one frame per roughly 30 pixels of desktop scroll.
      // No eased playhead, so the video cannot coast after scrolling stops.
      const update = progress => {
        const lastFrame = Math.max(0, Math.ceil((video.duration || 5.041667) * 24 - .001) - 1);
        target = Math.floor(progress * lastFrame) / 24;
        schedule();
      };
      const trigger = ScrollTrigger.create({
        id: 'creator-journey',
        trigger: stage.current,
        start: 'top 90px',
        end: () => `+=${Math.max(3600, innerHeight * 3.6)}`,
        pin: true,
        invalidateOnRefresh: true,
        onUpdate: self => update(self.progress),
      });
      const ready = () => update(trigger.progress);
      video.addEventListener('loadedmetadata', ready);
      video.addEventListener('seeked', schedule);
      video.preload = 'auto';
      video.load();
      return () => {
        active = false;
        cancelAnimationFrame(frame);
        trigger.kill();
        video.removeEventListener('loadedmetadata', ready);
        video.removeEventListener('seeked', schedule);
        video.pause();
        video.controls = true;
      };
    });
    return () => media.revert();
  }, []);

  return <div ref={stage} className="h-creator-story">
    <div className="h-creator-cinema">
    <video ref={film} className="h-creator-film" controls muted playsInline preload="none"
      poster="/videos/creator-journey-clean.webp" aria-label="A glass hummingbird guides creator content through representation, production and distribution."
      src="/videos/creator-journey-clean.mp4" />
    </div>
    {children}
  </div>;
}

