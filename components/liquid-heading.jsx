'use client';

import { useEffect, useRef, useState } from 'react';
import { headingColor } from './liquid-heading-colors';

export default function LiquidHeading({ id, children }) {
  const root=useRef(null);
  const [ready,setReady]=useState(false);
  useEffect(()=>{
    const host=root.current;
    const desktop=matchMedia('(min-width:1280px) and (hover:hover) and (pointer:fine)');
    let viewer=null,observer=null,generation=0,disposed=false,loading=false;
    function setup(){
      const current=++generation;
      observer?.disconnect();viewer?.dispose();viewer=null;loading=false;setReady(false);
      if(!desktop.matches)return;
      observer=new IntersectionObserver(async entries=>{
        if(!entries[0].isIntersecting||loading)return;
        loading=true;
        try{
          const {createHeadingViewer}=await import('./liquid-heading-viewer');
          if(disposed||current!==generation)return;
          viewer=createHeadingViewer(host,id,loaded=>{if(!disposed&&current===generation)setReady(loaded);});
        }catch{ /* The original text stays visible if WebGL is unavailable. */ }
      },{rootMargin:'250px 0px'});
      observer.observe(host);
    }
    setup();desktop.addEventListener('change',setup);
    return()=>{disposed=true;generation++;observer?.disconnect();viewer?.dispose();desktop.removeEventListener('change',setup);};
  },[id]);
  return <em ref={root} className="liquid-heading" style={{color:headingColor(id)}} data-ready={ready?'true':'false'}><span className="liquid-heading-text">{children}</span></em>;
}
