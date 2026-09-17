'use client';

import { useEffect, useRef, useState } from 'react';
import { liquidIconPalette } from './liquid-icon-palette';

export default function LiquidServiceIcon({ index, modelId, className='', children }) {
  const host=useRef(null);
  const viewer=useRef(null);
  const [ready,setReady]=useState(false);
  const [canAnimate,setCanAnimate]=useState(false);
  const icon=modelId==='halevora'?{id:'halevora',label:'Halevora logo',finish:'Violet amethyst metal'}:liquidIconPalette[index];
  useEffect(()=>{
    const element=host.current;
    const desktop=matchMedia('(min-width: 1280px) and (hover: hover) and (pointer: fine)');
    const motion=matchMedia('(prefers-reduced-motion: no-preference)');
    let observer=null,generation=0,loading=false,disposed=false;
    const updateMotion=()=>setCanAnimate(desktop.matches&&motion.matches);
    const setup=()=>{
      const current=++generation;
      observer?.disconnect();viewer.current?.dispose();viewer.current=null;
      loading=false;setReady(false);updateMotion();
      if(!desktop.matches)return;
      observer=new IntersectionObserver(async entries=>{
        if(!entries[0].isIntersecting||loading||viewer.current)return;
        loading=true;
        try{
          const {createIconViewer}=await import('./liquid-icon-viewer');
          if(disposed||current!==generation)return;
          viewer.current=createIconViewer(element,{embedded:true,onStatus:(_message,loaded)=>{
            if(!disposed&&current===generation)setReady(loaded);
          }});
          viewer.current.load(icon.id);
        }catch{
          // Keep the server-rendered illustration visible if WebGL is unavailable.
          if(!disposed&&current===generation)setReady(false);
        }
      },{rootMargin:icon.id==='halevora'?'1100px 0px':'300px 0px',threshold:0});
      observer.observe(element);
    };
    setup();desktop.addEventListener('change',setup);motion.addEventListener('change',updateMotion);
    return()=>{
      disposed=true;generation++;observer?.disconnect();viewer.current?.dispose();viewer.current=null;
      desktop.removeEventListener('change',setup);motion.removeEventListener('change',updateMotion);
    };
  },[icon.id]);
  return <div ref={host} className={`service-illustration liquid-service-icon ${className}`} data-ready={ready?'true':'false'}
    role={ready?(canAnimate?'button':'img'):undefined} tabIndex={ready&&canAnimate?0:undefined}
    aria-label={ready?`${icon.label}, ${icon.finish} 3D model. Drag to rotate.${canAnimate?' Press Enter to melt and reform.':''}`:undefined}
    onKeyDown={event=>{if(ready&&canAnimate&&(event.key==='Enter'||event.key===' ')){event.preventDefault();viewer.current?.play();}}}>
    {children}
  </div>;
}
