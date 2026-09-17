"use client";

import Image from 'next/image';
import { serviceId } from '@/components/service-links';
import { useEffect, useId, useRef, useState } from 'react';
import { faMeta, faInstagram, faSnapchat, faTiktok, faRedditAlien, faYoutube } from '@fortawesome/free-brands-svg-icons';

const services = [
  ['Meta Ads', 'Paid campaigns', faMeta, '#51b8c6', '#services'],
  ['Instagram', 'Posts, stories & reels', faInstagram, '#ff62c0', '#services'],
  ['Phone Farm', 'Our distribution network', null, '#F0E6FF', '#distribution'],
  ['Snapchat', 'Stories & discovery', faSnapchat, '#e4cd43', '#services'],
  ['TikTok', 'Short-form content', faTiktok, '#51b8c6', '#services'],
  ['Reddit', 'Community & conversations', faRedditAlien, '#ee8056', '#services'],
  ['YouTube', 'Long-form content', faYoutube, '#f27587', '#services'],
  ['Influencer Collaborations', 'Create together', null, '#bca4ff', '#services'],
];

const platformAssets = { 'Meta Ads': 'meta-icon', Instagram: 'instagram-color', TikTok: 'tiktok-icon', YouTube: 'youtube-icon', Reddit: 'reddit-icon' };

function ServiceIcon({ name, icon }) {
  if (name === 'Phone Farm') return <Image src="/about-platforms/phone-pharm.png" alt="" width={38} height={38} unoptimized />;
  if (platformAssets[name]) return <Image src={`/platforms/${platformAssets[name]}.svg`} alt="" width={32} height={32} unoptimized />;
  if (icon) return <svg viewBox={`0 0 ${icon.icon[0]} ${icon.icon[1]}`} fill="currentColor" aria-hidden="true"><path d={icon.icon[4]} /></svg>;
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {name === 'Phone Farm' ? <><rect x="7" y="3" width="10" height="18" rx="2" /><path d="M11 17h2M3 7v10M21 7v10" /></> : name === 'Content House' ? <><path d="m3 11 9-8 9 8M5 10v11h14V10M10 21v-7h4v7" /></> : <><circle cx="8" cy="8" r="3" /><circle cx="17" cy="10" r="2.5" /><path d="M2 21v-3a6 6 0 0 1 12 0v3M16 16a5 5 0 0 1 6 5" /></>}
  </svg>;
}

export default function ServicesMenu({ active, mobile = false, onNavigate }) {
  const [open, setOpen] = useState(false);
  const root = useRef(null);
  const trigger = useRef(null);
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

  const id = useId();
  const closeTimer = useRef(null);
  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  useEffect(() => {
    if (!open) return;
    const dismiss = (event) => {
      if (!root.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', dismiss);
    return () => document.removeEventListener('pointerdown', dismiss);
  }, [open]);

  return <div ref={root} className={`header-services${mobile ? ' header-services-mobile' : ''}`} data-open={open}
    onPointerEnter={(event) => { window.clearTimeout(closeTimer.current); if (!mobile && event.pointerType === 'mouse') setOpen(true); }}
    onPointerLeave={() => { if (!mobile && !root.current?.contains(document.activeElement)) closeTimer.current = window.setTimeout(() => setOpen(false), 140); }}
    onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}
    onKeyDown={(event) => {
      if (event.key === 'Escape' && open) { event.stopPropagation(); setOpen(false); trigger.current?.focus(); }
    }}>
    <button ref={trigger} type="button" className="services-trigger" aria-expanded={open} aria-controls={id} data-active={active} onPointerEnter={(event) => animateHighlight(event, true)} onPointerLeave={(event) => animateHighlight(event, false)} onClick={() => {
      setOpen(false); onNavigate?.();
      if (window.location.hash !== '#services') window.history.pushState(null, '', '#services');
      window.dispatchEvent(new CustomEvent('halevora:service', { detail: '#services' }));
    }}>
      <span className="nav-word">Services<span ref={highlight} className="nav-highlight" aria-hidden="true">Services</span><span className="nav-highlight nav-section-highlight" aria-hidden="true">Services</span></span>
    </button>
    <button type="button" className="services-trigger services-menu-toggle" aria-label="Toggle services menu" aria-expanded={open} aria-controls={id} onClick={event => setOpen(mobile || event.detail === 0 ? !open : true)}><svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.5" /></svg>
    </button>
    <div id={id} className="services-dropdown" inert={!open}>
      <div className="services-dropdown-inner">
        <div className="services-dropdown-grid">
          {services.map(([name, description, icon, color]) => <a className="services-dropdown-item" key={name} href={`#${serviceId(name)}`} style={{ '--service-color': color }} onClick={(event) => {
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            event.preventDefault();
            const hash = `#${serviceId(name)}`;
            if (window.location.hash !== hash) window.history.pushState(null, '', hash);
            setOpen(false); onNavigate?.();
            window.dispatchEvent(new CustomEvent('halevora:service', { detail: `#${serviceId(name)}` }));
          }}>
            <span className="services-dropdown-icon" data-platform={icon || name === 'Phone Farm' ? name : undefined}><ServiceIcon name={name} icon={icon} /></span>
            <span><strong>{name}</strong><small>{description}</small></span>
            <span className="services-dropdown-arrow" aria-hidden="true">↗</span>
          </a>)}
        </div>
      </div>
    </div>
  </div>;
}
