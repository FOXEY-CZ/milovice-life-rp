// Milovice RP 5.5: OSM footprint and station-wall collisions via spatial hashing.
const edgeDistSq=(x,z,a,b)=>{
 const dx=b.x-a.x,dz=b.z-a.z,den=dx*dx+dz*dz;
 const t=den>1e-9?Math.max(0,Math.min(1,((x-a.x)*dx+(z-a.z)*dz)/den)):0;
 const ex=x-a.x-t*dx,ez=z-a.z-t*dz;return ex*ex+ez*ez;
};
function inside(points,x,z){
 let result=false;
 for(let i=0,j=points.length-1;i<points.length;j=i++){
  const a=points[i],b=points[j];
  if((a.z>z)!==(b.z>z)&&x<(b.x-a.x)*(z-a.z)/(b.z-a.z)+a.x)result=!result;
 }
 return result;
}
export function makeMiloviceCollisionWorld({cellSize=32}={}){
 if(!Number.isFinite(cellSize)||cellSize<=0)throw new RangeError('Invalid collision cell size');
 const grid=new Map(),shapes=[];
 // Reject corrupt/extreme inputs before they can create unbounded loops.
 const cellRange=(minX,minZ,maxX,maxZ)=>{
  const a=Math.floor(minX/cellSize),b=Math.floor(minZ/cellSize),c=Math.floor(maxX/cellSize),d=Math.floor(maxZ/cellSize);
  if(![a,b,c,d].every(Number.isSafeInteger)||c<a||d<b||(c-a+1)*(d-b+1)>65536)return null;
  return [a,b,c,d];
 };
 let polygons=0,walls=0,blockedSteps=0;
 const key=(x,z)=>x+','+z;
 function insert(item,minX,minZ,maxX,maxZ){
  const range=cellRange(minX,minZ,maxX,maxZ);
  if(!range)return false;
  const [gx0,gz0,gx1,gz1]=range;
  item.bounds={minX,minZ,maxX,maxZ};
  const index=shapes.push(item)-1;
  for(let gx=gx0;gx<=gx1;gx++)
   for(let gz=gz0;gz<=gz1;gz++){
    const cell=key(gx,gz);
    if(!grid.has(cell))grid.set(cell,[]);
    grid.get(cell).push(index);
   }
  return true;
 }
 function addPolygon(points,{id=null}={}){
  if(!Array.isArray(points)||points.length<3)return false;
  const clean=points.map(p=>({x:p?.x,z:p?.z}));
  if(clean.some(p=>!Number.isFinite(p.x)||!Number.isFinite(p.z)))return false;
  if(clean.length>3&&Math.hypot(clean[0].x-clean.at(-1).x,clean[0].z-clean.at(-1).z)<.02)clean.pop();
  const xs=clean.map(p=>p.x),zs=clean.map(p=>p.z);
  const b=[Math.min(...xs),Math.min(...zs),Math.max(...xs),Math.max(...zs)];
  if(b[2]-b[0]<.1||b[3]-b[1]<.1)return false;
  if(!insert({kind:'polygon',points:clean,id},...b))return false;
  polygons++;return true;
 }
 function addWall(a,b,thickness=.32,{id=null}={}){
  if(!a||!b||[a.x,a.z,b.x,b.z].some(v=>!Number.isFinite(v)))return false;
  if(Math.hypot(b.x-a.x,b.z-a.z)<.05)return false;
  if(!Number.isFinite(thickness)||thickness<=0)return false;
  const half=thickness*.5;
  if(!insert({kind:'wall',a:{x:a.x,z:a.z},b:{x:b.x,z:b.z},half,id},
   Math.min(a.x,b.x)-half,Math.min(a.z,b.z)-half,
   Math.max(a.x,b.x)+half,Math.max(a.z,b.z)+half))return false;
  walls++;return true;
 }
 function collides(x,z,radius=.35){
  if(!Number.isFinite(x)||!Number.isFinite(z)||!Number.isFinite(radius)||radius<0)return true;
  const seen=new Set(),rr=radius*radius;
  const range=cellRange(x-radius,z-radius,x+radius,z+radius);
  if(!range)return true;
  const [gx0,gz0,gx1,gz1]=range;
  for(let gx=gx0;gx<=gx1;gx++)for(let gz=gz0;gz<=gz1;gz++){
   for(const index of grid.get(key(gx,gz))||[]){
    if(seen.has(index))continue;seen.add(index);
    const s=shapes[index],b=s.bounds;
    if(x+radius<b.minX||x-radius>b.maxX||z+radius<b.minZ||z-radius>b.maxZ)continue;
    if(s.kind==='wall'){
     if(edgeDistSq(x,z,s.a,s.b)<=(radius+s.half)**2)return true;
    }else{
     if(inside(s.points,x,z))return true;
     for(let i=0;i<s.points.length;i++)
      if(edgeDistSq(x,z,s.points[i],s.points[(i+1)%s.points.length])<=rr)return true;
    }
   }
  }
  return false;
 }
 function move(x,z,dx,dz,radius=.35,dynamicBlocked=()=>false){
  if(![x,z,dx,dz,radius].every(Number.isFinite)||radius<0||typeof dynamicBlocked!=='function')return {x,z,blocked:true};
  if(!cellRange(x-radius,z-radius,x+radius,z+radius))return {x,z,blocked:true};
  const distance=Math.hypot(dx,dz);
  if(distance<1e-7)return {x,z,blocked:false};
  // Swept substeps avoid tunnelling under low-FPS animation frames.
  const steps=Math.max(1,Math.ceil(distance/Math.max(.20,Math.min(.65,radius*.55))));
  if(!Number.isFinite(steps)||steps>4096)return {x,z,blocked:true};
  const sx=dx/steps,sz=dz/steps;
  const blockedAt=(xx,zz)=>collides(xx,zz,radius)||dynamicBlocked(xx,zz,radius);
  let blocked=false;
  for(let i=0;i<steps;i++){
   if(!blockedAt(x+sx,z+sz)){x+=sx;z+=sz;continue}
   blocked=true;blockedSteps++;
   const freeX=!blockedAt(x+sx,z),freeZ=!blockedAt(x,z+sz);
   if(freeX&&(!freeZ||Math.abs(sx)>=Math.abs(sz)))x+=sx;
   else if(freeZ)z+=sz;
   else if(freeX)x+=sx;
  }
  return {x,z,blocked};
 }
 function reset(){grid.clear();shapes.length=0;polygons=0;walls=0;blockedSteps=0}
 function stats(){return {polygons,walls,gridCells:grid.size,blockedSteps}}
 return {addPolygon,addWall,collides,move,reset,stats};
}
