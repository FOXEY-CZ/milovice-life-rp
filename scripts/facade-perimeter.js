import {flushBoxOffset,exteriorFacadeFrame} from './facade-anchors.js';
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

/**
 * 5.43: the photographed eave is ONE 3-step continuous stone/plaster
 * profile rather than seven square boxes. Each tier uses a single miter
 * position at each actual OSM polygon vertex, shared by both adjacent
 * facades. No extra corner caps, seams, or independent floating bars.
 * The small depth/colour variations are visual approximations: the photo
 * does not establish measured moulding dimensions.
 */
export const PHOTO_EAVE_PROFILE_COLOR=0xd5cbb9;
export const PHOTO_EAVE_PROFILE_TIERS=Object.freeze([
 {name:'foot',low:-.080,high:-.043,projection:.115},
 {name:'face',low:-.046,high:.044,projection:.151},
 {name:'crown',low:.041,high:.080,projection:.185}
]);
export function planPhotographedEaveCorniceRing(outline,{
 base=0,height=3.75,dropBelowEave=.30,miterLimit=2.6
}={}){
 if(!Array.isArray(outline)||outline.length<3||
  ![base,height,dropBelowEave,miterLimit].every(Number.isFinite)||
  height<2.3||dropBelowEave<.23||dropBelowEave>.55||
  miterLimit<1.1||miterLimit>4)return null;
 const p=outline.map(v=>({x:v?.x,z:v?.z??v?.y}));
 if(!p.every(v=>Number.isFinite(v.x)&&Number.isFinite(v.z)))return null;
 if(p.length>3&&Math.hypot(p[0].x-p.at(-1).x,p[0].z-p.at(-1).z)<.10)p.pop();
 if(p.length<3||p.length>32)return null;
 const frames=p.map((_,i)=>exteriorFacadeFrame(p,i));
 if(frames.some(f=>!f||f.len<.08||f.len>140))return null;
 function cornerAt(i,offset){
  const before=frames[(i+p.length-1)%p.length],after=frames[i];
  const dot=Math.max(-1,Math.min(1,before.nx*after.nx+before.nz*after.nz));
  const denom=1+dot;
  let dx=after.nx*offset,dz=after.nz*offset;
  if(denom>.10){
   dx=(before.nx+after.nx)*offset/denom;
   dz=(before.nz+after.nz)*offset/denom;
  }
  const length=Math.hypot(dx,dz),allowed=Math.abs(offset)*miterLimit;
  if(length>allowed&&allowed>0){dx*=allowed/length;dz*=allowed/length}
  return {x:p[i].x+dx,z:p[i].z+dz};
 }
 const wallOverlap=.012;
 const tiers=PHOTO_EAVE_PROFILE_TIERS.map(t=>({
  name:t.name,bottom:base+height-dropBelowEave+t.low,
  top:base+height-dropBelowEave+t.high,
  inner:p.map((_,i)=>cornerAt(i,-wallOverlap)),
  outer:p.map((_,i)=>cornerAt(i,t.projection)),
  projection:t.projection
 }));
 return {
  source:'photo-Skolska-220-1-2024',
  color:PHOTO_EAVE_PROFILE_COLOR,segmentCount:p.length,
  cornerCount:p.length,profileSteps:tiers.length,
  wallOverlap,dropBelowEave,tiers
 };
}
/** Build ONE watertight polygonal ring mesh, with profiled mitered corners. */
export function buildPhotographedEaveCorniceGeometry(THREE,outline,opts={}){
 const plan=planPhotographedEaveCorniceRing(outline,opts);
 if(!plan||!THREE?.BufferGeometry||!THREE?.Float32BufferAttribute)return null;
 const coords=[];
 const quad=(a,b,c,d)=>{
  for(const v of [a,b,c,a,c,d])coords.push(v.x,v.y,v.z);
 };
 for(const t of plan.tiers){
  for(let i=0;i<plan.segmentCount;i++){
   const j=(i+1)%plan.segmentCount;
   const ib={...t.inner[i],y:t.bottom},jb={...t.inner[j],y:t.bottom},
    it={...t.inner[i],y:t.top},jt={...t.inner[j],y:t.top},
    ob={...t.outer[i],y:t.bottom},pb={...t.outer[j],y:t.bottom},
    ot={...t.outer[i],y:t.top},pt={...t.outer[j],y:t.top};
   // Each adjacent wall owns the SAME miter corner vertex.
   quad(ob,pb,pt,ot); // external vertical fascia
   quad(it,jt,pt,ot); // upper horizontal shoulder
   quad(ib,ob,pb,jb); // bottom soffit
   quad(ib,jb,jt,it); // back face inside solid OSM wall
  }
 }
 const g=new THREE.BufferGeometry();
 g.setAttribute('position',new THREE.Float32BufferAttribute(coords,3));
 g.computeVertexNormals();
 g.userData={source:plan.source,segments:plan.segmentCount,
  corners:plan.cornerCount,profileSteps:plan.profileSteps};
 return g;
}
