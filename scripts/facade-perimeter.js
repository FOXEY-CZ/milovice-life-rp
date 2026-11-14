import {flushBoxOffset} from './facade-anchors.js';
// Every actual non-degenerate OSM polygon edge has a physical wall.
// Short returns/chamfers must be SEALED, but get no invented windows,
// door slots or decorative facade rows.
export function classifyFacadeEdgeLength(length,{
 minValid=.08,detailThreshold=3,maxLength=70
}={}){
 if(!Number.isFinite(length)||length<minValid||length>maxLength)return 'degenerate';
 return length<detailThreshold?'solid-return':'detailed';
}

/**
 * One facade trim contract for BOTH long decorated walls and short exterior
 * returns. A repair may replace wall geometry, but must never skip the
 * matching plinth or the upper continuous band. All positions are world-space
 * and all widths follow the real OSM exterior edge (not a bounding box).
 *
 * The tiny overlap at corners makes adjacent instanced bands meet even where
 * the edge normals differ. No new draw materials are needed.
 */
export function planFacadePerimeterTrims(a,b,centroid,{
 base=0,height=3,cornerOverlap=.08,frame=null
}={}){
 const z=p=>p?.z??p?.y;
 const az=z(a),bz=z(b),cz=z(centroid);
 if(![a?.x,az,b?.x,bz,centroid?.x,cz,base,height,cornerOverlap]
  .every(Number.isFinite)||height<1||cornerOverlap<0||cornerOverlap>.16)return null;
 const dx=b.x-a.x,dz=bz-az,len=Math.hypot(dx,dz);
 if(classifyFacadeEdgeLength(len)==='degenerate')return null;
 const ux=dx/len,uz=dz/len,mx=(a.x+b.x)*.5,mz=(az+bz)*.5;
 let nx=-uz,nz=ux;
 if(frame){
  // The same winding-derived exterior normal as the windows/doors.
  // A concave building centroid may lie on the wrong side of a return.
  if(!Number.isFinite(frame.nx)||!Number.isFinite(frame.nz)||
   Math.hypot(frame.nx,frame.nz)<.99)return null;
  nx=frame.nx;nz=frame.nz;
 }else if(nx*(mx-centroid.x)+nz*(mz-cz)<0){
  nx=-nx;nz=-nz;
 }
 const yaw=Math.atan2(nx,nz);
 const width=len+2*Math.min(cornerOverlap,len*.08);
 const band=(kind,offset,y,h,depth)=>({
  kind,x:mx+nx*offset,y,z:mz+nz*offset,
  width,height:h,depth,yaw
 });
 return {length:len,ux,uz,nx,nz,mx,mz,yaw,
  base:band('base',.085,base+.23,.46,.16),
  upper:band('sill',.148,base+height-.12,.20,.28)};
}

/**
 * One physically wall-attached, photograph-supported pale eave cornice
 * around the whole Školská 220/1 OSM perimeter.
 *
 * 5.41 placed its 14 cm strip in the last 6-20 cm below roof level.
 * The solid hip-roof fascia/soffit covers that narrow slice in a real
 * street-level view: the instanced mesh existed but the trim LOOKED missing.
 *
 * This revision places the SAME single cornice fully BELOW the roof's
 * overhanging fascia. It extends 21 cm toward the viewer, with a 12 mm
 * intrusion into the actual masonry wall. One strip replaces the common
 * upper band; never add a second floating photographic overlay.
 */
export function planPhotographedEaveCornice(frame,{
 base=0,height=3.75,depth=.22,profileHeight=.16,
 dropBelowEave=.30,overlap=.055
}={}){
 if(!frame||![frame.len,frame.mx,frame.mz,frame.nx,frame.nz,
  frame.yaw,base,height,depth,profileHeight,dropBelowEave,overlap]
  .every(Number.isFinite)||
  frame.len<.08||frame.len>140||height<2.3||
  depth<.12||depth>.40||profileHeight<.08||profileHeight>.25||
  dropBelowEave<.20||dropBelowEave>.55||
  dropBelowEave-profileHeight*.5<.13||
  overlap<0||overlap>.1)return null;
 const offset=flushBoxOffset(depth,-.012);
 return {
  kind:'frame',
  width:frame.len+2*Math.min(overlap,frame.len*.02),
  x:frame.mx+frame.nx*offset,z:frame.mz+frame.nz*offset,
  y:base+height-dropBelowEave,
  height:profileHeight,depth,yaw:frame.yaw,
  // Numerical visibility audit checks the actual front face of geometry,
  // not merely that the trim was queued in an instanced material.
  visibleBelowEave:dropBelowEave-profileHeight*.5,
  faceProtrusion:depth-.012,
  hostWallOverlap:.012,
  source:'photo-Skolska-220-1-2024',
  attachedToHost:true,roofFasciaClear:true
 };
}
