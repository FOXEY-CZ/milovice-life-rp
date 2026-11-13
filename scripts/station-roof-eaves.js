// Milovice RP 5.28.8 — continuous mapped exterior eaves, no bogus caps.
// Roof top and soffit are partitions of the SAME affine roof planes as the
// source station roof, not bent quadrilaterals crossing hip creases.
const EPS=1e-8;
const point=p=>({x:p.x,z:p.z??p.y});
function ring(input){
 if(!Array.isArray(input)||input.length<3)return null;
 const points=input.map(point);
 if(points.some(p=>!Number.isFinite(p.x)||!Number.isFinite(p.z)))return null;
 if(points.length>3&&Math.hypot(points[0].x-points.at(-1).x,points[0].z-points.at(-1).z)<.02)points.pop();
 return points.length>=3?points:null;
}
function signedArea(poly){
 let sum=0;
 for(let i=0;i<poly.length;i++){
  const a=poly[i],b=poly[(i+1)%poly.length];
  sum+=a.x*b.z-b.x*a.z;
 }
 return sum*.5;
}
// A clipped section edge counts as exterior only if both ends are on
// the same ORIGINAL OSM polygon edge. Virtual central-tower cuts fail this.
export function stationExteriorEdge(a,b,originalOutline){
 const original=ring(originalOutline);
 if(!original)return null;
 const sign=Math.sign(signedArea(original));
 if(!sign)return null;
 const pa=point(a),pb=point(b),mx=(pa.x+pb.x)*.5,mz=(pa.z+pb.z)*.5;
 for(let i=0;i<original.length;i++){
  const p=original[i],q=original[(i+1)%original.length];
  const dx=q.x-p.x,dz=q.z-p.z,len=Math.hypot(dx,dz);
  if(len<.05)continue;
  const dist=(x,z)=>Math.abs(dx*(z-p.z)-dz*(x-p.x))/len;
  const t=(x,z)=>((x-p.x)*dx+(z-p.z)*dz)/(len*len);
  if(dist(pa.x,pa.z)>.045||dist(pb.x,pb.z)>.045||dist(mx,mz)>.045)continue;
  if([t(pa.x,pa.z),t(pb.x,pb.z)].some(v=>v<-.01||v>1.01))continue;
  return {sourceIndex:i,nx:sign*dz/len,nz:-sign*dx/len};
 }
 return null;
}
function miter(before,after,width){
 const a=before||after,b=after||before;
 if(!a)return {x:0,z:0};
 const dot=a.nx*b.nx+a.nz*b.nz;
 if(dot<-.45)return {x:b.nx*width,z:b.nz*width};
 const scale=width/(1+dot),x=(a.nx+b.nx)*scale,z=(a.nz+b.nz)*scale;
 const len=Math.hypot(x,z),max=width*1.8;
 return len>max?{x:x*max/len,z:z*max/len}:{x,z};
}
function roofPlanes(roof,origin){
 const {ax,az}=roof.globalAxis,{minS,maxS,minT,maxT}=roof.bounds;
 const midT=(minT+maxT)*.5;
 return [
  p=>{const dx=p.x-origin.x,dz=p.z-origin.z;return (-dx*az+dz*ax-minT)/(midT-minT)},
  p=>{const dx=p.x-origin.x,dz=p.z-origin.z;return (maxT+dx*az-dz*ax)/(maxT-midT)},
  ...(roof.kind==='hip'?[
   p=>{const dx=p.x-origin.x,dz=p.z-origin.z;return (dx*ax+dz*az-minS)/roof.endInset},
   p=>{const dx=p.x-origin.x,dz=p.z-origin.z;return (maxS-dx*ax-dz*az)/roof.endInset}
  ]:[])
 ];
}
function cutsOnSegment(a,b,planes){
 const t=[0,1];
 for(let i=0;i<planes.length;i++)for(let j=i+1;j<planes.length;j++){
  const d0=planes[i](a)-planes[j](a),d1=planes[i](b)-planes[j](b);
  const den=d0-d1;
  if(Math.abs(den)<EPS)continue;
  const t0=d0/den;
  if(t0>1e-7&&t0<1-1e-7)t.push(t0);
 }
 t.sort((a,b)=>a-b);
 return t.filter((v,i)=>i===0||v-t[i-1]>1e-7);
}
const mix=(p,q,t)=>({x:p.x+(q.x-p.x)*t,z:p.z+(q.z-p.z)*t});
function clipBelow(polygon,first,second){
 const output=[];
 for(let i=0;i<polygon.length;i++){
  const a=polygon[i],b=polygon[(i+1)%polygon.length];
  const da=first(a)-second(a),db=first(b)-second(b);
  const insideA=da<=EPS,insideB=db<=EPS;
  if(insideA)output.push(a);
  if(insideA!==insideB){
   const t=da/(da-db);
   output.push(mix(a,b,t));
  }
 }
 const unique=[];
 for(const p of output)if(!unique.length||
  Math.hypot(p.x-unique.at(-1).x,p.z-unique.at(-1).z)>1e-7)unique.push(p);
 if(unique.length>1&&Math.hypot(unique[0].x-unique.at(-1).x,
  unique[0].z-unique.at(-1).z)<1e-7)unique.pop();
 return unique;
}
function addTriangle(dest,a,b,c){
 const u=[b.x-a.x,b.y-a.y,b.z-a.z],v=[c.x-a.x,c.y-a.y,c.z-a.z];
 const cross=Math.hypot(u[1]*v[2]-u[2]*v[1],
  u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]);
 if(cross>1e-7)dest.push([a,b,c]);
}
const quad=(dest,a,b,c,d)=>{addTriangle(dest,a,b,c);addTriangle(dest,a,c,d)};
// Shared, lightweight eave mesh for any perimeter-constrained roof.
// One continuous top/soffit/fascia strip on actual exterior OSM edges.
// The height is affine for each strip, eliminating black non-planar flaps.
export function planPerimeterRoofEaves({outline,originalOutline,roof,
 width=.32,thickness=.10}={}){
 const section=ring(outline),original=ring(originalOutline);
 if(!section||!original||roof?.roofModel!=='perimeter-constrained'||
  !Number.isFinite(roof.eaveY)||width<.10||width>.65||
  thickness<.04||thickness>.20)return null;
 const edges=section.map((a,i)=>stationExteriorEdge(a,
  section[(i+1)%section.length],original));
 const corners=section.map((_,i)=>miter(
  edges[(i+section.length-1)%section.length],edges[i],width));
 const tiles=[],soffit=[],fascia=[];
 let exteriorEdges=0,excludedInteriorEdges=0,maxActualOverhang=0;
 let closedEndCaps=0,unnecessaryCapsAvoided=0;
 const inner=(p,y)=>({x:p.x,y,z:p.z,u:p.x*.23,v:p.z*.23});
 const bottom=p=>({...p,y:p.y-thickness});
 for(let i=0;i<section.length;i++){
  const normal=edges[i];
  if(!normal){excludedInteriorEdges++;continue}
  const a=section[i],b=section[(i+1)%section.length];
  if(Math.hypot(b.x-a.x,b.z-a.z)<.05)continue;
  exteriorEdges++;
  const first=corners[i],last=corners[(i+1)%section.length];
  const c={x:b.x+last.x,z:b.z+last.z};
  const d={x:a.x+first.x,z:a.z+first.z};
  maxActualOverhang=Math.max(maxActualOverhang,
   Math.hypot(first.x,first.z),Math.hypot(last.x,last.z));
  // The eave is a single planar slope in the outward-normal direction.
  const y=p=>roof.eaveY-.055*((p.x-a.x)*normal.nx+
   (p.z-a.z)*normal.nz)/width;
  const a0=inner(a,roof.eaveY),b0=inner(b,roof.eaveY);
  const c0=inner(c,y(c)),d0=inner(d,y(d));
  const cross2=(p,q,r)=>(q.x-p.x)*(r.z-p.z)-
   (q.z-p.z)*(r.x-p.x);
  // A self-crossing overhang is worse than no overhang. Fall back to the
  // bounded roof surface (not a giant black inverted roof triangle).
  const k1=cross2(a0,b0,c0),k2=cross2(a0,c0,d0);
  if(Math.abs(k1)<1e-7||Math.abs(k2)<1e-7||
   Math.sign(k1)!==Math.sign(k2))return null;
  quad(tiles,a0,b0,c0,d0);
  quad(soffit,bottom(d0),bottom(c0),bottom(b0),bottom(a0));
  quad(fascia,d0,c0,bottom(c0),bottom(d0));
  const close=(inside,outside,reverse)=>{
   const p0=inner(inside,roof.eaveY);
   const p1=inner(outside,y(outside));
   if(reverse)quad(fascia,p1,p0,bottom(p0),bottom(p1));
   else quad(fascia,p0,p1,bottom(p1),bottom(p0));
   closedEndCaps++;
  };
  if(!edges[(i+section.length-1)%section.length])close(a,d,false);
  else unnecessaryCapsAvoided++;
  if(!edges[(i+1)%section.length])close(b,c,true);
  else unnecessaryCapsAvoided++;
 }
 if(!exteriorEdges||!tiles.length)return null;
 return {tiles,soffit,fascia,exteriorEdges,excludedInteriorEdges,width,
  thickness,maxActualOverhang,closedUnderside:true,
  onlyMappedExterior:true,faceRegions:exteriorEdges,
  closedEndCaps,unnecessaryCapsAvoided,exactPlanePartitions:true,
  perimeterSafe:true};
}
export function planStationRoofEaves({outline,originalOutline,roof,origin,
 width=.32,thickness=.10}={}){
 if(roof?.roofModel==='perimeter-constrained')
  return planPerimeterRoofEaves({outline,originalOutline,roof,width,thickness});
 const section=ring(outline),original=ring(originalOutline);
 if(!section||!original||!roof?.bounds||!roof?.globalAxis||!origin||
  !Number.isFinite(origin.x)||!Number.isFinite(origin.z)||
  !['hip','gable'].includes(roof.kind)||!Number.isFinite(roof.eaveY)||
  !Number.isFinite(roof.ridgeY)||!(roof.ridgeY>roof.eaveY)||
  !Number.isFinite(width)||width<.10||width>.65||
  !Number.isFinite(thickness)||thickness<.04||thickness>.20)return null;
 const edges=section.map((a,i)=>stationExteriorEdge(a,
  section[(i+1)%section.length],original));
 const corners=section.map((_,i)=>miter(edges[(i+section.length-1)%section.length],edges[i],width));
 const planes=roofPlanes(roof,origin),rise=roof.ridgeY-roof.eaveY;
 const yAt=p=>roof.eaveY+rise*Math.min(...planes.map(f=>f(p)));
 const top=p=>{
  const dx=p.x-origin.x,dz=p.z-origin.z;
  const {ax,az}=roof.globalAxis;
  return {...p,y:yAt(p),u:(dx*ax+dz*az)*.23,v:(-dx*az+dz*ax)*.23};
 };
 const bottom=p=>({...p,y:p.y-thickness});
 const tiles=[],soffit=[],fascia=[];
 let exteriorEdges=0,excludedInteriorEdges=0,maxActualOverhang=0,faceRegions=0;
 let closedEndCaps=0,unnecessaryCapsAvoided=0;
 for(let i=0;i<section.length;i++){
  const normal=edges[i];
  if(!normal){excludedInteriorEdges++;continue}
  const a=section[i],b=section[(i+1)%section.length],len=Math.hypot(b.x-a.x,b.z-a.z);
  if(len<.05)continue;
  exteriorEdges++;
  const start=corners[i],end=corners[(i+1)%section.length];
  const c={x:b.x+end.x,z:b.z+end.z},d={x:a.x+start.x,z:a.z+start.z};
  maxActualOverhang=Math.max(maxActualOverhang,Math.hypot(start.x,start.z),Math.hypot(end.x,end.z));
  // A strip quad is partitioned by EXACTLY the same four (or two) roof
  // planes as the original tiled surface: no nonplanar bent triangles.
  const strip=[a,b,c,d];
  for(let plane=0;plane<planes.length;plane++){
   let region=strip.slice();
   for(let j=0;j<planes.length&&region.length>=3;j++){
    if(plane!==j)region=clipBelow(region,planes[plane],planes[j]);
   }
   if(region.length<3)continue;
   faceRegions++;
   const t=region.map(top);
   for(let k=1;k<t.length-1;k++){
    addTriangle(tiles,t[0],t[k],t[k+1]);
    addTriangle(soffit,bottom(t[0]),bottom(t[k+1]),bottom(t[k]));
   }
  }
  // The fascia must follow true plane intersections on the OUTER edge.
  const cuts=cutsOnSegment(d,c,planes);
  for(let j=1;j<cuts.length;j++){
   const p=top(mix(d,c,cuts[j-1])),q=top(mix(d,c,cuts[j]));
   quad(fascia,p,q,bottom(q),bottom(p));
  }
  // Previous version added an end-cap at EVERY OSM vertex even when
  // the next outer wall continues with the same eave. Those tiny dark
  // squares caused most of the visible steps and fake roof tabs.
  const addCap=(inside,outside,reverse)=>{
   const ts=cutsOnSegment(inside,outside,planes);
   for(let j=1;j<ts.length;j++){
    const a0=top(mix(inside,outside,ts[j-1]));
    const a1=top(mix(inside,outside,ts[j]));
    if(reverse)quad(fascia,a1,a0,bottom(a0),bottom(a1));
    else quad(fascia,a0,a1,bottom(a1),bottom(a0));
   }
   closedEndCaps++;
  };
  if(!edges[(i+section.length-1)%section.length])addCap(a,d,false);
  else unnecessaryCapsAvoided++;
  if(!edges[(i+1)%section.length])addCap(b,c,true);
  else unnecessaryCapsAvoided++;
 }
 return {tiles,soffit,fascia,exteriorEdges,excludedInteriorEdges,
  width,thickness,maxActualOverhang,closedUnderside:true,
  onlyMappedExterior:true,faceRegions,closedEndCaps,
  unnecessaryCapsAvoided,exactPlanePartitions:true};
}
