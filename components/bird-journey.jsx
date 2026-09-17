'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
const clamp = n => Math.max(0, Math.min(1, n));
const smooth = n => { n = clamp(n); return n * n * (3 - 2 * n); };
const mix = (a, b, t) => a + (b - a) * t;
function curve(a, b, c, d, t) {
  const k = 1 - t;
  return { x: k*k*k*a.x+3*k*k*t*b.x+3*k*t*t*c.x+t*t*t*d.x, y:k*k*k*a.y+3*k*k*t*b.y+3*k*t*t*c.y+t*t*t*d.y };
}

// Deterministic Voronoi cells give the wordmark irregular, adjoining fracture edges.
function fractureCells() {
  const noise = n => { const v = Math.sin(n * 127.1 + 31.7) * 43758.5453; return v - Math.floor(v); };
  const seeds = Array.from({length:36}, (_,i) => ({x:((i%12)+.2+noise(i)*.6)/12*6,y:(Math.floor(i/12)+.2+noise(i+40)*.6)/3}));
  return seeds.map((seed,i) => {
    let polygon = [{x:0,y:0},{x:6,y:0},{x:6,y:1},{x:0,y:1}];
    seeds.forEach((other,j) => {
      if(i===j)return;
      const nx=other.x-seed.x, ny=other.y-seed.y;
      const limit=(other.x*other.x+other.y*other.y-seed.x*seed.x-seed.y*seed.y)/2;
      const next=[];
      polygon.forEach((a,k) => {
        const b=polygon[(k+1)%polygon.length], da=a.x*nx+a.y*ny-limit, db=b.x*nx+b.y*ny-limit;
        if(da<=0)next.push(a);
        if((da<=0)!==(db<=0)){const t=da/(da-db);next.push({x:mix(a.x,b.x,t),y:mix(a.y,b.y,t)});}
      });
      polygon=next;
    });
    return {x:seed.x/6,y:seed.y,variation:noise(i+80),clip:`polygon(${polygon.map(p=>`${p.x/6*100}% ${p.y*100}%`).join(',')})`};
  });
}

export default function BirdJourney() {
  const root = useRef(null);
  const bird = useRef(null);
  const canvas = useRef(null);
  const reverseCanvas = useRef(null);
  const fragments = useRef(null);
  const halo = useRef(null);

  useEffect(() => {
    const media=gsap.matchMedia();
    // Prepare immediately so the entrance timeline can reveal bird and title together.
      media.add('(min-width:1280px) and (hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)',()=>{
        const hero=document.querySelector('.h-hero'), title=document.querySelector('#hero-title');
        const headings=['about-title','services-title','platform-network-title','impact-title','distribution-title','paid-title','approach-title'].map(id=>document.getElementById(id)).filter(Boolean);
        if(!hero||!title||!headings.length)return;
        let wingTimer=0, wingTime=0, lastWingTime=0;
        let flightRaf=0, flightTime=0, flightPose=null, flightTarget=null;
        let candidate=null,previousHeroProgress=0,impactAnimation=null,navigationFrame=0;
        let lastScrollTime=performance.now(),lastScrollY=scrollY,scrollGate=null,navigationJump=Boolean(location.hash);
        const nudge={x:0,rotation:0};
        const house=document.getElementById('creator-house'),headerLogo=document.querySelector('.header-logo');
        const contactWord=document.querySelector('#contact-title .liquid-heading');
        const contactWave=contactWord?.dataset.letterWave;
        if(contactWord)contactWord.dataset.letterWave='1';
        let dockStart=0,dockEnd=0,dockPoint=null,docking=false;
        const sectionPins=new Map();
        const reactions=new Map();
        const recipes={
          'about-title':{taps:1,color:'#70d8ff',kind:'sweep'},
          'services-title':{taps:2,color:'#ffe199',kind:'pulse'},
          'platform-network-title':{taps:1,color:'#ff8fb9',kind:'ripple'},
          'distribution-title':{taps:1,color:'#a6edff',kind:'sweep'},
          'paid-title':{taps:1,color:'#ffdf8a',kind:'bloom'},
          'approach-title':{taps:3,color:'#83ffd0',kind:'build'},
        };
        for(const heading of headings){
          const word=heading.querySelector('.liquid-heading'),recipe=recipes[heading.id];
          if(!word||!recipe)continue;
          const glow=document.createElement('span');glow.className='bird-word-reaction';
          glow.setAttribute('aria-hidden','true');glow.textContent=word.querySelector('.liquid-heading-text').textContent;
          glow.style.setProperty('--reaction-color',recipe.color);word.appendChild(glow);
          reactions.set(heading.id,{word,glow,...recipe,state:'waiting',elapsed:0,last:0});
        }
        let active=true, raf=0, frames=[], frameIndex=-1, pinEnd=0, origin, stops=[], journeyEnd=0, titleBox;
        const layer=root.current, sprite=bird.current, shards=fragments.current, ring=halo.current;
        const ctx=canvas.current.getContext('2d'), reverseCtx=reverseCanvas.current.getContext('2d');
        const originalVisibility=title.style.visibility;
        const pieces=[];
        // Clipped copies preserve the exact existing wordmark rather than generating text.
        const cells=fractureCells();
        for(const cell of cells){
          const piece=document.createElement('div');piece.className='bird-wordmark-piece';
          const copy=title.cloneNode(true);copy.removeAttribute('id');copy.removeAttribute('data-hero-reveal');copy.removeAttribute('aria-label');
          copy.style.cssText='margin:0;transform:none;opacity:1;visibility:visible;display:flex;align-items:center;justify-content:center;white-space:nowrap';piece.appendChild(copy);
          piece.style.clipPath=cell.clip;
          piece.style.transformOrigin=`${cell.x*100}% ${cell.y*100}%`;
          shards.appendChild(piece);pieces.push(piece);
        }
        const heroScrollSpan=()=>innerHeight*1.8;
        const heroContact=.50;
        const pin=ScrollTrigger.create({refreshPriority:100,trigger:hero,start:'top top',end:()=>`+=${heroScrollSpan()*heroContact}`,pin:true,pinSpacing:true,invalidateOnRefresh:true,onUpdate:()=>schedule()});
        headings.forEach((heading,index)=>{
          if(!reactions.has(heading.id))return;
          const section=heading.closest('section');
          section.classList.add('bird-presentation-section');
          sectionPins.set(heading.id,ScrollTrigger.create({
            id:`bird-stop-${heading.id}`,trigger:section,pin:section,pinSpacing:true,
            start:()=>`top ${document.querySelector('.site-header')?.getBoundingClientRect().height||76}px`,end:'+=32',
            refreshPriority:90-index,invalidateOnRefresh:true,onUpdate:schedule,
          }));
        });
        function pageTop(el){let y=0;for(let p=el;p;p=p.offsetParent)y+=p.offsetTop;return y;}
        function measure(){
          pinEnd=pin.end;
          const rect=title.getBoundingClientRect(), h=title.querySelector('img').getBoundingClientRect();
          titleBox={left:rect.left,top:pageTop(title),width:rect.width,height:rect.height};
          origin={x:h.left-115,y:pageTop(title)+rect.height*.44};
          stops=headings.map((heading,index)=>{
            const word=heading.querySelector('.liquid-heading')||heading;
            const range=document.createRange();range.selectNodeContents(word);
            const bounds=range.getBoundingClientRect();
            const right=index%2===0;
            const sideSpace=right?innerWidth-bounds.right:bounds.left;
            const scale=Math.min(.78,Math.max(.48,sideSpace/150));
            const margin=88*scale/.78;
            const x=Math.max(margin,Math.min(innerWidth-margin,right?bounds.right+margin:bounds.left-margin));
            const hold=sectionPins.get(heading.id);
            const offset=hold?Math.max(0,Math.min(scrollY-hold.start,hold.end-hold.start)):0;
            const y=word.getBoundingClientRect().top+scrollY-offset+word.offsetHeight*.43;
            const arrival=hold?hold.start:Math.max(pinEnd+innerHeight*.5,y-innerHeight*.40);
            const release=hold?hold.end:arrival;
            return {id:heading.id,x,y,scale,facing:right?-1:1,arrival,release,hold};
          });
          if(scrollGate){const stop=stops.find(s=>s.id===scrollGate.id);if(stop){scrollGate.y=Math.round(stop.arrival)+1;window.scrollTo({top:scrollGate.y,behavior:'instant'});lastScrollY=scrollGate.y;}}
          const lastSection=headings.at(-1).closest('section');
          journeyEnd=stops.at(-1).release+lastSection.offsetHeight-innerHeight*.35;
          const houseTop=house?pageTop(house):journeyEnd;
          dockStart=Math.max(stops.at(-1).release+32,houseTop-innerHeight*.85);
          dockEnd=dockStart+innerHeight*.55;
          const logoBounds=headerLogo?.getBoundingClientRect();
          dockPoint={x:logoBounds?logoBounds.left+logoBounds.width/2:innerWidth/2,y:logoBounds?logoBounds.top+logoBounds.height/2:38};
          const style=getComputedStyle(title);
          pieces.forEach(piece=>{piece.style.width=`${rect.width}px`;piece.style.height=`${rect.height}px`;piece.firstChild.style.font=`${style.fontWeight} ${style.fontSize}/${style.lineHeight} ${style.fontFamily}`;piece.firstChild.style.letterSpacing=style.letterSpacing;piece.firstChild.style.color=style.color;});
          schedule();
        }
        function drawFrame(index){
          index=Math.round(index);if(index===frameIndex||!frames[index])return;
          frameIndex=index;ctx.clearRect(0,0,512,512);ctx.drawImage(frames[index],0,0,512,512);reverseCtx.clearRect(0,0,512,512);reverseCtx.drawImage(frames[index],0,0,512,512);sprite.dataset.frames='true';sprite.dataset.wingFrame=String(index);
        }
        function showImpact(x,y){
          impactAnimation?.cancel();
          ring.style.left=`${x}px`;ring.style.top=`${y}px`;
          impactAnimation=ring.animate([
            {opacity:0,transform:'translate(-50%,-50%) scale(.15)'},
            {opacity:1,transform:'translate(-50%,-50%) scale(.4)',offset:.12},
            {opacity:.95,transform:'translate(-50%,-50%) scale(1)',offset:.55},
            {opacity:0,transform:'translate(-50%,-50%) scale(1.8)'},
          ],{duration:700,easing:'cubic-bezier(.16,1,.3,1)'});
        }
        function update(){
          raf=0;if(!active||!origin)return;
          enforceGate(scrollY);
          const y=scrollY,p=Math.max(0,(y-pin.start)/heroScrollSpan());
          const size=Math.min(250,innerWidth*.17);
          let point={...origin}, rotation=0, scale=1, facing=1;
          // Two pecks with a full recoil between them; second contact releases the hero.
          const peckStart=p<.38?.08:.38;
          const peck=clamp((p-peckStart)/.24);
          const contact=Math.pow(Math.sin(peck*Math.PI),2);
          point.x+=contact*25;rotation=contact*5;
          if(!navigationJump&&p>previousHeroProgress&&[.20,heroContact].some(hit=>previousHeroProgress<hit&&p>=hit)){
            const mark=title.querySelector('img').getBoundingClientRect();
            showImpact(mark.left,mark.top+mark.height*.44);
          }
          previousHeroProgress=p;
          const burst=clamp((p-heroContact)/.65);
          title.style.visibility=burst>0?'hidden':originalVisibility;
          const shardsVisible=burst>0&&burst<1;
          shards.style.display=shardsVisible?'block':'none';
          if(shardsVisible){
          shards.style.opacity='1';
          shards.style.transform=`translate3d(${titleBox.left}px,${titleBox.top-Math.max(0,y-pinEnd)}px,0)`;
          pieces.forEach((piece,i)=>{
            const cell=cells[i];
            // Fracture travels from the H across the word before gravity takes over.
            const age=clamp((burst-cell.x*.24)/.76), v=cell.variation;
            const dx=age*(35+cell.x*140+(v-.5)*100);
            const dy=age*((cell.y-.5)*180-65-v*70)+age*age*(240+v*160);
            piece.style.opacity=String(1-smooth((age-.60)/.40));
            piece.style.transform=`perspective(900px) translate3d(${dx}px,${dy}px,${age*(v-.5)*180}px) rotateX(${age*(v-.5)*260}deg) rotateY(${age*(.5-cell.x)*180}deg) rotateZ(${age*(v-.5)*130}deg)`;
          });
          }
          let stopId='hero';
          if(y>pinEnd){
            // Each main heading is a landing point, in document order.
            // Between headings keep the bird in view, then arc gently to the next title.
            const screenY=stop=>{const offset=stop.hold?Math.max(0,Math.min(y-stop.arrival,stop.release-stop.arrival)):0;return Math.max(innerHeight*.16,Math.min(innerHeight*.78,stop.y+offset-y));};
            let previous={x:origin.x+25,y:origin.y+pinEnd,scale:1,facing:1,arrival:pinEnd,release:pinEnd};
            for(let i=0;i<stops.length;i++){
              const next=stops[i];
              const departure=i===0?pinEnd:Math.max(previous.release+innerHeight*.22,next.arrival-innerHeight*1.45);
              const t=smooth((y-departure)/Math.max(1,next.arrival-departure));
              const from={x:previous.x,y:screenY(previous)},to={x:next.x,y:screenY(next)};
              const bend=Math.min(95,Math.abs(to.x-from.x)*.12);
              point=curve(from,{x:mix(from.x,to.x,.28),y:from.y-bend},{x:mix(from.x,to.x,.72),y:to.y-bend},to,t);
              rotation=Math.sin(t*Math.PI)*(to.x>from.x?8:-8);
              scale=mix(previous.scale,next.scale,t);
              facing=t<.01?previous.facing:t<.88?(to.x>from.x?1:-1):next.facing;
              stopId=next.id;
              if(y<next.release||i===stops.length-1)break;
              previous=next;
            }
          }
          candidate=stops.find(stop=>stop.hold&&y>=stop.arrival&&y<=stop.release)||null;
          applyInteraction();
          docking=y>=dockStart;
          if(docking){
            const last=stops.at(-1),t=smooth((y-dockStart)/(dockEnd-dockStart));
            const from={x:last.x,y:Math.max(innerHeight*.16,Math.min(innerHeight*.78,last.y+(last.release-last.arrival)-dockStart))};
            point=curve(from,{x:from.x,y:from.y-innerHeight*.18},{x:dockPoint.x,y:dockPoint.y+innerHeight*.12},dockPoint,t);
            scale=mix(last.scale,.045,t);rotation=Math.sin(t*Math.PI)*-12;
            facing=dockPoint.x>=from.x?1:-1;stopId='header-logo';
          }
          const visible=true;
          sprite.style.opacity='1';
          layer.dataset.destination=stopId;
          layer.style.visibility=visible?'visible':'hidden';
          sprite.style.width=`${size}px`;sprite.style.height=`${size}px`;
          flightTarget={x:point.x-size/2,y:point.y-size/2,rotation,facing,sy:scale};
          if(y<=pinEnd||!visible||!flightPose){
            cancelAnimationFrame(flightRaf);flightRaf=0;flightTime=0;
            flightPose={...flightTarget};paintFlight();
          }else if(!flightRaf&&!document.hidden){flightRaf=requestAnimationFrame(glide);}

          layer.dataset.phase=y<=pinEnd?(burst>0?'shatter':peck>0?'peck':'hover'):'journey';
          if(visible){startWings();paintFlight();}else stopWings();
        }
        function paintFlight(){
          const pose=flightPose;
          // Blend two full-width views for a brief turn; never squash the bird through scaleX(0).
          sprite.style.setProperty('--bird-right',String(clamp((pose.facing+1)/2)));
          if(docking&&scrollY>=dockEnd){
            const remaining=Math.hypot(pose.x-flightTarget.x,pose.y-flightTarget.y);
            sprite.style.opacity=String(smooth(Math.max(remaining/35,(pose.sy-.045)/.15)));
            if(remaining<.5&&pose.sy<.048){layer.style.visibility='hidden';stopWings();}
          }
          sprite.style.transform=`translate3d(${pose.x+nudge.x}px,${pose.y}px,0) rotate(${pose.rotation+nudge.rotation}deg) scale(${pose.sy})`;
        }
        // Smooth only the flying sprite, keeping the pecks/fracture locked to scroll.
        // Cap travel speed so a large wheel/trackpad gesture cannot fling it across the screen.
        function glide(now){
          flightRaf=0;
          if(!active||document.hidden||layer.style.visibility==='hidden'){flightTime=0;return;}
          const dt=flightTime?Math.min((now-flightTime)/1000,.05):1/60;
          flightTime=now;
          const ease=1-Math.exp(-dt/.24);
          const dx=flightTarget.x-flightPose.x,dy=flightTarget.y-flightPose.y;
          const distance=Math.hypot(dx,dy);
          const step=Math.min(distance*ease,Math.min(680,innerWidth*.45)*dt);
          if(distance){flightPose.x+=dx/distance*step;flightPose.y+=dy/distance*step;}
          flightPose.facing+=(flightTarget.facing-flightPose.facing)*(1-Math.exp(-dt/.07));
          for(const key of ['rotation','sy'])flightPose[key]+= (flightTarget[key]-flightPose[key])*ease;
          const unsettled=distance>.35||Math.abs(flightTarget.rotation-flightPose.rotation)>.1||Math.abs(flightTarget.facing-flightPose.facing)>.002||Math.abs(flightTarget.sy-flightPose.sy)>.002;
          if(!unsettled){flightPose={...flightTarget};flightTime=0;}
          paintFlight();
          if(unsettled)flightRaf=requestAnimationFrame(glide);
        }
        function applyInteraction(){
          nudge.x=0;nudge.rotation=0;
          for(const [id,spec] of reactions){
            const {glow,word}=spec;
            glow.style.opacity='0';word.style.translate='';word.style.scale='';word.style.filter='';word.style.transformOrigin='';
            if(candidate?.id!==id){
              // Unfinished titles cannot be skipped while their presentation gate is active.
              if(spec.state==='done')word.dataset.letterWave='1';else delete word.dataset.letterWave;
              delete word.dataset.letterPlayback;
              continue;
            }
            const now=performance.now();
            word.dataset.letterDirection=candidate.facing===1?'left':'right';
            const settled=flightPose&&flightTarget&&Math.hypot(flightPose.x-flightTarget.x,flightPose.y-flightTarget.y)<5;
            const arrived=scrollGate?.id===id&&now-scrollGate.started>1000;
            // Never leave a title waiting indefinitely for the eased flight to settle.
            if(arrived&&!settled&&flightTarget){flightPose={...flightTarget};paintFlight();}
            const ready=word.dataset.ready==='true'||(scrollGate?.id===id&&now-scrollGate.started>2500);
            if(spec.state==='waiting'&&ready&&(settled||arrived)&&(scrollGate?.id===id||now-lastScrollTime>180)){spec.state='playing';spec.last=now;}
            if(spec.state==='playing'){
              if(!document.hidden)spec.elapsed+=(now-spec.last)/1000;
              spec.last=now;
              const contact=.32,elapsed=spec.elapsed;
              if(!spec.impacted&&elapsed>=contact){
                spec.impacted=true;
                const bounds=word.getBoundingClientRect();
                showImpact(candidate.facing===1?bounds.left:bounds.right,bounds.top+bounds.height*.43);
              }
              const approach=elapsed<contact?smooth((elapsed-.05)/.27):1-smooth((elapsed-contact)/.22);
              nudge.x=candidate.facing*36*approach;nudge.rotation=candidate.facing*6*approach;
              word.dataset.letterWave=elapsed<contact?'-1':String(clamp((elapsed-contact)/1.15));
              if(elapsed>=contact+1.15+.12){spec.state='done';if(scrollGate?.id===id){scrollGate=null;delete layer.dataset.scrollLocked;lastScrollY=scrollY;}}
            }else if(spec.state==='done')word.dataset.letterWave='1';else delete word.dataset.letterWave;
            word.dataset.letterPlayback=spec.state;
            if(spec.state!=='done'&&!document.hidden)schedule();
          }
        }
        function stopWings(){clearTimeout(wingTimer);wingTimer=0;lastWingTime=0;}
        function tickWings(){
          wingTimer=0;
          if(!active||document.hidden||layer.style.visibility==='hidden'||!frames.length){lastWingTime=0;return;}
          const now=performance.now();
          if(lastWingTime)wingTime+=Math.min(100,now-lastWingTime);
          lastWingTime=now;
          // Independent wingbeat, with a reversible endpoint for a seamless loop.
          // Only this small canvas updates; scroll still owns the flight path.
          const cycle=Math.max(1,(frames.length-1)*2);
          const step=Math.floor(wingTime*36/1000)%cycle;
          drawFrame(step<frames.length?step:cycle-step);
          wingTimer=setTimeout(tickWings,1000/24);
        }
        function startWings(){if(!wingTimer&&!document.hidden&&frames.length)tickWings();}
        function visibility(){reactions.forEach(spec=>{spec.last=performance.now();});if(document.hidden){stopWings();cancelAnimationFrame(flightRaf);flightRaf=0;flightTime=0;}else schedule();}
        function beginNavigation(event){
          navigationJump=true;scrollGate=null;delete layer.dataset.scrollLocked;
          lastScrollY=scrollY;lastScrollTime=performance.now();
          reactions.forEach(spec=>{if(spec.state==='playing'){spec.state='done';spec.word.dataset.letterWave='1';}});
          const hash=typeof event==='string'?event:typeof event?.detail==='string'?event.detail:location.hash;
          cancelAnimationFrame(navigationFrame);
          // Let service selection and native hash handlers finish before aligning to the pin.
          navigationFrame=requestAnimationFrame(()=>{navigationFrame=requestAnimationFrame(()=>{
            if(!active)return;
            const target=document.getElementById(hash.startsWith('#service-')?'services':decodeURIComponent(hash.slice(1)));
            if(!target)return;
            ScrollTrigger.refresh();measure();
            const destination=stops.find(stop=>stop.hold&&(stop.hold.trigger===target||target.contains(document.getElementById(stop.id))));
            const targetY=destination?Math.round(destination.arrival)+1:Math.max(0,pageTop(target)-(document.querySelector('.site-header')?.offsetHeight||76));
            lastScrollY=targetY;lastScrollTime=performance.now();
            window.scrollTo({top:targetY,behavior:'instant'});
            if(destination){
              const spec=reactions.get(destination.id);
              spec.state='waiting';spec.elapsed=0;spec.last=0;spec.impacted=false;
              spec.word.dataset.letterWave='-1';
              scrollGate={id:destination.id,y:targetY,started:performance.now()};
              layer.dataset.scrollLocked=destination.id;navigationJump=false;
            }
            schedule();
          });});
          schedule();
        }
        function onNavigationClick(event){
          if(event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
          const link=event.target instanceof Element?event.target.closest('a[href]'):null;
          if(!link||link.hasAttribute('download')||(link.target&&link.target!=='_self'))return;
          const url=new URL(link.href,location.href);
          if(url.origin===location.origin&&url.pathname===location.pathname&&url.search===location.search&&url.hash){
            event.preventDefault();
            if(location.hash!==url.hash)history.pushState(null,'',url.hash);
            beginNavigation(url.hash);
          }
        }
        function resumeScrollGates(){
          if(navigationJump){navigationJump=false;lastScrollY=scrollY;lastScrollTime=performance.now();}
        }
        function enforceGate(requested){
          if(navigationJump||ScrollTrigger.isRefreshing)return false;
          if(!scrollGate&&requested>=lastScrollY){
            // Catch the FIRST unfinished stop even when one gesture crosses several sections.
            const next=stops.find(stop=>stop.hold&&reactions.get(stop.id)?.state!=='done'&&
              ((stop.arrival>=lastScrollY-1&&stop.arrival<=requested)||
               (requested>=stop.arrival&&requested<=stop.release)));
            if(next){scrollGate={id:next.id,y:Math.round(next.arrival)+1,started:performance.now()};layer.dataset.scrollLocked=next.id;}
          }
          if(scrollGate){
            if(Math.abs(scrollY-scrollGate.y)>.5)window.scrollTo({top:scrollGate.y,behavior:'instant'});
            lastScrollY=scrollGate.y;
            return true;
          }
          return false;
        }
        function onWheel(event){
          if(event.ctrlKey)return;
          resumeScrollGates();
          const delta=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?innerHeight:1);
          if(scrollGate||(delta>0&&enforceGate(scrollY+delta))){event.preventDefault();schedule();}
        }
        function onKey(event){
          if(event.ctrlKey||event.metaKey||event.altKey)return;
          if(event.target instanceof Element&&event.target.closest('input,textarea,select,[contenteditable="true"],button'))return;
          if(['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '].includes(event.key)){resumeScrollGates();if(scrollGate)event.preventDefault();}
        }
        function onTouchMove(event){resumeScrollGates();if(scrollGate)event.preventDefault();}
        function onScroll(){
          if(enforceGate(scrollY)){schedule();return;}
          if(Math.abs(scrollY-lastScrollY)>.5){lastScrollTime=performance.now();lastScrollY=scrollY;}
          schedule();
        }
        function schedule(){if(!raf)raf=requestAnimationFrame(update);}
        async function loadFrames(){
          try{
            const response=await fetch('/bird-journey/frames-clean/manifest.json');if(!response.ok)return;
            const manifest=await response.json();const result=new Array(manifest.count);let next=0;
            await Promise.all(Array.from({length:4},async()=>{while(active&&next<manifest.count){const i=next++;const img=new window.Image();img.src=`/bird-journey/frames-clean/${String(i).padStart(3,'0')}.webp`;await img.decode();result[i]=img;}}));
            if(active){frames=result;schedule();}
          }catch{ /* The transparent master remains available if motion frames fail. */ }
        }
        document.addEventListener('click',onNavigationClick,true);
        window.addEventListener('halevora:service',beginNavigation);window.addEventListener('hashchange',beginNavigation);window.addEventListener('popstate',beginNavigation);
        document.addEventListener('visibilitychange',visibility);
        window.addEventListener('wheel',onWheel,{passive:false});
        window.addEventListener('keydown',onKey);window.addEventListener('touchmove',onTouchMove,{passive:false});
        window.addEventListener('scroll',onScroll,{passive:true});ScrollTrigger.addEventListener('refresh',measure);
        // Measure the hero pin before downstream timelines so its spacer is included.
        ScrollTrigger.sort();ScrollTrigger.refresh();measure();loadFrames();if(location.hash)beginNavigation(location.hash);
        return()=>{active=false;cancelAnimationFrame(navigationFrame);impactAnimation?.cancel();if(contactWord){if(contactWave===undefined)delete contactWord.dataset.letterWave;else contactWord.dataset.letterWave=contactWave;}document.removeEventListener('click',onNavigationClick,true);window.removeEventListener('halevora:service',beginNavigation);window.removeEventListener('hashchange',beginNavigation);window.removeEventListener('popstate',beginNavigation);scrollGate=null;delete layer.dataset.scrollLocked;window.removeEventListener('wheel',onWheel);window.removeEventListener('keydown',onKey);window.removeEventListener('touchmove',onTouchMove);sectionPins.forEach(hold=>{hold.trigger.classList.remove('bird-presentation-section');hold.kill();});reactions.forEach(({glow,word})=>{glow.remove();delete word.dataset.letterWave;delete word.dataset.letterPlayback;delete word.dataset.letterDirection;word.style.translate='';word.style.scale='';word.style.filter='';word.style.transformOrigin='';});stopWings();cancelAnimationFrame(flightRaf);document.removeEventListener('visibilitychange',visibility);cancelAnimationFrame(raf);window.removeEventListener('scroll',onScroll);ScrollTrigger.removeEventListener('refresh',measure);pin.kill();title.style.visibility=originalVisibility;shards.replaceChildren();layer.style.visibility='hidden';frames=[];};
      });
    return()=>media.revert();
  },[]);

  return <div ref={root} className="bird-journey-overlay" aria-hidden="true">
    <div ref={fragments} className="bird-wordmark-fragments" />
    <div ref={halo} className="bird-arrival-halo" />
    <div ref={bird} className="bird-journey-sprite">
      <div className="bird-art bird-art-right">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/bird-journey/bird-master.webp" alt="" />
        <canvas ref={canvas} width={512} height={512} />
      </div>
      <div className="bird-art bird-art-left">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/bird-journey/bird-master.webp" alt="" />
        <canvas ref={reverseCanvas} width={512} height={512} />
      </div>
    </div>
  </div>;
}
