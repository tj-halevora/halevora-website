import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { acquireLiquidStudio, releaseLiquidStudio, resizeLiquidRenderer } from './liquid-icon-viewer';
import { prepareLetterPulse } from './heading-letter-pulse';
import { headingColor } from './liquid-heading-colors';

export function createHeadingViewer(host,id,onReady){
  const studio=acquireLiquidStudio();
  const {renderer,environment}=studio;
  const canvas=document.createElement('canvas');canvas.setAttribute('aria-hidden','true');host.appendChild(canvas);
  const context=canvas.getContext('2d');
  const letterPulse=true,wave={value:-10},direction={value:0},glyphCount={value:0};
  let letterCount=0,lastOutlineWave=null;
  const outlineCanvas=letterPulse?document.createElement('canvas'):null;
  if(outlineCanvas){outlineCanvas.className='letter-pulse-outline';outlineCanvas.setAttribute('aria-hidden','true');host.prepend(outlineCanvas);}
  const outlineContext=outlineCanvas?.getContext('2d');
  const outlineMaterial=letterPulse?new THREE.MeshBasicMaterial({color:'#9b55ee',transparent:true,depthWrite:false}):null;
  function deformLetters(shader,outline=false){
    shader.uniforms.letterWave=wave;shader.uniforms.letterDirection=direction;shader.uniforms.glyphCount=glyphCount;
    shader.vertexShader='attribute vec3 letterAnchor; uniform float letterWave; uniform float letterDirection; uniform float glyphCount; varying float glyphPulse; varying float glyphColour;\n'+shader.vertexShader;
    shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>
      float glyphOrder=mix(letterAnchor.z,glyphCount-1.0-letterAnchor.z,letterDirection);
      glyphPulse=0.5+0.5*cos(min(1.0,abs(glyphOrder-letterWave)/1.4)*3.14159265);
      glyphColour=max(smoothstep(0.0,0.65,glyphPulse),smoothstep(-0.7,0.0,letterWave-glyphOrder));
      transformed.xy=letterAnchor.xy+(transformed.xy-letterAnchor.xy)*(1.0+glyphPulse*1.5);`);
    shader.fragmentShader='varying float glyphPulse; varying float glyphColour;\n'+shader.fragmentShader;
    if(!outline){
      shader.uniforms.brandPurple={value:new THREE.Color(getComputedStyle(host).getPropertyValue('--h-accent').trim()||'#A995C9')};
      shader.fragmentShader='uniform vec3 brandPurple;\n'+shader.fragmentShader;
      shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\n diffuseColor.rgb=mix(diffuseColor.rgb,brandPurple,glyphColour);');
    }
    if(outline){
      shader.fragmentShader=shader.fragmentShader.replace('#include <opaque_fragment>','diffuseColor.a *= smoothstep(0.03,0.6,glyphPulse);\n#include <opaque_fragment>');
    }
  }
  if(outlineMaterial)outlineMaterial.onBeforeCompile=shader=>deformLetters(shader,true);
  const measurement=document.createElement('canvas').getContext('2d');
  const scene=new THREE.Scene();scene.environment=environment.texture;
  const camera=new THREE.OrthographicCamera(0,1,1,0,.1,2000);camera.position.z=1000;
  const color=headingColor(id);
  const material=letterPulse?new THREE.MeshBasicMaterial({color:'#232323',toneMapped:false}):new THREE.MeshPhysicalMaterial({color,metalness:1,roughness:.17,clearcoat:.6,clearcoatRoughness:.12,envMapIntensity:1.2,emissive:color,emissiveIntensity:.08});
  // Broad, shallow surface undulations catch the studio strips across each letter face.
  material.onBeforeCompile=shader=>{
    if(letterPulse)deformLetters(shader);
    shader.vertexShader='varying vec3 letterPoint;\n'+shader.vertexShader;
    shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\n letterPoint = position;');
    shader.fragmentShader='varying vec3 letterPoint;\n'+shader.fragmentShader;
    shader.fragmentShader=shader.fragmentShader.replace('#include <normal_fragment_maps>',`#include <normal_fragment_maps>
      vec2 tension = vec2(sin(letterPoint.x * 5.0 + letterPoint.y * 8.0), cos(letterPoint.y * 9.0 - letterPoint.x * 3.0));
      normal = normalize(normal + vec3(tension * 0.18 * abs(normal.z), 0.0));`);
  };
  const motion=matchMedia('(prefers-reduced-motion:no-preference)');
  let model=null,bounds=null,disposed=false,inView=false,frame=0,time=0,last=0,lastDraw=0;
  let width=1,height=1,fontSize=100,padding=0;
  function resize(){
    if(!model||disposed)return;
    const style=getComputedStyle(host);
    fontSize=parseFloat(style.fontSize);
    const lineHeight=parseFloat(style.lineHeight)||fontSize;
    padding=letterPulse?Math.ceil(fontSize*.9):0;
    const contentWidth=Math.max(1,host.clientWidth);
    width=contentWidth+padding*2;height=Math.ceil(lineHeight+fontSize*.04)+padding*2;
    lastOutlineWave=null;
    canvas.style.width=`${width}px`;canvas.style.left=`${-padding}px`;canvas.style.top=`${-padding}px`;
    canvas.style.height=`${height}px`;
    if(outlineCanvas)outlineCanvas.style.cssText=canvas.style.cssText;
    measurement.font=`${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    const metrics=measurement.measureText(host.querySelector('.liquid-heading-text').textContent);
    const ascent=metrics.actualBoundingBoxAscent,descent=metrics.actualBoundingBoxDescent;
    const fontAscent=metrics.fontBoundingBoxAscent??fontSize*.9,fontDescent=metrics.fontBoundingBoxDescent??fontSize*.23;
    const baseline=(lineHeight-fontAscent-fontDescent)/2+fontAscent;
    const sx=contentWidth/(bounds.max.x-bounds.min.x);
    const sy=(ascent+descent)/(bounds.max.y-bounds.min.y);
    model.scale.set(sx,sy,sy);
    model.position.set(padding-bounds.min.x*sx,height-padding-baseline-descent-bounds.min.y*sy,0);
    camera.right=width;camera.top=height;camera.updateProjectionMatrix();draw();
  }
  function draw(){
    if(!model||disposed)return;
    const progress=motion.matches?Number(host.dataset.letterWave??-1):-1;
    direction.value=host.dataset.letterDirection==='left'?1:0;glyphCount.value=letterCount;
    wave.value=progress<0?-10:progress*(letterCount+1.8)-1.4;
    resizeLiquidRenderer(renderer,width,height);
    const pixelRatio=renderer.getPixelRatio();
    const pixelWidth=Math.floor(width*pixelRatio),pixelHeight=Math.floor(height*pixelRatio);
    if(canvas.width!==pixelWidth||canvas.height!==pixelHeight){canvas.width=pixelWidth;canvas.height=pixelHeight;}
    if(outlineCanvas&&lastOutlineWave!==wave.value){
      if(outlineCanvas.width!==pixelWidth||outlineCanvas.height!==pixelHeight){outlineCanvas.width=pixelWidth;outlineCanvas.height=pixelHeight;}
      outlineContext.clearRect(0,0,pixelWidth,pixelHeight);
      if(progress>0&&progress<1){
        scene.overrideMaterial=outlineMaterial;renderer.render(scene,camera);
        const sourceY=renderer.domElement.height-pixelHeight,edge=1.5*pixelRatio;
        for(let i=0;i<8;i++){
          const angle=i*Math.PI/4;
          outlineContext.drawImage(renderer.domElement,0,sourceY,pixelWidth,pixelHeight,Math.cos(angle)*edge,Math.sin(angle)*edge,pixelWidth,pixelHeight);
        }
        // Keep only the contour, removing the filled centre before applying the halo.
        outlineContext.globalCompositeOperation='destination-out';
        outlineContext.drawImage(renderer.domElement,0,sourceY,pixelWidth,pixelHeight,0,0,pixelWidth,pixelHeight);
        outlineContext.globalCompositeOperation='source-over';
        scene.overrideMaterial=null;
      }
      lastOutlineWave=wave.value;
    }
    renderer.render(scene,camera);context.clearRect(0,0,canvas.width,canvas.height);context.drawImage(renderer.domElement,0,renderer.domElement.height-canvas.height,canvas.width,canvas.height,0,0,canvas.width,canvas.height);
  }
  function updateReflection(){
    const phase=(time%8000)/8000;
    // Only the reflected studio lighting moves. The letter geometry stays fixed.
    scene.environmentRotation.y=Math.sin(phase*Math.PI*2)*.28;
    host.dataset.reflection=phase.toFixed(3);draw();
  }
  function tick(now){
    time+=Math.min(now-last,100);last=now;
    const pulsing=letterPulse&&Number(host.dataset.letterWave)>0&&Number(host.dataset.letterWave)<1;
    if(now-lastDraw>=1000/(pulsing?60:30)){lastDraw=now;updateReflection();}
    frame=requestAnimationFrame(tick);
  }
  function stop(){cancelAnimationFrame(frame);frame=0;}
  function start(){if(model&&!disposed&&inView&&!document.hidden&&motion.matches&&!frame){last=performance.now();frame=requestAnimationFrame(tick);}}
  const visibility=()=>{if(document.hidden)stop();else start();};
  const preference=()=>{if(!motion.matches){stop();scene.environmentRotation.y=0;draw();}else start();};
  const observer=new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;if(inView)start();else stop();});observer.observe(host);
  const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(host);
  document.addEventListener('visibilitychange',visibility);motion.addEventListener('change',preference);
  const contextLost=()=>{stop();onReady(false);};
  renderer.domElement.addEventListener('webglcontextlost',contextLost);
  function disposeModel(root){root?.traverse(o=>{o.geometry?.dispose();if(o.material&&o.material!==material)o.material.dispose();});}
  new GLTFLoader().loadAsync(`/models/liquid-headings/${id}.glb?v=3`).then(gltf=>{
    if(disposed){disposeModel(gltf.scene);return;}
    model=gltf.scene;
    model.traverse(o=>{if(o.isMesh){o.material?.dispose();o.material=material;o.geometry.morphAttributes={};o.updateMorphTargets();if(letterPulse){letterCount=prepareLetterPulse(o.geometry);host.dataset.letterCount=String(letterCount);}}});
    scene.add(model);bounds=new THREE.Box3();
    // Measure the original outlines, excluding the retired melt poses in the source assets.
    model.updateMatrixWorld(true);
    model.traverse(o=>{if(o.isMesh){const positions=o.geometry.attributes.position;for(let i=0;i<positions.count;i++){const p=new THREE.Vector3().fromBufferAttribute(positions,i).applyMatrix4(o.matrixWorld);bounds.expandByPoint(p);}}});
    resize();onReady(true);start();
  }).catch(()=>{ /* Accessible original heading remains visible on a load failure. */ });
  return {dispose(){disposed=true;stop();observer.disconnect();resizeObserver.disconnect();document.removeEventListener('visibilitychange',visibility);motion.removeEventListener('change',preference);renderer.domElement.removeEventListener('webglcontextlost',contextLost);disposeModel(model);material.dispose();outlineMaterial?.dispose();outlineCanvas?.remove();canvas.remove();delete host.dataset.letterCount;delete host.dataset.reflection;releaseLiquidStudio(studio);}};
}
