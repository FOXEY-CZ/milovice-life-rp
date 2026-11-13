// Milovice RP v5.28.4 — shared, deterministic roof geometry for OSM houses.
// The former generic hip generator made a cone-like fan to an arbitrary
// vertex-average; the former 4-point gable assumed OSM corners were ordered
// a particular way. Both could turn roof planes inside-out on rotated sites.
// Build real bounded planar gable/hip facets instead, clipped to OSM triangles.
import {planFootprintPitchedRoof} from './station-roof-geometry.js';

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
export function planCityBuildingRoof({footprint,triangles,baseY,rise,
 kind='hip'}={}){
 const axis=dominantRoofAxis(footprint);
 if(!axis||!Array.isArray(triangles)||triangles.length<1||
  !Number.isFinite(baseY)||!Number.isFinite(rise)||rise<=0)return null;
 const pts=footprint.map(coord);
 const origin={x:pts.reduce((s,p)=>s+p.x,0)/pts.length,
  z:pts.reduce((s,p)=>s+p.z,0)/pts.length};
 const model=planFootprintPitchedRoof({
  triangles,origin,axis,kind,eaveY:baseY,rise
 });
 if(!model||model.relativeAreaError>1e-4||!model.faces.length||
  model.faces.some(face=>face.some(p=>!Number.isFinite(p.y))))return null;
 return {...model,origin,kind,globalAxis:axis};
}
