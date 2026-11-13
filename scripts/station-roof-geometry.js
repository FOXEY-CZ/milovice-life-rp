// Milovice RP 5.28.2 — footprint-constrained pitched station roof.
// All faces are CLIPPED to triangles from the real OSM building footprint.
// Never infer independent PCA axes for a clipped wing/raised center — the
// entire building has ONE longitudinal axis.
// Pure math; no THREE dependency, suitable for geometry regression tests.
const EPS=1e-9;
function finite(v){return Number.isFinite(v)}
function area2(a,b,c){return (b.s-a.s)*(c.t-a.t)-(b.t-a.t)*(c.s-a.s)}
function areaPoly(points){
 let sum=0;
 for(let i=0;i<points.length;i++){
  const a=points[i],b=points[(i+1)%points.length];
  sum+=a.s*b.t-b.s*a.t;
 }
 return Math.abs(sum*.5);
}
// Split convex triangle/polygon where this roof plane is lower than another.
// This prevents roof triangles crossing outside the actual concave footprint.
function clipBelow(poly,first,second){
 if(poly.length<3)return [];
 const output=[];
 for(let i=0;i<poly.length;i++){
  const a=poly[i],b=poly[(i+1)%poly.length];
  const da=first(a)-second(a),db=first(b)-second(b);
  const insideA=da<=EPS,insideB=db<=EPS;
  if(insideA)output.push(a);
  if(insideA!==insideB){
   const t=da/(da-db);
   output.push({s:a.s+(b.s-a.s)*t,t:a.t+(b.t-a.t)*t});
  }
 }
 const unique=[];
 for(const p of output){
  if(!unique.length||Math.hypot(p.s-unique[unique.length-1].s,
   p.t-unique[unique.length-1].t)>EPS)unique.push(p);
 }
 if(unique.length>1&&Math.hypot(unique[0].s-unique.at(-1).s,
  unique[0].t-unique.at(-1).t)<=EPS)unique.pop();
 return unique.length>=3&&areaPoly(unique)>1e-9?unique:[];
}
function local(p,origin,ax,az){
 const dx=p.x-origin.x,dz=p.z-origin.z;
 return {s:dx*ax+dz*az,t:-dx*az+dz*ax};
}
function world(p,origin,ax,az,y){
 return {x:origin.x+ax*p.s-az*p.t,y,
  z:origin.z+az*p.s+ax*p.t,
  u:p.s*.23,v:p.t*.23};
}
export function planFootprintPitchedRoof({triangles,origin,axis,kind='gable',
 eaveY,rise,roofInsets=null}={}){
 if(!Array.isArray(triangles)||!triangles.length||
  !origin||!axis||!finite(origin.x)||!finite(origin.z)||
  !finite(axis.ax)||!finite(axis.az)||!finite(eaveY)||
  !finite(rise)||rise<=0||!['gable','hip'].includes(kind))return null;
 const norm=Math.hypot(axis.ax,axis.az);
 if(Math.abs(norm-1)>.02)return null;
 const ax=axis.ax/norm,az=axis.az/norm;
 const transformed=triangles.map(tri=>tri.map(p=>local(p,origin,ax,az)));
 if(transformed.some(t=>t.length!==3||t.some(p=>!finite(p.s)||!finite(p.t))))return null;
 const all=transformed.flat();
 const minS=Math.min(...all.map(p=>p.s)),maxS=Math.max(...all.map(p=>p.s));
 const minT=Math.min(...all.map(p=>p.t)),maxT=Math.max(...all.map(p=>p.t));
 const sSpan=maxS-minS,tSpan=maxT-minT;
 if(sSpan<1||tSpan<1)return null;
 const midT=(minT+maxT)*.5;
 const endInset=Math.max(.4,Math.min(2.1,sSpan*.28));
 // Each f is an affine plane. The MINIMUM of these 2 or 4 planes forms
 // a continuous gable or hip with no rectangular roof billboard/cap.
 const planes=[
  p=>(p.t-minT)/(midT-minT),
  p=>(maxT-p.t)/(maxT-midT)
 ];
 if(kind==='hip'){
  planes.push(p=>(p.s-minS)/endInset);
  planes.push(p=>(maxS-p.s)/endInset);
 }
 const faces=[];let sourceArea=0,outputArea=0,partitions=0;
 for(const t of transformed){
  const ta=Math.abs(area2(t[0],t[1],t[2]))*.5;
  if(ta<=1e-9)continue;
  sourceArea+=ta;
  for(let i=0;i<planes.length;i++){
   let region=t.slice();
   for(let j=0;j<planes.length&&region.length>=3;j++){
    if(j===i)continue;
    region=clipBelow(region,planes[i],planes[j]);
   }
   if(region.length<3)continue;
   partitions++;
   outputArea+=areaPoly(region);
   const height=p=>eaveY+rise*Math.max(0,Math.min(1,planes[i](p)));
   for(let j=1;j<region.length-1;j++){
    const patch=[region[0],region[j],region[j+1]];
    if(Math.abs(area2(...patch))<1e-9)continue;
    faces.push(patch.map(p=>world(p,origin,ax,az,height(p))));
   }
  }
 }
 const delta=Math.abs(outputArea-sourceArea);
 return {kind,faces,sections:partitions,triangles:faces.length,
  sourceArea,outputArea,relativeAreaError:delta/Math.max(1,sourceArea),
  maxPerimeterOvershoot:0, // All regions are sub-polygons of source triangles.
  globalAxis:{ax,az},bounds:{minS,maxS,minT,maxT},
  eaveY,ridgeY:eaveY+rise,endInset,roofInsets};
}
