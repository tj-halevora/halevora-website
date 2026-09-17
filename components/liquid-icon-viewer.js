import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Reflector } from 'three/addons/objects/Reflector.js';
import { liquidIconPalette } from './liquid-icon-palette';

function makeEnvironment(renderer) {
  const room = new THREE.Scene();
  room.background = new THREE.Color('#60606a');
  function softbox(w,h,x,y,z,color,intensity) {
    const panel=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({color:new THREE.Color(color).multiplyScalar(intensity),side:THREE.DoubleSide}));
    panel.position.set(x,y,z);panel.lookAt(0,0,0);room.add(panel);
  }
  softbox(2.5,5,-3,2,3,'#fff0e6',5);
  softbox(.5,5,3,0,2,'#ffffff',6);
  softbox(4,1,0,4,1,'#f0dfff',4);
  softbox(2,4,1,1,-3,'#a381dd',3);
  softbox(1.3,3,-4,-1,-1,'#b591e8',2);
  softbox(3,.5,0,-2,4,'#ffffff',2);
  softbox(2.5,2.6,.5,.4,5,'#dccbe9',.85);
  softbox(.18,4.5,-1.5,1,4,'#ffffff',3);
  const generator = new THREE.PMREMGenerator(renderer);
  const target=generator.fromScene(room,.025);
  generator.dispose();room.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});
  return target;
}

let sharedStudio=null;
const currentRenderSize=new THREE.Vector2();
export function resizeLiquidRenderer(renderer,width,height) {
  width=Math.max(1,width);height=Math.max(1,height);
  renderer.getSize(currentRenderSize);
  // Keep one growing backing buffer. Different viewers use viewports instead of
  // repeatedly reallocating the canvas when headings and icons render together.
  if(currentRenderSize.x<width||currentRenderSize.y<height){
    renderer.setSize(Math.max(currentRenderSize.x,width),Math.max(currentRenderSize.y,height),false);
  }
  renderer.setViewport(0,0,width,height);
}
function createStudio(embedded) {
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,embedded?1.5:1.75));
  renderer.setClearColor('#070609',embedded?0:1);
  renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.08;
  return {renderer,environment:makeEnvironment(renderer),users:0};
}

export function acquireLiquidStudio() {
  const studio=sharedStudio??=createStudio(true);
  studio.users++;
  return studio;
}

export function releaseLiquidStudio(studio) {
  studio.users--;
  if(studio.users===0){studio.environment.dispose();studio.renderer.dispose();if(sharedStudio===studio)sharedStudio=null;}
}

export function createIconViewer(host,{onProgress=()=>{},onStatus=()=>{},embedded=false}) {
  // Service cards share one WebGL context and copy their on-demand renders to 2D canvases.
  const studio=embedded?acquireLiquidStudio():createStudio(false);
  if(!embedded)studio.users++;
  const {renderer,environment}=studio;
  const surface=embedded?document.createElement('canvas'):renderer.domElement;
  const surfaceContext=embedded?surface.getContext('2d'):null;
  surface.setAttribute('aria-hidden','true');
  host.appendChild(surface);
  const scene=new THREE.Scene();
  scene.environment=environment.texture;
  const camera=new THREE.PerspectiveCamera(34,1,.1,60);
  const controls=new OrbitControls(camera,surface);
  controls.enableDamping=false;controls.enablePan=false;controls.enableZoom=false;
  controls.minPolarAngle=.35;controls.maxPolarAngle=1.72;
  const root=new THREE.Group();scene.add(root);
  const floor=new Reflector(new THREE.PlaneGeometry(40,40),{color:0x55505f,textureWidth:embedded?64:1024,textureHeight:embedded?64:1024,multisample:0});
  floor.visible=!embedded;
  floor.rotation.x=-Math.PI/2;floor.position.y=-1.65;
  floor.material.uniforms.liquidAmount={value:0};
  floor.material.vertexShader='varying vec3 floorPoint;\n'+floor.material.vertexShader;
  floor.material.vertexShader=floor.material.vertexShader.replace(
    'vUv = textureMatrix',
    'floorPoint = (modelMatrix * vec4(position, 1.0)).xyz;\n vUv = textureMatrix'
  );
  floor.material.fragmentShader='uniform float liquidAmount;\n varying vec3 floorPoint;\n'+floor.material.fragmentShader;
  floor.material.fragmentShader=floor.material.fragmentShader.replace(
    'vec4 base = texture2DProj( tDiffuse, vUv );',
    `float radius = length(floorPoint.xz);
     float ripple = sin(radius * 24.0 - liquidAmount * 14.0) * exp(-radius * 1.1) * liquidAmount;
     vec4 reflectedUv = vUv;
     reflectedUv.xy += normalize(floorPoint.xz + vec2(0.001)) * ripple * 0.004 * vUv.w;
     vec4 base = texture2DProj(tDiffuse, reflectedUv);`
  );
  floor.material.fragmentShader=floor.material.fragmentShader.replace(
    'vec4( blendOverlay( base.rgb, color ), 1.0 )',
    'vec4( vec3(0.0015, 0.0013, 0.002) + base.rgb * 0.46, 1.0 )'
  );
  floor.material.fragmentShader=floor.material.fragmentShader.replace(
    '#include <colorspace_fragment>',
    '#include <colorspace_fragment>\n gl_FragColor.rgb = max(gl_FragColor.rgb, vec3(7.0, 6.0, 9.0) / 255.0);'
  );
  scene.add(floor);
  const metal=new THREE.MeshPhysicalMaterial({color:'#b653ff',metalness:1,roughness:.175,clearcoat:.45,clearcoatRoughness:.12,envMapIntensity:1.1,emissiveIntensity:.08});
  const drops=[];
  for(let i=0;i<8;i++) {
    const drop=new THREE.Mesh(new THREE.SphereGeometry(.055+(i%3)*.023,24,16),metal);
    drop.position.set(Math.sin(i*5.3)*1.3,-1.58+(i%3)*.022,Math.cos(i*9.6)*.42);
    drop.scale.y=.83;scene.add(drop);drops.push(drop);
  }
  const poolGeometry=new THREE.SphereGeometry(1,64,24);
  const poolPositions=poolGeometry.attributes.position;
  for(let i=0;i<poolPositions.count;i++) {
    const x=poolPositions.getX(i),z=poolPositions.getZ(i);
    const angle=Math.atan2(z,x);
    const edge=1+.085*Math.sin(angle*5)+.055*Math.cos(angle*3);
    poolPositions.setX(i,x*edge);poolPositions.setZ(i,z*edge);
  }
  poolGeometry.computeVertexNormals();
  const pool=new THREE.Mesh(poolGeometry,metal);
  pool.position.set(0,-1.64,0);pool.scale.set(.46,.017,.23);scene.add(pool);
  const fallingDrops=Array.from({length:3},()=>{
    const drop=new THREE.Mesh(new THREE.SphereGeometry(.08,24,16),metal);
    drop.visible=false;root.add(drop);return drop;
  });
  let outlet=-.91;
  let model=null,disposed=false,request=0,frame=0,drawFrame=0,running=false,inView=true;
  let elapsed=0;
  const motion=matchMedia('(min-width: 1280px) and (prefers-reduced-motion: no-preference)');
  function draw() {
    if(disposed)return;
    if(embedded){
      resizeLiquidRenderer(renderer,host.clientWidth,host.clientHeight);
      const pixelRatio=renderer.getPixelRatio();
      const width=Math.floor(host.clientWidth*pixelRatio),height=Math.floor(host.clientHeight*pixelRatio);
      if(surface.width!==width||surface.height!==height){surface.width=width;surface.height=height;}
    }
    renderer.render(scene,camera);
    if(embedded){surfaceContext.clearRect(0,0,surface.width,surface.height);surfaceContext.drawImage(renderer.domElement,0,renderer.domElement.height-surface.height,surface.width,surface.height,0,0,surface.width,surface.height);}
  }
  function invalidate(){if(!drawFrame)drawFrame=requestAnimationFrame(()=>{drawFrame=0;draw();});}
  function resize(){resizeLiquidRenderer(renderer,host.clientWidth,host.clientHeight);camera.aspect=host.clientWidth/host.clientHeight;camera.updateProjectionMatrix();invalidate();}
  function reset(){camera.position.set(1.5,embedded?.65:1.0,6.25);controls.target.set(0,embedded?-.23:-.44,0);controls.update();invalidate();}
  function pose(value) {
    if(embedded)host.dataset.melt=value.toFixed(3);
    model?.traverse(o=>{if(o.morphTargetDictionary){
      o.morphTargetInfluences[o.morphTargetDictionary.Melt]=value;
      o.morphTargetInfluences[o.morphTargetDictionary.Soften]=Math.sin(value*Math.PI)*.65;
    }});
    // Surface tension gathers the falling metal into a shallow reflective pool.
    pool.scale.set(.46+value*.40,.017+value*.018,.23+value*.18);
    pool.position.x=Math.cos(root.rotation.y)*outlet*.28*value;
    pool.position.z=-Math.sin(root.rotation.y)*outlet*.28*value;
    fallingDrops.forEach((drop,i)=>{
      const amount=THREE.MathUtils.smoothstep(value,.12+i*.15,.55+i*.15);
      drop.visible=amount>0;
      drop.position.set(outlet*(1-.13*value)+(i-1)*.055,-.93-amount*.61,-.03+i*.07);
      drop.scale.setScalar(Math.sin(amount*Math.PI)*(.75-i*.13));
      drop.scale.y*=1.9-amount;
    });
    drops.forEach((d,i)=>{
      d.scale.y=.83+Math.sin(value*Math.PI)*(i%2?.42:.18);
      d.position.y=-1.58+(i%3)*.022+Math.sin(value*Math.PI)*.12*(i%2);
    });
    floor.material.uniforms.liquidAmount.value=value;
    scene.environmentRotation.y=value*.24;
    onProgress(value);invalidate();
  }
  function stop(){cancelAnimationFrame(frame);frame=0;running=false;}
  function play(){
    if(!model||running||!inView||document.hidden||!motion.matches)return;
    running=true;const start=performance.now();let previous=start,lastDraw=0;
    function tick(now){
      if(embedded){
        elapsed+=Math.min(now-previous,100);previous=now;
        if(now-lastDraw>=1000/30){
          lastDraw=now;
          root.rotation.y=(elapsed/8000)*Math.PI*2;
          host.dataset.rotation=root.rotation.y.toFixed(3);
          pose((1-Math.cos(elapsed/4000*Math.PI*2))/2);
        }
        frame=requestAnimationFrame(tick);return;
      }
      const t=Math.min((now-start)/4400,1);
      // A slow melt, a short liquid hold, then a quicker smooth reformation.
      const value=t<.52?THREE.MathUtils.smootherstep(t,0,.52):t<.62?1:1-THREE.MathUtils.smootherstep(t,.62,1);
      pose(value);
      if(t<1){frame=requestAnimationFrame(tick);}else{running=false;frame=0;}
    }
    frame=requestAnimationFrame(tick);
  }
  const cache=new Map();
  function release(gltf){gltf.scene.traverse(o=>{o.geometry?.dispose();if(o.material&&o.material!==metal){(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.dispose());}});}
  async function load(id){
    const token=++request;stop();onStatus('Loading the sculpture…',false);
    try{
      let gltf=cache.get(id);
      if(!gltf){
        gltf=await new GLTFLoader().loadAsync(`/models/liquid-icons/${id}.glb?v=5`);
        if(disposed){release(gltf);return;}
        if(cache.has(id)){release(gltf);gltf=cache.get(id);}else{
          gltf.scene.traverse(o=>{if(o.isMesh){o.material.dispose();o.material=metal;o.frustumCulled=false;}});
          cache.set(id,gltf);
        }
      }
      if(token!==request)return;
      if(model)root.remove(model);
      metal.color.set(id==='halevora'?'#A995C9':liquidIconPalette.find(icon=>icon.id===id)?.color??'#bea2d5');
      metal.metalness=id==='halevora'?.75:1;
      metal.emissive.copy(metal.color);
      outlet={representation:-.28,scheduling:.59,production:-.64,audience:.18,funnel:0,partnerships:-.91,halevora:-.42}[id]??0;
      model=gltf.scene;root.add(model);
      pose(0);reset();draw();onStatus('Drag to rotate the sculpture',true);
      if(embedded)play();
    }catch{if(token===request&&!disposed)onStatus('This model could not load. Select another sculpture or refresh to retry.',false);}
  }
  const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(host);
  const observer=new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;if(!inView)stop();else if(embedded)play();});observer.observe(host);
  const visibility=()=>{if(document.hidden)stop();else if(embedded)play();};
  const preference=()=>{if(!motion.matches){stop();root.rotation.y=0;elapsed=0;if(embedded)host.dataset.rotation='0';pose(0);}else if(embedded)play();};
  controls.addEventListener('change',invalidate);
  controls.addEventListener('start',stop);
  const resume=()=>{if(embedded)play();};
  controls.addEventListener('end',resume);
  const interactionTarget=embedded?host.closest('article')??host:surface;
  interactionTarget.addEventListener('pointerenter',play);
  surface.addEventListener('dblclick',reset);
  document.addEventListener('visibilitychange',visibility);motion.addEventListener('change',preference);
  const contextLost=event=>{event.preventDefault();stop();onStatus('The 3D context was interrupted. Refresh to restore the preview.',false);};
  renderer.domElement.addEventListener('webglcontextlost',contextLost);
  reset();resize();
  return {load,play,reset,setMelt(value){stop();pose(value);},dispose(){
    disposed=true;request++;stop();cancelAnimationFrame(drawFrame);
    resizeObserver.disconnect();observer.disconnect();controls.dispose();
    document.removeEventListener('visibilitychange',visibility);motion.removeEventListener('change',preference);
    interactionTarget.removeEventListener('pointerenter',play);surface.removeEventListener('dblclick',reset);renderer.domElement.removeEventListener('webglcontextlost',contextLost);
    cache.forEach(release);drops.forEach(d=>d.geometry.dispose());fallingDrops.forEach(d=>d.geometry.dispose());pool.geometry.dispose();metal.dispose();floor.geometry.dispose();floor.dispose();
    releaseLiquidStudio(studio);
    surface.remove();delete host.dataset.melt;delete host.dataset.rotation;
  }};
}
