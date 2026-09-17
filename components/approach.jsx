'use client';
import LiquidHeading from '@/components/liquid-heading';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const steps = [
  ['01', 'Audit.', 'Understand the starting point.', 'We review your content, audience, channels and goals to see what is working and where there is room to grow.'],
  ['02', 'Architect.', 'Build the plan around you.', 'Your content system, publishing schedule and paid-media approach come together in one clear direction.'],
  ['03', 'Amplify.', 'Put the plan into motion.', 'Production, community management, organic distribution and paid campaigns work together across your platforms.'],
  ['04', 'Scale.', 'Learn. Refine. Go further.', 'We review performance, improve the audience journey and carry what works into the next release.'],
];
export default function Approach() {
  const process = useRef(null);
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(min-width:1280px) and (hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)', () => {
      const root = process.current;
      const rows = Array.from(root.children);
      const timeline = gsap.timeline({scrollTrigger: {
        trigger: root.closest('section'), start: 'top 75%',
        toggleActions: 'play none none none', once: true, invalidateOnRefresh: true,
      }});
      gsap.set(root, { '--process-progress': '0px' });
      timeline.fromTo(rows, { opacity: 0, y: 18 }, {
        opacity: 1, y: 0, duration: .35, stagger: .07, ease: 'power2.out',
      }, 0);
      timeline.to(root, {
        '--process-progress': () => `${rows.at(-1).offsetTop}px`, duration: .56, ease: 'power1.out',
      }, 0);
    });
    return () => media.revert();
  }, { scope: process });
  return <section id="approach" className="h-section h-wrap motion-zone" aria-labelledby="approach-title">
    <header className="h-section-heading" data-reveal><h2 id="approach-title">A clear plan.<br /><LiquidHeading id="momentum">Real momentum.</LiquidHeading></h2><p>Audit the accounts, design the content system, coordinate distribution and refine the funnel. Our four stages connect creative decisions to day-to-day execution.</p></header>
    <div ref={process} className="h-process">{steps.map(([n,title,lead,copy]) => <article className="h-process-step" key={n}><span className="h-process-node" aria-hidden="true" /><span className="h-small-number">{n}</span><h3>{title}</h3><div><h4>{lead}</h4><p>{copy}</p></div></article>)}</div>
  </section>;
}
