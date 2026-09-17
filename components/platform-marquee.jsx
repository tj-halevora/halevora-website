'use client';

import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import {
  faInstagram, faTiktok, faYoutube, faSnapchat, faRedditAlien,
  faXTwitter, faFacebook, faMeta, faGoogle, faLinkedin, faTwitch, faWhatsapp,
} from '@fortawesome/free-brands-svg-icons';

gsap.registerPlugin(useGSAP);

const platforms = [
  ['Instagram', faInstagram], ['TikTok', faTiktok], ['YouTube', faYoutube],
  ['Snapchat', faSnapchat], ['Reddit', faRedditAlien], ['X', faXTwitter],
  ['Facebook', faFacebook], ['Meta', faMeta], ['Google', faGoogle],
  ['LinkedIn', faLinkedin], ['Twitch', faTwitch], ['WhatsApp', faWhatsapp],
];

function PlatformGroup({ duplicate = false }) {
  return (
    <ul className={`platform-group${duplicate ? ' platform-group-copy' : ''}`} aria-hidden={duplicate || undefined}>
      {platforms.map(([name, { icon: [width, height, , , path] }]) => (
        <li key={name}>
          <svg viewBox={`0 0 ${width} ${height}`} aria-hidden="true" fill="currentColor">
            {(Array.isArray(path) ? path : [path]).map((d, index) => <path key={index} d={d} />)}
          </svg>
          <span>{name}</span>
        </li>
      ))}
    </ul>
  );
}

export default function PlatformMarquee({ showControls = true }) {
  const root = useRef(null);
  const track = useRef(null);
  const tween = useRef(null);
  const [paused, setPaused] = useState(false);

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(min-width: 1280px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      tween.current = gsap.to(track.current, { xPercent: -50, duration: 42, ease: 'none', repeat: -1 });
      return () => { tween.current = null; };
    });
    return () => media.revert();
  }, { scope: root });

  return (
    <div className="platform-marquee" data-controls={showControls} ref={root} role="region" aria-label="Creator platforms">
      <div className="platform-window" tabIndex={0} aria-label="Platform list; scroll horizontally on touch screens">
        <div className="platform-track" ref={track}>
          <PlatformGroup />
          <PlatformGroup duplicate />
        </div>
      </div>
      {showControls && <button className="platform-pause" type="button" aria-label={paused ? 'Resume platform scrolling' : 'Pause platform scrolling'} onClick={() => {
        tween.current?.paused(!paused);
        setPaused(!paused);
      }}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
          {paused ? <path d="M3 1 11 6 3 11Z" /> : <path d="M2 1h3v10H2zm5 0h3v10H7z" />}
        </svg>
      </button>}
    </div>
  );
}
