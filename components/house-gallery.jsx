'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const photos = [
  ['aerial-far.jpg', 'The villa overlooking the coast'],
  ['aerial-plan.jpg', 'Overhead view of the villa, pools and tennis court'],
  ['download.jpg', 'Private bowling alley at the villa'],
  ['download.webp', 'Pool terrace and sun loungers overlooking the sea'],
  ['villa-7-BG0qMESC.webp', 'Open-plan living room at the villa'],
  ['villa-8-cYEjHxC5.webp', 'Living room opening onto the infinity pool and sea'],
  ['villa-9-CzE2dQnV.webp', 'Outdoor pool and garden cinema'],
  ['villa-10-N2P545W8.webp', 'Indoor swimming pool and gym'],
  ['villa-11-CXkr-UJW.webp', 'The villa kitchen and dining area'],
  ['villa-14-BM61C7Rk.webp', 'Outdoor tennis court at the villa'],
  ['villa-13-NUerbuPL.webp', 'Private indoor cinema at the villa'],
];

export default function HouseGallery() {
  const root = useRef(null);
  const video = useRef(null);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(true);

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(min-width: 1280px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      root.current.querySelectorAll('.house-gallery-photo').forEach((panel) => {
        gsap.fromTo(panel.querySelector('.house-gallery-image'), { yPercent: -14 }, {
          yPercent: 14,
          ease: 'none',
          scrollTrigger: {
            trigger: panel,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.65,
            invalidateOnRefresh: true,
          },
        });
      });
    });
    return () => media.revert();
  }, { scope: root });

  useEffect(() => {
    // Start nearby images early while leaving distant gallery images lazy.
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const image = entry.target.querySelector('img');
        if (image) image.loading = 'eager';
        observer.unobserve(entry.target);
      });
    }, { rootMargin: `${window.innerHeight}px 0px` });
    root.current.querySelectorAll('.house-gallery-photo').forEach((panel) => observer.observe(panel));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const player = video.current;
    let active = true;
    let visible = false;
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio >= 0.5;
      if (visible && !paused) {
        player.play().catch((error) => {
          if (!active || !visible || error.name !== 'NotAllowedError') return;
          player.muted = true;
          setMuted(true);
          player.play().catch(() => {});
        });
      } else player.pause();
    }, { threshold: 0.5, rootMargin: "-60px 0px 0px 0px" });
    observer.observe(player);
    return () => { active = false; observer.disconnect(); player.pause(); };
  }, [paused]);

  return (
    <div ref={root} className="house-gallery" aria-label="Explore the creator house">
      <div className="house-gallery-photos">
        {photos.map(([file, alt]) => (
          <figure className="house-gallery-photo" key={file}>
            <div className="house-gallery-image">
              <Image src={`/house/${file}`} alt={alt} fill loading="lazy" decoding="async" sizes="(min-width: 1280px) and (hover: hover) and (pointer: fine) 70vw, 100vw" />
            </div>
          </figure>
        ))}
      </div>
      <div className="house-gallery-tour">
        <button type="button" className="house-tour-playback" data-paused={paused} aria-label={paused ? 'Play house tour' : 'Pause house tour'} onClick={() => {
          const nextPaused = !paused;
          if (nextPaused) video.current.pause();
          else video.current.play().catch(() => {});
          setPaused(nextPaused);
        }}>
        <video ref={video} src="/videos/house-tour.webm" muted={muted} loop playsInline preload="metadata" aria-label="Video tour of the creator house" />
          <span className="house-tour-play-icon" aria-hidden="true">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 4.5v15l12-7.5Z" />
            </svg>
          </span>
        </button>
        <button type="button" className="house-tour-control house-tour-sound" onClick={() => {
          const nextMuted = !muted;
          video.current.muted = nextMuted;
          setMuted(nextMuted);
          if (!paused) video.current.play().catch(() => {});
        }} aria-label={muted ? 'Turn tour sound on' : 'Mute tour sound'}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M11 5 6 9H3v6h3l5 4V5Z" />
            {muted ? <path d="m16 9 5 6m0-6-5 6" /> : <><path d="M15 8a6 6 0 0 1 0 8" /><path d="M18 5a10 10 0 0 1 0 14" /></>}
          </svg>
        </button>
      </div>
    </div>
  );
}
