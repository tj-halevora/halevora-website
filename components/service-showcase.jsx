'use client';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { serviceId } from '@/components/service-links';
import { offerings } from '@/components/service-data';

export default function ServiceShowcase() {
  const [active, setActive] = useState(0);
  const tabs = useRef([]);
  useEffect(() => {
    let frame;
    const navigate = event => {
      const hash = event?.detail || window.location.hash;
      const index = offerings.findIndex(service => '#' + serviceId(service.name) === hash);
      if (index < 0 && hash !== '#services') return;
      if (index >= 0) setActive(index);
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const target = document.getElementById('services-title');
        if (!target) return;
        const offset = (document.querySelector('.site-header')?.getBoundingClientRect().height || 100) + 28;
        const transform = getComputedStyle(target.parentElement).transform;
        const revealOffset = transform === 'none' ? 0 : new DOMMatrixReadOnly(transform).m42;
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - revealOffset - offset, behavior: 'instant' });
      });
    };
    frame = requestAnimationFrame(() => navigate());
    window.addEventListener('hashchange', navigate); window.addEventListener('popstate', navigate); window.addEventListener('halevora:service', navigate);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('hashchange', navigate); window.removeEventListener('popstate', navigate); window.removeEventListener('halevora:service', navigate); };
  }, []);
  function keys(event, index) {
    let next;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % offerings.length;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index + offerings.length - 1) % offerings.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = offerings.length - 1;
    if (next === undefined) return;
    event.preventDefault(); setActive(next); tabs.current[next]?.focus();
  }
  return <div className="h-service-showcase" data-reveal>
    <div className="h-service-tabs" role="tablist" aria-label="Platforms and services">
      {offerings.map((service, index) => <button key={service.name} ref={el => { tabs.current[index] = el; }} id={'offering-toggle-' + index} type="button" role="tab" aria-selected={active === index} aria-controls={serviceId(service.name)} tabIndex={active === index ? 0 : -1} onKeyDown={event => keys(event, index)} onClick={() => setActive(index)}>
        <span className="h-tab-number">{String(index + 1).padStart(2, '0')}</span><span>{service.name}</span><span className="h-tab-arrow" aria-hidden="true">↗</span>
      </button>)}
    </div>
    <div className="h-service-content">
      {offerings.map((service, index) => <article key={service.name} id={serviceId(service.name)} role="tabpanel" aria-labelledby={'offering-toggle-' + index} hidden={active !== index} tabIndex={0} className="h-service-detail" style={{ '--platform-color': service.color }}>
        <div className="h-service-art" aria-hidden="true"><div className="h-service-art-ring" /><div className="h-service-art-ring h-service-art-ring-two" />
          <Image src={service.icon ? '/about-platforms/' + service.icon : '/halevora-logo.svg'} width={160} height={160} alt="" className={!service.icon ? 'h-monogram' : ''} unoptimized />
          <span className="h-art-index">{String(index + 1).padStart(2, '0')} of 08</span>
        </div>
        <div className="h-service-description"><p className="h-eyebrow">{service.tag}</p><h3>{service.outcome}</h3><p>{service.description}</p>
          <ul>{service.details.map(detail => <li key={detail}>{detail}</li>)}</ul>
          <a href="#contact" className="h-text-link">Let’s talk {service.name === 'Influencer Collaborations' ? 'collaborations' : service.name} <span aria-hidden="true">↗</span></a>
        </div>
      </article>)}
    </div>
  </div>;
}
