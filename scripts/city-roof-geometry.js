// Milovice RP v5.28.5 — shared, deterministic roof geometry for OSM houses.
// The former generic hip generator made a cone-like fan to an arbitrary
// vertex-average; the former 4-point gable assumed OSM corners were ordered
// a particular way. Both could turn roof planes inside-out on rotated sites.
// Build real bounded planar gable/hip facets instead, clipped to OSM triangles.
import {planFootprintPitchedRoof} from './station-roof-geometry.js';
import {planPerimeterConstrainedRoof,roofBoundaryGap} from './perimeter-roof-envelope.js';

function coord(p){return {x:p.x,z:p.z??p.y}}
function safeUnit(x,z){
 const length=Math.hypot(x,z);
 if(!Number.isFinite(length)||length<1e-7)return null;
 const ax=x/length,az=z/length;
 return ax<-.000001||(Math.abs(ax)<=.000001&&az<0)?
  {ax:-ax,az:-az}:{ax,az};
}
export function dominantRoofAxis(footprint){
 if(!Array.isArray(footprint)||footprint.length<3)return null;
 const pts=footprint.map(coord);
 if(pts.some(p=>!Number.isFinite(p.x)||!Number.isFinite(p.z)))return null;
 if(pts.length>3&&Math.hypot(pts[0].x-pts.at(-1).x,
  pts[0].z-pts.at(-1).z)<.01)pts.pop();
 if(pts.length<3)return null;
 const cx=pts.reduce((n,p)=>n+p.x,0)/pts.length;
 const cz=pts.reduce((n,p)=>n+p.z,0)/pts.length;
 let xx=0,zz=0,xz=0,maxLen=0,maxEdge=null;
 for(let i=0;i<pts.length;i++){
  const p=pts[i],b=pts[(i+1)%pts.length],dx=p.x-cx,dz=p.z-cz;
  xx+=dx*dx;zz+=dz*dz;xz+=dx*dz;
  const edx=b.x-p.x,edz=b.z-p.z,len=Math.hypot(edx,edz);
  if(len>maxLen){maxLen=len;maxEdge=safeUnit(edx,edz)}
 }
 if(!maxEdge)return null;
 const angle=.5*Math.atan2(2*xz,xx-zz);
 const principal=safeUnit(Math.cos(angle),Math.sin(angle));
 const separation=Math.hypot(xx-zz,2*xz)/(xx+zz||1);
 // Square/near-square polygons: there is no unique major axis, so pick
 // the longest measured cadastral edge rather than random PCA flips.
 if(separation<.18||pts.length===4)return maxEdge;
 // For split-edged irregular footprints, keep PCA on long coherent forms.
 // When the longest edge agrees with PCA, prefer the explicit wall bearing.
 const same=Math.abs(principal.ax*maxEdge.ax+principal.az*maxEdge.az);
 return same>.94?maxEdge:principal;
}

/**
 * Four OSM corners do not guarantee a rectangular building. Never generate
 * auto gables on skewed quadrilaterals: the roof and end-wall wedges must
 * agree on the same two measured-looking perpendicular facade edges.
 * Verified gables may be square, but still require rectangular walls.
 */
export function analyzeGableFootprint(footprint,{allowSquare=false}={}){
 if(!Array.isArray(footprint)||footprint.length<4)return null;
 const pts=footprint.map(coord);
 if(pts.length===5&&Math.hypot(pts[0].x-pts[4].x,
  pts[0].z-pts[4].z)<.05)pts.pop();
 if(pts.length!==4||pts.some(p=>!Number.isFinite(p.x)||!Number.isFinite(p.z)))return null;
 const edges=pts.map((a,i)=>{
  const b=pts[(i+1)%4],dx=b.x-a.x,dz=b.z-a.z,len=Math.hypot(dx,dz);
  return {len,ux:dx/len,uz:dz/len};
 });
 if(edges.some(e=>!Number.isFinite(e.len)||e.len<2.2||e.len>65))return null;
 for(let i=0;i<4;i++){
  const a=edges[i],b=edges[(i+1)%4];
  if(Math.abs(a.ux*b.ux+a.uz*b.uz)>.17)return null;
 }
 for(let i=0;i<2;i++){
  const a=edges[i],b=edges[i+2];
  if(Math.abs(a.ux*b.ux+a.uz*b.uz)<.985||
   Math.abs(a.len-b.len)/Math.max(a.len,b.len)>.18)return null;
 }
 const sideA=(edges[0].len+edges[2].len)*.5;
 const sideB=(edges[1].len+edges[3].len)*.5;
 const aspect=Math.max(sideA,sideB)/Math.min(sideA,sideB);
 if(!allowSquare&&aspect<1.18)return null;
 const axis=dominantRoofAxis(pts);
 if(!axis)return null;
 const endIndices=edges.map((e,i)=>({i,
  parallel:Math.abs(e.ux*axis.ax+e.uz*axis.az)}))
  .filter(e=>e.parallel<.17).map(e=>e.i);
 if(endIndices.length!==2||(endIndices[0]+2)%4!==endIndices[1])return null;
 return {axis,endIndices,length:Math.max(sideA,sideB),
  width:Math.min(sideA,sideB),aspect};
}

export function planCityBuildingRoof({footprint,triangles,baseY,rise,
 kind='hip'}={}){
 const axis=dominantRoofAxis(footprint);
 if(!axis||!Array.isArray(triangles)||triangles.length<1||
  !Number.isFinite(baseY)||!Number.isFinite(rise)||rise<=0)return null;
 const pts=footprint.map(coord);
 const origin={x:pts.reduce((s,p)=>s+p.x,0)/pts.length,
  z:pts.reduce((s,p)=>s+p.z,0)/pts.length};
 // Try the exact-footprint, perimeter-constrained hip if the ordinary
 // affine planes fail area/finite tests. Previously we returned null here,
 // and the caller silently replaced complex 20+ edge roofs with FLAT caps.
 // The fallback retains the OSM perimeter, seals every eave and is marked
 // provisional unless a photographic roof profile has been reviewed.
 const safeHip=(reason,gap=0)=>{
  if(kind!=='hip')return null;
  const corrected=planPerimeterConstrainedRoof({
   footprint:pts,triangles,baseY,rise,axis,kind
  });
  if(!corrected||corrected.maxEaveError>.025)return null;
  return {...corrected,kind,roofBoundaryGapBefore:gap,
   correctedBoundaryGap:corrected.maxEaveError,
   sourceProfileRequired:true,reasonForConstrainedFallback:reason};
 };
 const model=planFootprintPitchedRoof({
  triangles,origin,axis,kind,eaveY:baseY,rise
 });
 if(!model||model.relativeAreaError>1e-4||!model.faces.length||
  model.faces.some(face=>face.some(p=>!Number.isFinite(p.y))))
  return safeHip('invalid-affine-plan');
 // Boundary-height QUALITY GATE for every future building:
 // a basic bounding-box hip is not valid on many skewed, L or
 // cut-corner footprints. Its apparent eave can end >1m above the wall,
 // producing huge exposed triangular panels and dark roof flaps.
 const gap=roofBoundaryGap({...model,origin},pts);
 if(!Number.isFinite(gap))return safeHip('invalid-boundary-gap');
 if(kind==='hip'&&gap>.10){
  // For a complex U/T/22-edge outline, the global hip can float metres
  // above real wall edges. Substitute an area-conserving local roof instead.
  return safeHip('eave-does-not-follow-OSM-wall',gap);
 }
 return {...model,origin,kind,globalAxis:axis,roofBoundaryGapBefore:gap};
}
