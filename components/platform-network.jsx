'use client';
import LiquidHeading from '@/components/liquid-heading';
import LiquidServiceIcon from '@/components/liquid-service-icon';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { offerings } from '@/components/service-data';
import NetworkEngine from '@/components/network-engine';

export default function PlatformNetwork() {
  const [active, setActive] = useState(0);
  const machine = useRef(null);
  const pauseUntil = useRef(0);
  function selectPlatform(index){
    pauseUntil.current=Date.now()+1800;
    setActive(index);
  }
  useEffect(()=>{
    const tiles=machine.current.querySelector('.h-network-tiles');
    const motion=matchMedia('(min-width:1280px) and (hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)');
    let visible=false,timer;
    function sync(){
      clearInterval(timer);
      if(!visible||document.hidden||!motion.matches)return;
      timer=setInterval(()=>{
        if(Date.now()<pauseUntil.current||tiles.querySelector(':focus-visible'))return;
        // Let the existing platform assembly finish before cycling its final tiles.
        if(Number(getComputedStyle(tiles.firstElementChild).opacity)<.95)return;
        setActive(index=>(index+1)%offerings.length);
      },800);
    }
    const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:.2});
    observer.observe(tiles);
    document.addEventListener('visibilitychange',sync);motion.addEventListener('change',sync);
    return()=>{clearInterval(timer);observer.disconnect();document.removeEventListener('visibilitychange',sync);motion.removeEventListener('change',sync);};
  },[]);
  return <section className="h-section h-platform-network motion-zone" aria-labelledby="platform-network-title">
    <div className="h-wrap">
      <header className="h-section-heading h-heading-center" data-reveal><h2 id="platform-network-title">Every platform.<br /><LiquidHeading id="potential">More potential.</LiquidHeading></h2><p>Halevora coordinates content, account management and distribution across platforms. Each channel has its own role in your publishing and growth plan.</p></header>
      <div ref={machine} className="h-network-machine" data-active={active}>
        <div className="h-network-tiles">{offerings.map((service, index) => <button type="button" key={service.name} className="h-network-tile" aria-pressed={active === index} aria-describedby="network-selection" onClick={() => selectPlatform(index)} onPointerEnter={e => { if (e.pointerType === 'mouse') selectPlatform(index); }} onFocus={() => selectPlatform(index)} data-spotlight>
          <Image src={service.icon ? '/about-platforms/' + service.icon : '/halevora-logo.svg'} alt="" width={52} height={52} unoptimized className={!service.icon ? 'h-monogram' : ''} /><span>{service.name}</span>
        </button>)}</div>
        {[8,4].map(columns=><svg key={columns} className={`h-network-connectors h-network-connectors-${columns}`} viewBox="0 0 800 150" aria-hidden="true">
          {Array.from({length:columns},(_,i)=>{
            const x=(i+.5)*800/columns;
            return <g key={i} className="h-route" data-active={i===active%columns}><path d={`M${x} 0 C${x} 85 400 65 400 145`} /><path className="h-flow-stream" d={`M${x} 0 C${x} 85 400 65 400 145`} style={{animationDelay:-i*.65+'s'}} /></g>;
          })}
        </svg>)}
        <div className="h-network-hub"><LiquidServiceIcon modelId="halevora" className="h-network-logo"><span className="service-icon-fallback h-network-logo-fallback" role="img" aria-label="Halevora" /></LiquidServiceIcon></div>
        <NetworkEngine />
        <div className="h-network-output" id="network-selection"><p className="h-eyebrow">THE HALEVORA RESULT</p><p>Attention that builds your business.</p><span className="h-network-result-copy">Content, distribution and paid media working together to turn discovery into an audience and an audience into commercial opportunity.</span></div>
      </div>
    </div>
  </section>;
}
