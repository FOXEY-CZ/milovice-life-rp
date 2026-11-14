// Milovice RP Roof System 3.2 / 5.49 — shared perimeter-safe fallback for
// irregular OSM building outlines. OSM does not identify the actual roof:
// this deliberately provisional surface prevents elevated/flapping eaves
// until a source-approved architectural roof profile is available.
// No Three.js dependency, no runtime per-frame allocations.
const EPS=1e-8;
const xy=p=>({x:p.x,z:p.z??p.y});
const cross=(a,b,c)=>(b.x-a.x)*(c.z-a.z)-(b.z-a.z)*(c.x-a.x);
const area=t=>Math.abs(cross(t[0],t[1],t[2]))*.5;
const lerp=(a,b,t)=>a+(b-a)*t;
function cleanRing(input){
 if(!Array.isArray(input)||input.length<3||input.length>100)return null;
 const pts=input.map(xy);
 if(pts.some(p=>!Number.isFinite(p.x)||!Number.isFinite(p.z)))return null;
 if(pts.length>3&&Math.hypot(pts[0].x-pts.at(-1).x,pts[0].z-pts.at(-1).z)<.02)pts.pop();
 if(pts.length<3||pts.some((p,i)=>Math.hypot(
  p.x-pts[(i+1)%pts.length].x,p.z-pts[(i+1)%pts.length].z)<.05))return null;
 let total=0;
 for(let i=0;i<pts.length;i++){
  const a=pts[i],b=pts[(i+1)%pts.length];
  total+=a.x*b.z-b.x*a.z;
 }
 return Math.abs(total)>2?{pts,area:Math.abs(total)*.5}:null;
}
function segmentDistance(p,a,b){
 const dx=b.x-a.x,dz=b.z-a.z;
 const t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.z-a.z)*dz)/(dx*dx+dz*dz)));
 return Math.hypot(p.x-a.x-dx*t,p.z-a.z-dz*t);
}
function distanceToExterior(p,ring){
 let d=Infinity;
 for(let i=0;i<ring.length;i++)
  d=Math.min(d,segmentDistance(p,ring[i],ring[(i+1)%ring.length]));
 return d;
}
function modelHeight(roof,p){
 return roof.eaveY+Math.min(roof.rise,
  distanceToExterior(p,roof.perimeterOutline)*roof.envelopeSlope);
}
/** Return the maximum rise ABOVE the true exterior facade edge. The
 *  generic two/four-plane hip can be safe for rectangles but unsafe for
 *  stepped, angled, notched or non-orthogonal polygons. */
export function roofBoundaryGap(roof,footprint){
 const shape=cleanRing(footprint);
 if(!shape||!roof?.bounds||!roof?.globalAxis||!roof?.origin||
   !['hip','gable'].includes(roof.kind))return Infinity;
 const {minS,maxS,minT,maxT}=roof.bounds;
 const {ax,az}=roof.globalAxis,o=roof.origin;
 const midT=(minT+maxT)*.5;
 if(!(midT>minT&&maxT>midT&&roof.endInset>0))return Infinity;
 const height=p=>{
  const dx=p.x-o.x,dz=p.z-o.z;
  const s=dx*ax+dz*az,t=-dx*az+dz*ax;
  const planes=[(t-minT)/(midT-minT),(maxT-t)/(maxT-midT)];
  if(roof.kind==='hip')planes.push((s-minS)/roof.endInset,(maxS-s)/roof.endInset);
  return roof.eaveY+(roof.ridgeY-roof.eaveY)*
   Math.max(0,Math.min(1,...planes));
 };
 let gap=0;
 for(let i=0;i<shape.pts.length;i++){
  const a=shape.pts[i],b=shape.pts[(i+1)%shape.pts.length];
  for(const t of [0,.25,.5,.75,1]){
   const v=height({x:lerp(a.x,b.x,t),z:lerp(a.z,b.z,t)});
   if(!Number.isFinite(v))return Infinity;
   gap=Math.max(gap,v-roof.eaveY);
  }
 }
 return gap;
}
/**
 * Triangulate an eave-height-constrained height field over the REAL
 * source triangles, never over a footprint bounding rectangle.
 * All subdivided source triangle edges use the SAME N, guaranteeing
 * crack-free shared subdivisions even with reversed polygon winding.
 * Boundary vertices lie on eaveY exactly, not 1+ metre above the walls.
 */
export function planPerimeterConstrainedRoof({footprint,triangles,baseY,rise,
 axis=null,kind='hip',subdivisions=null}={}){
 const shape=cleanRing(footprint);
 if(!shape||!Array.isArray(triangles)||!triangles.length||triangles.length>100||
  !Number.isFinite(baseY)||!Number.isFinite(rise)||rise<=0||rise>12||
  kind!=='hip')return null;
 const outline=shape.pts;
 const source=triangles.map(t=>Array.isArray(t)?t.map(xy):[]);
 if(source.some(t=>t.length!==3||t.some(p=>!Number.isFinite(p.x)||
  !Number.isFinite(p.z))))return null;
 const sourceArea=source.reduce((sum,t)=>sum+area(t),0);
 if(sourceArea<2||Math.abs(sourceArea-shape.area)>Math.max(.03,shape.area*.002))return null;
 const origin={x:outline.reduce((sum,p)=>sum+p.x,0)/outline.length,
  z:outline.reduce((sum,p)=>sum+p.z,0)/outline.length};
 const ax=axis&&Number.isFinite(axis.ax)&&Number.isFinite(axis.az)?
  axis.ax:1,az=axis&&Number.isFinite(axis.az)?axis.az:0;
 const norm=Math.hypot(ax,az);
 if(norm<.9)return null;
 const local=outline.map(p=>{
  const dx=p.x-origin.x,dz=p.z-origin.z;
  return {s:(dx*ax+dz*az)/norm,t:(-dx*az+dz*ax)/norm};
 });
 const sSpan=Math.max(...local.map(p=>p.s))-Math.min(...local.map(p=>p.s));
 const tSpan=Math.max(...local.map(p=>p.t))-Math.min(...local.map(p=>p.t));
 const narrow=Math.min(sSpan,tSpan);
 if(narrow<1)return null;
 // Calibrate pitch to actual generated samples, not the bounding box.
 // On a 22-wall school roof the old target 1.85m rendered only .71m.
 const n=subdivisions===null?
  Math.min(5,Math.max(2,Math.ceil(Math.sqrt(shape.area)/3.2))):subdivisions;
 if(!Number.isInteger(n)||n<1||n>7)return null;
 let maxReach=0;
 for(const tri of source)for(let i=0;i<=n;i++)for(let j=0;j<=n-i;j++){
  const u=i/n,v=j/n;
  const p={x:tri[0].x*(1-u-v)+tri[1].x*u+tri[2].x*v,
   z:tri[0].z*(1-u-v)+tri[1].z*u+tri[2].z*v};
  maxReach=Math.max(maxReach,distanceToExterior(p,outline));
 }
 if(maxReach<.05)return null;
 const requestedSlope=rise/maxReach;
 const envelopeSlope=Math.min(1.0,requestedSlope);
 const slopeClamped=envelopeSlope<requestedSlope-1e-8;
 const roof={kind:'hip',roofModel:'perimeter-constrained',source:'OSM provisional envelope',
  perimeterOutline:outline,envelopeSlope,rise,eaveY:baseY,ridgeY:baseY+rise,
  origin,globalAxis:{ax:ax/norm,az:az/norm},subdivisions:n};
 const faces=[];
 let outputArea=0;
 for(const tri of source){
  if(area(tri)<1e-9)continue;
  const sample=(i,j)=>{
   const u=i/n,v=j/n;
   const x=tri[0].x*(1-u-v)+tri[1].x*u+tri[2].x*v;
   const z=tri[0].z*(1-u-v)+tri[1].z*u+tri[2].z*v;
   const p={x,z},y=modelHeight(roof,p);
   return {x,y,z,u:x*.23,v:z*.23};
  };
  const grid=[];
  for(let i=0;i<=n;i++){
   grid[i]=[];
   for(let j=0;j<=n-i;j++)grid[i][j]=sample(i,j);
  }
  const emit=(a,b,c)=>{
   const flatArea=area([a,b,c]);
   if(flatArea<1e-8)return;
   outputArea+=flatArea;
   faces.push([a,b,c]);
  };
  for(let i=0;i<n;i++)for(let j=0;j<n-i;j++){
   const a=grid[i][j],b=grid[i+1][j],c=grid[i][j+1];
   emit(a,b,c);
   if(i+j<n-1)emit(b,grid[i+1][j+1],c);
  }
 }
 let actualRise=0;
 for(const face of faces)for(const p of face)
  actualRise=Math.max(actualRise,p.y-baseY);
 const relativeAreaError=Math.abs(outputArea-sourceArea)/sourceArea;
 if(!faces.length||relativeAreaError>1e-4||
  faces.some(f=>f.some(p=>!Number.isFinite(p.y)||
   p.y<baseY-.00001||p.y>baseY+rise+.00001)))return null;
 return {...roof,faces,sourceArea,outputArea,relativeAreaError,
  maxPerimeterOvershoot:0,verifiedAppearance:false,
  actualRise,requestedRise:rise,slopeClamped,maxInteriorReach:maxReach,
  originalArea:shape.area,triangles:faces.length,
  maxEaveError:roofBoundaryGapFromSurface(roof)};
}
function roofBoundaryGapFromSurface(roof){
 let largest=0;
 const pts=roof.perimeterOutline;
 for(let i=0;i<pts.length;i++){
  const a=pts[i],b=pts[(i+1)%pts.length];
  for(const t of [0,.25,.5,.75,1]){
   const p={x:lerp(a.x,b.x,t),z:lerp(a.z,b.z,t)};
   largest=Math.max(largest,Math.abs(modelHeight(roof,p)-roof.eaveY));
  }
 }
 return largest;
}
/** Interpolate the actually rendered triangles, not merely an idealised
 * distance field. Dormer back closures then meet the displayed surface. */
export function samplePerimeterRoofHeight(roof,p){
 if(roof?.roofModel!=='perimeter-constrained'||!Array.isArray(roof.faces)||
  !Number.isFinite(p?.x)||!Number.isFinite(p?.z))return null;
 for(const [a,b,c] of roof.faces){
  const den=cross(a,b,c);
  if(Math.abs(den)<EPS)continue;
  const u=cross(a,p,c)/den,v=cross(a,b,p)/den;
  const w=1-u-v;
  if(u>=-1e-6&&v>=-1e-6&&w>=-1e-6)
   return w*a.y+u*b.y+v*c.y;
 }
 // A feature's overhang may land just outside the mapped wall. No
 // fictitious high ridge may be extrapolated beyond the real footprint.
 return distanceToExterior(p,roof.perimeterOutline)<.45?roof.eaveY:null;
}
