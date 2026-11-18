/**
 * Milovice RP 5.150: seven MODELED outdoor tennis courts within four
 * SOURCE-LOCKED OSM leisure=pitch polygons at Milten, Sportovní 588.
 * Public listing says 7 outdoor clay courts; 3 mapped ~37x37m areas
 * comfortably hold 2 courts each and 1 mapped ~38x26m area holds one.
 * Exact distribution, orientation, line paint and net positions are
 * geometry-informed estimates, not a surveyed as-built drawing.
 */
import {insideMappedPitch} from './osm-pitch-markings-599.js';
export const MIlTEN_TENNIS_5150=Object.freeze({
 region:'mlada',single:'1278746589',
 sites:Object.freeze([
  Object.freeze({id:'612386900',hash:'3dfef3a9',count:2,clay:true}),
  Object.freeze({id:'612386901',hash:'6efd43dd',count:2,clay:true}),
  Object.freeze({id:'612386902',hash:'34d6e2b4',count:2,clay:true}),
  Object.freeze({id:'1278746589',hash:'0e4ca5f1',count:1,clay:false})
 ]),
 externalCountSource:'https://www.firmy.cz/detail/2256575-milten-sport-center-milovice-milovice-mlada.html',
 externalCount:7,exactCourtPositionsVerified:false,
 clayForThreeOSMPolygons:true,fourthSurfaceUnmapped:true
});
function hashGPS(pts){
 let h=2166136261;
 for(const c of pts.map(p=>p.lat.toFixed(7)+','+p.lon.toFixed(7)).join(';')){
  h^=c.charCodeAt(0);h=Math.imul(h,16777619);
 }
 return (h>>>0).toString(16).padStart(8,'0');
}
const finite=p=>Number.isFinite(p?.x)&&Number.isFinite(p?.z??p?.y);
const pos=p=>({x:p.x,z:p.z??p.y});
const within=(p,poly)=>insideMappedPitch(p.x,p.z,poly);
export function planMiltenTennis5150({regionId,ways,toWorld}={}){
 const ref=MIlTEN_TENNIS_5150;
 if(regionId!==ref.region||!Array.isArray(ways)||
  typeof toWorld!=='function')return null;
 const picked=[];
 for(const spec of ref.sites){
  const found=ways.filter(w=>String(w?.id)===spec.id);
  if(found.length!==1)return null;
  const way=found[0],g=way.geometry;
  if(way.tags?.leisure!=='pitch'||way.tags.sport!=='tennis'||
   (spec.clay?way.tags.surface!=='clay':way.tags.surface!==undefined)||
   !Array.isArray(g)||g.length!==5||
   g.some(p=>!Number.isFinite(p?.lat)||!Number.isFinite(p?.lon))||
   hashGPS(g)!==spec.hash)return null;
  const polygon=g.map(toWorld).map(pos);
  if(!polygon.every(finite))return null;
  picked.push({spec,polygon});
 }
 // The shorter fourth OSM pitch records the long north/south tennis axis.
 // Avoid choosing an arbitrary edge of near-square 2-court polygons.
 const single=picked.find(p=>p.spec.id===ref.single)?.polygon;
 if(!single)return null;
 let edge=null;
 for(let i=0;i<single.length-1;i++){
  const a=single[i],b=single[i+1],dx=b.x-a.x,dz=b.z-a.z,
   len=Math.hypot(dx,dz);
  if(!edge||len>edge.len)edge={x:dx/len,z:dz/len,len};
 }
 if(!edge||edge.len<35||edge.len>42)return null;
 const axis={x:edge.x,z:edge.z},side={x:-axis.z,z:axis.x};
 const courts=[],segmentsById={},siteDimensions={};
 for(const {spec,polygon} of picked){
  const open=polygon.slice(0,-1),
   u=open.map(p=>p.x*axis.x+p.z*axis.z),
   v=open.map(p=>p.x*side.x+p.z*side.z);
  const minU=Math.min(...u),maxU=Math.max(...u),
   minV=Math.min(...v),maxV=Math.max(...v);
  const length=maxU-minU,width=maxV-minV;
  if(length<34||length>40||
   (spec.count===2?(width<33||width>40):(width<22||width>30)))
   return null;
  const midU=(minU+maxU)/2,midV=(minV+maxV)/2;
  const siteCourts=[],siteLines=[];
  const world=(cu,cv)=>({
   x:axis.x*cu+side.x*cv,z:axis.z*cu+side.z*cv
  });
  for(let n=0;n<spec.count;n++){
   const cv=midV+(spec.count===2?(n===0?-.25:.25)*width:0);
   const center=world(midU,cv),halfL=11.885,halfW=5.485;
   const line=(u1,v1,u2,v2)=>{
    const a=world(midU+u1,cv+v1),b=world(midU+u2,cv+v2),
     mid={x:(a.x+b.x)/2,z:(a.z+b.z)/2};
    if(![a,b,mid].every(p=>within(p,polygon)))return false;
    siteLines.push({a,b});return true;
   };
   const markings=[
    [-halfL,-halfW, halfL,-halfW],
    [-halfL,halfW, halfL,halfW],
    [-halfL,-halfW,-halfL,halfW],
    [halfL,-halfW,halfL,halfW],
    [-halfL,-4.115,halfL,-4.115],
    [-halfL,4.115,halfL,4.115],
    [-6.4,-4.115,-6.4,4.115],
    [6.4,-4.115,6.4,4.115],
    [-6.4,0,6.4,0]
   ];
   if(markings.some(s=>!line(...s)))return null;
   const postLeft=world(midU,cv-6.4),postRight=world(midU,cv+6.4);
   const sample=[center,postLeft,postRight,
    ...[-halfL,halfL].flatMap(du=>[-halfW,halfW]
     .map(dv=>world(midU+du,cv+dv)))];
   if(!sample.every(p=>within(p,polygon)))return null;
   const court={
    id:spec.id+'-'+(n+1),pitchId:spec.id,siteSlot:n+1,
    center,posts:[postLeft,postRight],axis,side,
    netHeightMeters:.91,postHeightMeters:1.07,
    netWidthMeters:12.8,playLines:markings.length,
    schematicPosition:true,netLocationsPhotoVerified:false,
    allGeometryInsideOriginalOSM:true,
    doubleSite:spec.count===2
   };
   siteCourts.push(court);courts.push(court);
  }
  segmentsById[spec.id]=siteLines;
  siteDimensions[spec.id]={lengthMeters:+length.toFixed(2),
   widthMeters:+width.toFixed(2),modeledCourts:spec.count,
   originalGPSHash:spec.hash};
 }
 if(courts.length!==ref.externalCount)return null;
 return {version:'5.150',sourceOSMIDs:ref.sites.map(s=>s.id),
  regionId,sourceCountFourPolygons:4,
  sourcePublicCourtCount:ref.externalCount,
  sourcePublicCourtCountURL:ref.externalCountSource,
  courts,segmentsById,siteDimensions,
  modeledNets:courts.length,
  sevenCourtSplitEstimated:true,
  trueCourtPositionsSurveyed:false,
  linesAndNetGeometryEstimated:true,
  originalMapGeometryPreserved:true,newPitchPolygons:0,
  addedRoads:0,addedTrees:0,addedFences:0,addedColliders:0,
  extraTerrainPatches:0
 };
}

export function renderMiltenTennisNets5150(THREE,{
 plan,layer,terrainAt
}={}){
 if(!THREE||plan?.version!=='5.150'||plan.courts?.length!==7||
  !layer?.add||typeof terrainAt!=='function')return null;
 // Three draw calls for ALL seven modeled courts: 14 metal posts, 7
 // top bands and one shared wire grid. No per-string scene objects.
 const poleGeo=new THREE.CylinderGeometry(.038,.046,1.07,6),
  bandGeo=new THREE.BoxGeometry(1,.035,.028),
  metal=new THREE.MeshStandardMaterial({color:0x6e7579,roughness:.7}),
  white=new THREE.MeshBasicMaterial({color:0xf2efe9}),
  wires=new THREE.LineBasicMaterial({color:0x343b42,
   transparent:true,opacity:.74,depthWrite:false});
 const posts=new THREE.InstancedMesh(poleGeo,metal,14);
 const bands=new THREE.InstancedMesh(bandGeo,white,7);
 const dummy=new THREE.Object3D(),wirePositions=[];
 let poleCount=0,bandCount=0;
 const addLine=(a,b)=>wirePositions.push(a.x,a.y,a.z,b.x,b.y,b.z);
 for(const court of plan.courts){
  const [a,b]=court.posts;
  const floorA=terrainAt(a.x,a.z)+.12,floorB=terrainAt(b.x,b.z)+.12;
  for(const [p,y] of [[a,floorA],[b,floorB]]){
   dummy.position.set(p.x,y+.535,p.z);dummy.rotation.set(0,0,0);
   dummy.scale.set(1,1,1);dummy.updateMatrix();
   posts.setMatrixAt(poleCount++,dummy.matrix);
  }
  const center={x:(a.x+b.x)/2,z:(a.z+b.z)/2};
  dummy.position.set(center.x,(floorA+floorB)/2+.93,center.z);
  dummy.rotation.set(0,Math.atan2(-court.side.z,court.side.x),0);
  dummy.scale.set(12.8,1,1);dummy.updateMatrix();
  bands.setMatrixAt(bandCount++,dummy.matrix);
  const segment=(t,y)=>({x:a.x+(b.x-a.x)*t,z:a.z+(b.z-a.z)*t,
   y:floorA+(floorB-floorA)*t+y});
  // Shared net mesh; vertical cords ~0.38m apart, horizontals every 0.18m.
  for(let i=0;i<=32;i++){
   const t=i/32;addLine(segment(t,.12),segment(t,.91));
  }
  for(let k=0;k<=5;k++){
   const y=.12+(.91-.12)*k/5;
   for(let i=0;i<32;i++)
    addLine(segment(i/32,y),segment((i+1)/32,y));
  }
 }
 posts.instanceMatrix.needsUpdate=true;
 bands.instanceMatrix.needsUpdate=true;
 const g=new THREE.BufferGeometry();
 g.setAttribute('position',new THREE.Float32BufferAttribute(wirePositions,3));
 g.computeBoundingSphere();
 const grid=new THREE.LineSegments(g,wires);
 posts.name='Milovice_OSM_Milten_7_TennisPosts_5150';
 bands.name='Milovice_OSM_Milten_7_TennisBands_5150';
 grid.name='Milovice_OSM_Milten_7_TennisNets_5150';
 for(const object of [posts,bands,grid]){
  object.userData.sourceOSMCourts=plan.sourceOSMIDs;
  object.userData.modeledEquipment=true;
  object.castShadow=false;object.receiveShadow=false;
  layer.add(object);
 }
 return {
  posts,bands,grid,
  renderedNets:bandCount,renderedPosts:poleCount,
  addedDrawObjects:3,wireGridSegments:wirePositions.length/6,
  visibleNets:()=>{
   const objects=[posts,bands,grid];
   return objects.every(obj=>{
    for(let p=obj;p;p=p.parent)if(!p.visible)return false;
    return true;
   })?bandCount:0;
  }
 };
}
