// Milovice RP 5.36 - citywide facade attachment contract.
// Geometry only; common to instanced placeholder windows and cut-out hero
// facades. A facade's true surface is an OSM polygon edge, not a guessed
// 40-60cm shell around that edge. Coordinates use world X/Z (OSM Vector2 y).
const xy=p=>({x:p?.x,z:p?.z??p?.y});
export function exteriorFacadeFrame(outline,index){
 if(!Array.isArray(outline)||outline.length<3||
  !Number.isInteger(index)||index<0||index>=outline.length)return null;
 let points=outline.map(xy);
 if(points.some(p=>!Number.isFinite(p.x)||!Number.isFinite(p.z)))return null;
 if(points.length>3&&Math.hypot(points[0].x-points.at(-1).x,
  points[0].z-points.at(-1).z)<.05)points=points.slice(0,-1);
 if(index>=points.length)return null;
 let signedArea=0;
 for(let j=0;j<points.length;j++){
  const p=points[j],q=points[(j+1)%points.length];
  signedArea+=p.x*q.z-q.x*p.z;
 }
 if(Math.abs(signedArea)<.05)return null;
 const a=points[index],b=points[(index+1)%points.length];
 const dx=b.x-a.x,dz=b.z-a.z,len=Math.hypot(dx,dz);
 if(len<.08||len>140)return null;
 const ux=dx/len,uz=dz/len;
 // CCW polygon: interior is left of every edge, exterior is right.
 // CW polygon: exterior is left. This also works for concave/reentrant
 // walls, where centroid-to-edge heuristics may point INSIDE the house.
 const nx=(signedArea>0?uz:-uz),nz=(signedArea>0?-ux:ux);
 return {a,b,index,length:len,len,ux,uz,nx,nz,
  mx:(a.x+b.x)*.5,mz:(a.z+b.z)*.5,
  yaw:Math.atan2(nx,nz),polygonOrientation:signedArea>0?'CCW':'CW'};
}
export function facadePoint(frame,along=0,offset=0){
 if(!frame||![along,offset].every(Number.isFinite))return null;
 return {x:frame.mx+frame.ux*along+frame.nx*offset,
  z:frame.mz+frame.uz*along+frame.nz*offset};
}
// Place the BACK of a boxed ornament 1cm against / into the wall.
// For a flush pane without thickness, use FACE_PLANE instead.
export function flushBoxOffset(thickness,extra=.008){
 if(!Number.isFinite(thickness)||thickness<=0||
  !Number.isFinite(extra)||extra<-.05||extra>.08)return null;
 return thickness*.5+extra;
}
export const FACE_PLANE=.024; // overlay for ordinary (solid-wall) buildings
export const RECESSED_GLAZING=-.085; // for hero facade with true wall cutouts
export function facadeGap(frame,point,thickness=0){
 if(!frame||!point||!Number.isFinite(point.x)||
  !Number.isFinite(point.z)||!Number.isFinite(thickness))return Infinity;
 const d=(point.x-frame.mx)*frame.nx+(point.z-frame.mz)*frame.nz;
 return d-thickness*.5;
}
