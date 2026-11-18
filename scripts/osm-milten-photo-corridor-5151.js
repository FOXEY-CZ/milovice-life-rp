/**
 * Milovice RP 5.151 — photo-supported single-edge tennis fence and
 * paved walking corridor between the western Milten clay court
 * (OSM 612386900) and the Sportovní 588 hall (RÚIAN 27906272).
 *
 * Milten Restaurant's published terrace photo shows the EXISTENCE of a
 * green mesh fence and a paved pedestrian strip alongside clay courts.
 * It has no EXIF position or camera azimuth. Choosing this eastern OSM
 * court edge, fence height, material shade and path width is therefore
 * explicitly a MODEL INFERENCE, not surveyed pavement or routing.
 */
import {insideMappedPitch} from './osm-pitch-markings-599.js';

export const MILTEN_CORRIDOR_5151=Object.freeze({
 regionId:'mlada',
 pitchId:'612386900',pitchNodes:5,pitchHash:'3dfef3a9',
 hallId:'53866046',hallNodes:13,hallHash:'b4bc8b6d',
 hallRUIAN:'27906272',edgeStart:1,edgeEnd:2,
 photoURL:'https://milten-restaurant-bar.webnode.cz/galerie-menu/',
 photoConfirmsFenceAndWalkway:true,
 photoGeotagged:false,chosenOSMEdgePhotoVerified:false,
 modeledFenceMeters:2.15,modeledPathWidthMeters:2.10
});
function hashGPS(geo){
 let h=2166136261;
 const str=geo.map(p=>p.lat.toFixed(7)+','+p.lon.toFixed(7)).join(';');
 for(const char of str){h^=char.charCodeAt(0);h=Math.imul(h,16777619)}
 return (h>>>0).toString(16).padStart(8,'0');
}
const asPoint=p=>({x:p.x,z:p.z??p.y});
const finite=p=>Number.isFinite(p?.x)&&Number.isFinite(p?.z);
function nearestSegmentDistance(p,polygon){
 let d=Infinity;
 for(let i=0;i<polygon.length-1;i++){
  const a=polygon[i],b=polygon[i+1],
   vx=b.x-a.x,vz=b.z-a.z,
   w=Math.max(1e-9,vx*vx+vz*vz),
   t=Math.max(0,Math.min(1,
    ((p.x-a.x)*vx+(p.z-a.z)*vz)/w));
  d=Math.min(d,Math.hypot(p.x-(a.x+vx*t),p.z-(a.z+vz*t)));
 }
 return d;
}
export function planMiltenCorridor5151({
 regionId,pitch,hall,toWorld
}={}){
 const s=MILTEN_CORRIDOR_5151;
 if(regionId!==s.regionId||
  String(pitch?.id)!==s.pitchId||
  pitch?.tags?.leisure!=='pitch'||pitch.tags.sport!=='tennis'||
  pitch.tags.surface!=='clay'||
  String(hall?.id)!==s.hallId||
  hall.tags?.building!=='yes'||
  hall.tags['building:levels']!=='1'||
  hall.tags['ref:ruian:building']!==s.hallRUIAN||
  hall.tags.source!=='cuzk:ruian'||
  typeof toWorld!=='function')return null;
 for(const [way,size,hash] of [[pitch,s.pitchNodes,s.pitchHash],
  [hall,s.hallNodes,s.hallHash]]){
  if(!Array.isArray(way.geometry)||way.geometry.length!==size||
   way.geometry.some(p=>!Number.isFinite(p?.lat)||!Number.isFinite(p?.lon))||
   hashGPS(way.geometry)!==hash)return null;
 }
 const p=pitch.geometry.map(toWorld).map(asPoint);
 const b=hall.geometry.map(toWorld).map(asPoint);
 if(!p.every(finite)||!b.every(finite))return null;
 const a=p[s.edgeStart],z=p[s.edgeEnd];
 const dx=z.x-a.x,dz=z.z-a.z,len=Math.hypot(dx,dz);
 if(len<32||len>41)return null;
 const tangent={x:dx/len,z:dz/len};
 const left={x:-tangent.z,z:tangent.x};
 const interior=p.slice(0,-1).reduce((sum,q)=>({
  x:sum.x+q.x/(p.length-1),z:sum.z+q.z/(p.length-1)
 }),{x:0,z:0});
 const mid={x:(a.x+z.x)/2,z:(a.z+z.z)/2};
 const inside=(interior.x-mid.x)*left.x+(interior.z-mid.z)*left.z;
 if(Math.abs(inside)<2)return null;
 const out=inside>0?{x:-left.x,z:-left.z}:left;
 // All corridor points are between the original mapped clay court
 // and the original hall. The 2018-ish terrace photo has no surveyed
 // elevation, fence line, gate, or actual walkway edge.
 const point=(t,offset)=>({
  x:a.x+dx*t+out.x*offset,z:a.z+dz*t+out.z*offset
 });
 const start=.07,end=.93;
 const footprintSamples=[];
 for(const t of [start,.2,.5,.8,end])
  for(const offset of [.11,.48,2.58])
   footprintSamples.push(point(t,offset));
 if(footprintSamples.some(q=>
  insideMappedPitch(q.x,q.z,p)||
  nearestSegmentDistance(q,b)<2.4))return null;
 const edgeDirectionToHall=nearestSegmentDistance(point(.5,1.35),b);
 if(edgeDirectionToHall<3||edgeDirectionToHall>36)return null;
 const startPoint=point(start,.12),endPoint=point(end,.12);
 const lengthMeters=Math.hypot(endPoint.x-startPoint.x,
  endPoint.z-startPoint.z);
 const posts=[];
 for(let i=0;i<=10;i++)posts.push(point(start+(end-start)*i/10,.12));
 return {
  version:'5.151',sourceCourtId:s.pitchId,sourceHallId:s.hallId,
  sourceHallRUIAN:s.hallRUIAN,sourceHashCourt:s.pitchHash,
  sourceHashHall:s.hallHash,sourcePhoto:s.photoURL,
  sourcePhotoShowsFenceAndWalkway:true,
  sourcePhotoGeotagged:false,photographicEdgeIdentification:false,
  fenceSideModelInferred:true,footwayRouteMapped:false,
  lengthMeters:+lengthMeters.toFixed(2),
  widthMeters:s.modeledPathWidthMeters,
  heightMeters:s.modeledFenceMeters,
  posts,point,axis:tangent,outward:out,
  pathStartOffset:.48,pathEndOffset:2.58,
  alongStart:start,alongEnd:end,
  hallBuildingNotTouched:true,originalOSMGeometryUnmodified:true,
  roadNetworkUnmodified:true,realFootwaysAdded:0,newColliders:0,
  inventedGates:0,inventedParking:0,inventedStreetlights:0,
  noNewBuildings:true
 };
}

export function renderMiltenCorridor5151(THREE,{
 plan,layer,terrainAt
}={}){
 if(!THREE||plan?.version!=='5.151'||plan.posts?.length!==11||
  !layer?.add||typeof terrainAt!=='function')return null;
 const green=new THREE.MeshStandardMaterial({
  color:0x416b54,roughness:.85,metalness:.12
 });
 const meshMat=new THREE.LineBasicMaterial({
  color:0x47715b,transparent:true,opacity:.77,depthWrite:false
 });
 const paving=new THREE.MeshStandardMaterial({
  color:0xa6a49d,roughness:.98,metalness:0,
  side:THREE.DoubleSide
 });
 // Short, continuous photo-backed visual walkway: no route, physical
 // collider or independently invented path through other polygons.
 const verts=[];
 const cells=16;
 const ground=(q)=>terrainAt(q.x,q.z)+.105;
 for(let i=0;i<cells;i++){
  const t0=plan.alongStart+(plan.alongEnd-plan.alongStart)*i/cells;
  const t1=plan.alongStart+(plan.alongEnd-plan.alongStart)*(i+1)/cells;
  const a=plan.point(t0,plan.pathStartOffset),
   b=plan.point(t0,plan.pathEndOffset),
   c=plan.point(t1,plan.pathStartOffset),
   d=plan.point(t1,plan.pathEndOffset);
  for(const q of [a,b,c,c,b,d])verts.push(q.x,ground(q),q.z);
 }
 const pathGeo=new THREE.BufferGeometry();
 pathGeo.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));
 pathGeo.computeVertexNormals();
 const path=new THREE.Mesh(pathGeo,paving);
 path.name='Milovice_Milten_5151_paved_photo_corridor';
 const postGeo=new THREE.CylinderGeometry(.033,.042,plan.heightMeters,6);
 const posts=new THREE.InstancedMesh(postGeo,green,plan.posts.length);
 const dummy=new THREE.Object3D();
 for(let i=0;i<plan.posts.length;i++){
  const p=plan.posts[i];
  dummy.position.set(p.x,terrainAt(p.x,p.z)+plan.heightMeters/2+.1,p.z);
  dummy.rotation.set(0,0,0);dummy.scale.set(1,1,1);
  dummy.updateMatrix();posts.setMatrixAt(i,dummy.matrix);
 }
 posts.instanceMatrix.needsUpdate=true;
 posts.name='Milovice_Milten_5151_green_fence_posts';
 const strands=[];
 const line=(p,q)=>strands.push(p.x,p.y,p.z,q.x,q.y,q.z);
 const sample=(t,h)=>{
  const p=plan.point(t,.12);
  return {x:p.x,y:terrainAt(p.x,p.z)+.1+h,z:p.z};
 };
 const sections=40;
 // No solid wall; leave see-through fences with subtle vertical and
 // horizontal wire lines like the photo's green tennis protection.
 for(let i=0;i<=sections;i++){
  const t=plan.alongStart+(plan.alongEnd-plan.alongStart)*i/sections;
  line(sample(t,.2),sample(t,plan.heightMeters));
 }
 for(const h of [.2,.6,1,1.4,1.8,plan.heightMeters])
  for(let i=0;i<sections;i++){
   const a=plan.alongStart+(plan.alongEnd-plan.alongStart)*i/sections;
   const b=plan.alongStart+(plan.alongEnd-plan.alongStart)*(i+1)/sections;
   line(sample(a,h),sample(b,h));
  }
 const fenceGeo=new THREE.BufferGeometry();
 fenceGeo.setAttribute('position',new THREE.Float32BufferAttribute(strands,3));
 fenceGeo.computeBoundingSphere();
 const fence=new THREE.LineSegments(fenceGeo,meshMat);
 fence.name='Milovice_Milten_5151_green_fence_wire';
 const objects=[path,posts,fence];
 const center=plan.point(.5,1.3);
 for(const o of objects){
  o.userData.lodX=center.x;o.userData.lodZ=center.z;
  o.userData.photoObservedExistence=true;
  o.userData.exactLocationEstimated=true;
  o.castShadow=false;o.receiveShadow=false;
  layer.add(o);
 }
 return {
  groupObjects:objects,drawObjects:objects.length,postInstances:plan.posts.length,
  wireSegments:strands.length/6,pathTriangles:verts.length/9,
  visibleObjects:()=>objects.filter(o=>{
   for(let p=o;p;p=p.parent)if(!p.visible)return false;
   return true;
  }).length
 };
}
