import { BufferAttribute } from 'three';

// Recover complete glyphs from the mesh, welding vertices split at bevel seams.
export function prepareLetterPulse(geometry){
  const position=geometry.attributes.position,count=position.count;
  const parent=Array.from({length:count},(_,i)=>i),seen=new Map();
  const root=i=>{while(parent[i]!==i){parent[i]=parent[parent[i]];i=parent[i];}return i;};
  const join=(a,b)=>{parent[root(a)]=root(b);};
  for(let i=0;i<count;i++){
    const key=[position.getX(i),position.getY(i),position.getZ(i)].map(v=>v.toFixed(5)).join(',');
    if(seen.has(key))join(i,seen.get(key));else seen.set(key,i);
  }
  const index=geometry.index;
  for(let i=0;i<(index?.count??count);i+=3){const a=index?index.getX(i):i;join(a,index?index.getX(i+1):i+1);join(a,index?index.getX(i+2):i+2);}
  const groups=new Map();
  for(let i=0;i<count;i++){
    const key=root(i);
    if(!groups.has(key))groups.set(key,{ids:[],minX:Infinity,maxX:-Infinity,minY:Infinity,maxY:-Infinity});
    const g=groups.get(key);g.ids.push(i);
    g.minX=Math.min(g.minX,position.getX(i));g.maxX=Math.max(g.maxX,position.getX(i));
    g.minY=Math.min(g.minY,position.getY(i));g.maxY=Math.max(g.maxY,position.getY(i));
  }
  const letters=[];
  for(const part of [...groups.values()].sort((a,b)=>a.minX-b.minX)){
    const previous=letters.at(-1);
    // Keep each i and its dot together.
    if(previous&&part.minX>=previous.minX&&part.maxX<=previous.maxX){previous.ids.push(...part.ids);previous.maxY=Math.max(previous.maxY,part.maxY);}
    else letters.push(part);
  }
  const anchors=new Float32Array(count*3);
  letters.forEach((g,i)=>g.ids.forEach(v=>{anchors[v*3]=(g.minX+g.maxX)/2;anchors[v*3+1]=(g.minY+g.maxY)/2;anchors[v*3+2]=letters.length-1-i;}));
  geometry.setAttribute('letterAnchor',new BufferAttribute(anchors,3));
  return letters.length;
}
