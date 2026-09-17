'use client';

import Image from 'next/image';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { offerings } from './service-data';

gsap.registerPlugin(useGSAP, ScrollTrigger);
const platforms = offerings;
const directions = {
  'Meta Ads': [-1, -1],
  Instagram: [0, -1],
  'Phone Farm': [0, -1],
  Snapchat: [1, 0],
  TikTok: [-1, 1],
  Reddit: [0, 1],
  YouTube: [0, 1],
  'Influencer Collaborations': [1, 0],
};
const particles = Array.from({ length: 10 }, (_, copy) => platforms.map((platform, group) => ({
  platform, copy, group,
}))).flat();

export default function NetworkEngine() {
  const stage = useRef(null);
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(min-width: 1280px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      const root = stage.current;
      const machine = root.parentElement;
      const tiles = machine.querySelector('.h-network-tiles');
      const nodes = gsap.utils.toArray('.h-engine-particle', root);
      const cards = Array.from(tiles.children);
      const connectors = machine.querySelector('.h-network-connectors');
      const hub = machine.querySelector('.h-network-hub');
      const output = machine.querySelector('.h-network-output');
      // Hide finished content without changing the icon landing coordinates.
      gsap.set(cards, { autoAlpha: 0 });
      gsap.set([connectors, hub, output], { autoAlpha: 0 });
      gsap.set(connectors, { clipPath: 'inset(0 0 100% 0)' });

      const target = i => {
        const index = offerings.indexOf(particles[i].platform);
        const icon = tiles.children[index].querySelector('img').getBoundingClientRect();
        const origin = root.getBoundingClientRect();
        return { x: icon.left + icon.width / 2 - origin.left, y: icon.top + icon.height / 2 - origin.top };
      };
      const position = i => {
        const p = particles[i];
        const dest = target(i);
        const [dx, dy] = directions[p.platform.name];
        const radius = Math.min(window.innerWidth * .42, 600);
        return { x: dest.x + dx * radius, y: dest.y + dy * radius * .65 };
      };
      const timeline = gsap.timeline({ scrollTrigger: {
        id: 'platform-assembly', trigger: machine, start: 'top 95%',
        toggleActions: 'play none none none', once: true, invalidateOnRefresh: true,
      } });
      nodes.forEach((node, i) => {
        const p = particles[i];
        const at = p.copy * .014 + p.group * .004;
        timeline.fromTo(node, {
          x: () => position(i).x, y: () => position(i).y,
          rotation: 0, scale: .8, opacity: 0,
        }, { opacity: .85, duration: .1 }, at);
        timeline.to(node, {
          x: () => target(i).x, y: () => target(i).y,
          rotation: 0, scale: 1, duration: .42, ease: 'power3.out',
        }, at);
        // Keep landed copies in place until every platform has arrived.
        timeline.to(node, { opacity: 0, duration: .14 }, .56);
      });
      timeline.to(cards, { autoAlpha: 1, duration: .18, ease: 'power2.out' }, .48);
      timeline.to(connectors, { autoAlpha: 1, clipPath: 'inset(0 0 0% 0)', duration: .3, ease: 'none' }, .48);
      timeline.fromTo(hub, { scale: .75 }, { autoAlpha: 1, scale: 1, duration: .2, ease: 'power2.out' }, .48);
      timeline.fromTo(output, { y: 35 }, { autoAlpha: 1, y: 0, duration: .25, ease: 'power2.out' }, .52);
    });
    return () => media.revert();
  }, { scope: stage });

  return <div ref={stage} className="h-engine-particles" aria-hidden="true">{particles.map(({ platform, copy, group }) =>
    <span className="h-engine-particle" key={`${group}-${copy}`}>
      <Image src={platform.icon ? '/about-platforms/' + platform.icon : '/halevora-logo.svg'} alt="" width={48} height={48} unoptimized className={!platform.icon ? 'h-monogram' : ''} />
    </span>
  )}</div>;
}
