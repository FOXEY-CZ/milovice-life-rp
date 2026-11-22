/** 5.260: oriented 2D model-envelope evidence from actually rendered NPC
 * transform/heading. No physical collider, traffic-rule or street survey claim.
 * Only opt-in 5.259 encounter cars use this helper.
 */
import {ITALSKA_CAR_CLEARANCE_5254 as bodyWidths} from './osm-italska-car-clearance-5254.js';
export const ITALSKA_BODY_ENVELOPE_5260=Object.freeze({
 mirrorWidthStandardMetres:bodyWidths.standardExteriorWidth,
 mirrorWidthWideMetres:bodyWidths.wideExteriorWidth,
 bumperAllowanceMetres:.08,
 extraBufferMetres:.10,
 numericalToleranceMetres:1e-6
});
const finite=n=>Number.isFinite(n);
const dot=(a,b)=>a.x*b.x+a.z*b.z;
const sub=(a,b)=>({x:a.x-b.x,z:a.z-b.z});
const dist=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
function pose(car){
 if(car?.italskaEncounter5259!==true||car.driven||car.parked||
  car.service||!Number.isInteger(car.type)||car.type<0||car.type>7)
  return null;
 const x=car.g?.position?.x,z=car.g?.position?.z,
  heading=car.g?.rotation?.y,length=car.carLength5257;
 if(![x,z,heading,length].every(finite)||length<3||length>5.2)
  return null;
 const width=car.type===6?bodyWidths.wideExteriorWidth:
  bodyWidths.standardExteriorWidth;
 if(!finite(width)||width<1.5||width>2.5)return null;
 return {x,z,heading,length:length+
  ITALSKA_BODY_ENVELOPE_5260.bumperAllowanceMetres,width};
}
function rectangle(p,extra){
 const c=Math.cos(p.heading),s=Math.sin(p.heading);
 const lateral={x:c,z:-s},longitudinal={x:s,z:c};
 const hw=p.width/2+extra,hl=p.length/2+extra;
 const center={x:p.x,z:p.z},corners=[];
 for(const a of [-1,1])for(const b of [-1,1])
  corners.push({x:p.x+a*hw*lateral.x+b*hl*longitudinal.x,
   z:p.z+a*hw*lateral.z+b*hl*longitudinal.z});
 return {center,lateral,longitudinal,hw,hl,corners};
}
function pointSegmentDistance(p,a,b){
 const vx=b.x-a.x,vz=b.z-a.z,ds=vx*vx+vz*vz;
 const t=ds>1e-12?Math.max(0,Math.min(1,
  ((p.x-a.x)*vx+(p.z-a.z)*vz)/ds)):0;
 return Math.hypot(p.x-a.x-vx*t,p.z-a.z-vz*t);
}
function polyEdges(r){
 const v=r.corners;
 return [[v[0],v[1]],[v[1],v[3]],[v[3],v[2]],[v[2],v[0]]];
}
function separation(a,b){
 const d=sub(b.center,a.center);
 let greatestAxisGap=-Infinity;
 for(const axis of [a.lateral,a.longitudinal,b.lateral,b.longitudinal]){
  const extent=(r)=>
   r.hw*Math.abs(dot(r.lateral,axis))+
   r.hl*Math.abs(dot(r.longitudinal,axis));
  const gap=Math.abs(dot(d,axis))-extent(a)-extent(b);
  greatestAxisGap=Math.max(greatestAxisGap,gap);
 }
 if(greatestAxisGap<=0)return greatestAxisGap; // negative = OBB penetration
 // Euclidean minimum edge-to-corner separation, not center distance.
 let closest=Infinity;
 for(const [verts,edges] of [
  [a.corners,polyEdges(b)],[b.corners,polyEdges(a)]
 ])for(const p of verts)for(const [x,y] of edges)
  closest=Math.min(closest,pointSegmentDistance(p,x,y));
 return closest;
}
export function inspectItalskaBodyPair5260(lead,follow){
 const p=pose(lead),q=pose(follow);
 if(!p||!q)return {ready:false,reason:'not-two-audited-procedural-cars'};
 const c=ITALSKA_BODY_ENVELOPE_5260;
 const nominal=separation(rectangle(p,0),rectangle(q,0));
 const buffered=separation(rectangle(p,c.extraBufferMetres),
  rectangle(q,c.extraBufferMetres));
 if(!finite(nominal)||!finite(buffered))
  return {ready:false,reason:'non-finite-model-envelope'};
 return {ready:true,version:'5.260',proxyOnly:true,
  source:'actual-3D-group-x-z-heading-plus-procedural-model-envelope',
  centerDistanceMetres:dist(p,q),
  bodyGapMetres:nominal,bufferedGapMetres:buffered,
  bodyOverlap:nominal< -c.numericalToleranceMetres,
  bufferedOverlap:buffered< -c.numericalToleranceMetres,
  modelBodyLengthsMetres:[p.length,q.length],
  modelMirrorWidthsMetres:[p.width,q.width],
  bufferPerSideMetres:c.extraBufferMetres,
  trueMeshPenetrationVerified:false,roadPriorityVerified:false,
  sweptBetweenFramesVerified:false};
}
