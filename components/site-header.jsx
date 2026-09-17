'use client';

import Image from 'next/image';
import useSlidingHighlight from '@/components/use-sliding-highlight';
import ServicesMenu from '@/components/services-menu';
import { useEffect, useRef, useState } from 'react';

const links = [
  ['About', '#about'],
  ['Services', '#services'],
  ['Distribution', '#distribution'],
  ['Creator House', '#creator-house'],
  ['Apply', '#contact'],
];

const cities = [
  ['NYC', 'America/New_York'],
  ['LONDON', 'Europe/London'],
  ['DUBAI', 'Asia/Dubai'],
  ['CAPE TOWN', 'Africa/Johannesburg'],
  ['LA', 'America/Los_Angeles'],
].map(([label, timeZone]) => ({
  label,
  format: new Intl.DateTimeFormat('en-US', {
    timeZone, hour: '2-digit', minute: '2-digit', hour12: true,
  }),
}));

function WorldClock() {
  const [clock, setClock] = useState({ now: null, cityIndex: 0 });

  useEffect(() => {
    const started = Date.now();
    const tick = () => {
      const now = Date.now();
      setClock({ now, cityIndex: Math.floor((now - started) / 6000) % cities.length });
    };
    const first = window.setTimeout(tick, 0);
    const timer = window.setInterval(tick, 1000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(timer);
    };
  }, []);

  const { now, cityIndex } = clock;
  const city = cities[cityIndex];

  return (
    <div className="header-clock" aria-label="World clock">
      <span>{now === null ? '--:-- AM' : city.format.format(now)}</span>
      <span>{city.label}</span>
    </div>
  );
}

function Arrow() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}


function ApplyButton() {
  const { highlight, animateHighlight } = useSlidingHighlight();
  return <a href="#contact" className="header-contact" onPointerEnter={(event) => animateHighlight(event, true)} onPointerLeave={(event) => animateHighlight(event, false)}>
    <span ref={highlight} className="apply-slide" aria-hidden="true" />
    <span className="apply-label">Apply</span><Arrow />
  </a>;
}

function NavigationLink({ label, href, active }) {
  const { highlight, animateHighlight } = useSlidingHighlight();
  return (
    <a href={href} aria-current={active ? 'location' : undefined} onPointerEnter={(event) => animateHighlight(event, true)} onPointerLeave={(event) => animateHighlight(event, false)}>
      <span className="nav-word">
        {label}
        <span ref={highlight} className="nav-highlight" aria-hidden="true">{label}</span>
        <span className="nav-highlight nav-section-highlight" aria-hidden="true">{label}</span>
      </span>
    </a>
  );
}

export default function SiteHeader() {
  const menu = useRef(null);
  const [activeSection, setActiveSection] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 8);
      const headerBottom = document.querySelector('.site-header').getBoundingClientRect().bottom;
      const threshold = headerBottom + (window.innerHeight - headerBottom) * 0.12;
      let current = null;
      for (const [, href] of links) {
        const section = document.querySelector(href);
        if (!section) continue;
        if (section.getBoundingClientRect().top <= threshold && section.getBoundingClientRect().bottom > headerBottom + 80) {
          current = href;
        }
      }
      setActiveSection(current);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  function closeMenu() {
    if (menu.current) menu.current.open = false;
  }

  return (
    <header className="site-header" data-scrolled={scrolled}>
      <div className="header-identity">
        <a href="#top" className="header-logo" aria-label="Halevora home" onClick={closeMenu}>
          <Image src="/halevora-logo.svg?v=9c0a75c949a5" alt="" width={40} height={36} unoptimized />
        </a>
      </div>
      <WorldClock />

      <nav className="header-nav" aria-label="Main navigation">
        <div className="header-links">
          {links.slice(0, -1).map(([label, href]) => label === 'Services' ? <ServicesMenu key={href} active={activeSection === href} /> : <NavigationLink key={href} href={href} label={label} active={activeSection === href} />)}
        </div>
        <ApplyButton />
      </nav>

      <details ref={menu} className="header-mobile" onKeyDown={(event) => {
        if (event.key === 'Escape') {
          closeMenu();
          menu.current?.querySelector('summary')?.focus();
        }
      }}>
        <summary aria-label="Toggle navigation">
          <span className="menu-icon" aria-hidden="true"><i /><i /></span>
        </summary>
        <nav aria-label="Mobile navigation">
          <WorldClock />
          {links.map(([label, href]) => label === 'Services' ? <ServicesMenu key={href} mobile active={activeSection === href} onNavigate={closeMenu} /> : (
            <a key={href} href={href} aria-current={activeSection === href ? 'location' : undefined} onClick={closeMenu}>{label}<Arrow /></a>
          ))}
        </nav>
      </details>
    </header>
  );
}
