// Milovice RP 5.81.7 — safely connected pavement to ACTUALLY RENDERED OSM path
// outside the existing blue Bike Tower entry. Not a new street or full plaza.
// Photo evidence: user-shared Mapy.com panorama (2022-05-17) and ŠJů
// Wikimedia Commons Bike Tower (2024-05-30, CC BY 4.0).
// The photo shows paved access; the exact edge/width is still an estimate.
import {isRoadFreeRect,createRoadClearance} from './road-clearance.js';
import {isCarriageway,safePedestrianPieces} from './reality-walkways.js';
import {stationGpsToWorld} from './station-forecourt-pass.js';

export const BIKE_TOWER_ENTRY_PAVING_SOURCE=Object.freeze({
 towerWayId:1011197691,footwayWayId:1165594426,
 expectedTowerName:'Cyklověž Milovice',
 photo:'https://commons.wikimedia.org/wiki/File:Milovice,_N%C3%A1dra%C5%BEn%C3%AD,_cyklov%C4%9B%C5%BE.jpg',
 commonsDate:'2024-05-30',commonsAuthor:'ŠJů',license:'CC BY 4.0',
 mapyPanoramaDate:'2022-05-17',
 observed:'paved pedestrian space immediately outside the blue Bike Tower entrance',
 surveyedPavingBoundary:false,photosCopied:false,
 entryCamera:Object.freeze({lat:50.2290656,lon:14.8822978,heading:5})
});

const DIST_TO_DOOR=.11;
const PAD_WIDTH=3.10;
const PAD_DEPTH=2.10;
const HEIGHT_OFFSET=.15;
const JOIN_WIDTH_AT_PAD=1.60,JOIN_WIDTH_AT_FOOTWAY=1.55;
// A connection must terminate ON visible geometry (not an OSM centerline
// that the game later clips from the road). Do not invent a pointed taper.
const gcd=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
// A route may be connected to its OWN mapped sidewalk. Only that intended
// OSM footway is exempted from the clearance check; all other mapped roads
// AND other pedestrian paths are still fully protected.
function roadWidth(kind){
 return kind==='primary'?11:kind==='secondary'?9:kind==='tertiary'?8:
  kind==='pedestrian'?4:kind==='footway'?1.8:
  kind==='path'||kind==='steps'?1.65:kind==='cycleway'?2:
  kind==='service'?4.5:7.8;
}
function nearestPointOnPolyline(point,points){
 let result=null;
 for(let i=1;i<points.length;i++){
  const a=points[i-1],b=points[i],dx=b.x-a.x,dz=b.z-a.z;
  const d2=dx*dx+dz*dz;
  if(d2<.001)continue;
  const t=Math.max(0,Math.min(1,((point.x-a.x)*dx+(point.z-a.z)*dz)/d2));
  const candidate={x:a.x+dx*t,z:a.z+dz*t};
  const dist=gcd(point,candidate);
  if(!result||dist<result.distance)result={...candidate,distance:dist,segment:i-1};
 }
 return result;
}
function renderedSafeFootwayPieces(elements,footway){
 // Use the SAME clearance/clipping algorithm as the game's osmRoadSegment.
 // Its former chosen target was located on a fully clipped 0/22-chunk
 // part of OSM 1165594426, hence the arrow-shaped path ended in grass.
 const carriageway=createRoadClearance();
 for(const way of elements){
  if(!isCarriageway(way.tags?.highway)||way.geometry?.length<2)continue;
  carriageway.addRoad({
   id:way.id,points:way.geometry.map(stationGpsToWorld),
   kind:way.tags.highway,width:roadWidth(way.tags.highway)
  });
 }
 const route=footway.geometry.map(stationGpsToWorld);
 const visible=[];
 for(let i=1;i<route.length;i++){
  const pieces=safePedestrianPieces(route[i-1],route[i],1.8,carriageway);
  for(const piece of pieces){
   const length=gcd(piece.a,piece.b);
   if(length>=1.2)visible.push({
    a:piece.a,b:piece.b,sourceSegment:i,
    length,carriageway
   });
  }
 }
 return visible;
}
function nearbyProtectedSegments(elements,skipId,origin){
 const segments=[];
 for(const way of elements){
  if(!way?.tags?.highway||Number(way.id)===skipId||way.geometry?.length<2)continue;
  const path=way.geometry.map(stationGpsToWorld),width=roadWidth(way.tags.highway);
  // This tiny 2 m connector cannot affect an OSM route >16m away.
  const nearest=nearestPointOnPolyline(origin,path);
  if(!nearest||nearest.distance>16+width/2)continue;
  for(let i=1;i<path.length;i++){
   const a=path[i-1],b=path[i],dx=b.x-a.x,dz=b.z-a.z;
   const len2=dx*dx+dz*dz;
   if(len2>.01)segments.push({a,dx,dz,len2,width,id:way.id});
  }
 }
 return segments;
}
function nearOtherMappedWay(segments,point){
 let closest={clearance:Infinity,id:null};
 for(const segment of segments){
  const {a,dx,dz,len2,width,id}=segment;
  const t=Math.max(0,Math.min(1,
   ((point.x-a.x)*dx+(point.z-a.z)*dz)/len2));
  const clearance=Math.hypot(point.x-a.x-t*dx,
   point.z-a.z-t*dz)-width/2;
  if(clearance<closest.clearance)closest={clearance,id};
 }
 return closest;
}

export function planBikeTowerEntryPaving(elements,roadClearance){
 if(!Array.isArray(elements)||!roadClearance?.isClear)return null;
 const tower=elements.find(e=>Number(e.id)===BIKE_TOWER_ENTRY_PAVING_SOURCE.towerWayId);
 const footway=elements.find(e=>Number(e.id)===BIKE_TOWER_ENTRY_PAVING_SOURCE.footwayWayId);
 if(tower?.tags?.name!==BIKE_TOWER_ENTRY_PAVING_SOURCE.expectedTowerName||
    tower?.tags?.building!=='yes'||tower.geometry?.length<15||
    footway?.tags?.highway!=='footway')return null;
 const corners=tower.geometry.map(stationGpsToWorld);
 if(gcd(corners[0],corners.at(-1))<.03)corners.pop();
 const cx=corners.reduce((a,b)=>a+b.x,0)/corners.length;
 const cz=corners.reduce((a,b)=>a+b.z,0)/corners.length;
 const rawRadius=corners.reduce((a,b)=>a+Math.hypot(b.x-cx,b.z-cz),0)/corners.length;
 const radius=Math.max(3.2,Math.min(4.1,rawRadius));
 if(rawRadius<3.2||rawRadius>4.4)return null;
 const entry=stationGpsToWorld(BIKE_TOWER_ENTRY_PAVING_SOURCE.entryCamera);
 const ex=entry.x-cx,ez=entry.z-cz,len=Math.hypot(ex,ez);
 if(len<15||len>35)return null;
 const nx=ex/len,nz=ez/len;
 const yaw=Math.atan2(nx,nz);
 const centreRadius=radius+DIST_TO_DOOR+PAD_DEPTH/2;
 const x=cx+nx*centreRadius,z=cz+nz*centreRadius;
 // In the 5.81.3 road map, this candidate is in the gap between mapped
 // tower and real OSM footway 1165594426, with no new road footprint.
 // Reject the ENTIRE rectangle if any sampled corner nears road/footway,
 // including future OSM dataset updates.
 if(!isRoadFreeRect(roadClearance,{x,z,length:PAD_WIDTH,depth:PAD_DEPTH,
  yaw,buffer:.18,step:.25}))return null;

 // The OSM polyline itself is NOT necessarily physically rendered. Near the
 // tower, the nearest section is clipped by the Nádražní carriageway. Only
 // select points at least 12% inside a segment that actually SURVIVES the
 // game's safePedestrianPieces clipping step. This fixes the grass dead-end.
 const visible=renderedSafeFootwayPieces(elements,footway);
 const candidates=visible.map(segment=>{
  const dx=segment.b.x-segment.a.x,dz=segment.b.z-segment.a.z;
  const t=Math.max(.12,Math.min(.88,
   ((x-segment.a.x)*dx+(z-segment.a.z)*dz)/(dx*dx+dz*dz)));
  const end={x:segment.a.x+dx*t,z:segment.a.z+dz*t};
  return {end,segment,t,distance:gcd({x,z},end),
   forward:(end.x-x)*nx+(end.z-z)*nz};
 }).filter(candidate=>candidate.distance>4&&
  candidate.distance<11&&candidate.forward>3)
 .sort((a,b)=>a.distance-b.distance);
 const selected=candidates[0];
 if(!selected)return null;
 const start={x:x+nx*(PAD_DEPTH/2-.12),
  z:z+nz*(PAD_DEPTH/2-.12)};
 const end=selected.end;
 // Overlap the EXISTING pad by 12cm and end in the visible mapped path.
 const length=gcd(start,end);
 if(length<4||length>10)return null;
 const ux=(end.x-start.x)/length,uz=(end.z-start.z)/length;
 const side={x:-uz,z:ux};
 if(!selected.segment.carriageway.isClear(end.x,end.z,.9,.08))
  return null;
 const protectedSegments=nearbyProtectedSegments(elements,Number(footway.id),{x,z});
 if(!protectedSegments.length)return null; // invalid street index
 let otherRoadMargin=Infinity;
 // Check every interpolated ribbon cross-section AND its physical edges.
 // Reject the connector if it approaches any OSM street, other path, or the
 // Bike Tower footprint. Even the new 8m route uses exactly one mesh.
 // The mapped footway endpoint is EXEMPT because it already exists there.
 for(let i=0;i<=26;i++){
  const t=i/26,width=JOIN_WIDTH_AT_PAD*(1-t)+JOIN_WIDTH_AT_FOOTWAY*t;
  const cx=start.x+(end.x-start.x)*t,cz=start.z+(end.z-start.z)*t;
  for(let j=-4;j<=4;j++){
   const p={x:cx+side.x*width*.5*j/4,
    z:cz+side.z*width*.5*j/4};
   const other=nearOtherMappedWay(protectedSegments,p);
   otherRoadMargin=Math.min(otherRoadMargin,other.clearance);
   if(other.clearance<.17||gcd(p,{x:cx,z:cz})<radius+.12)
    return null;
  }
 }
 const connector={
  start,end,side,length,widthStart:JOIN_WIDTH_AT_PAD,
  widthEnd:JOIN_WIDTH_AT_FOOTWAY,
  footwayWayId:footway.id,otherRoadMargin,
  targetInsideActuallyRenderedFootway:true,
  sourceFootwaySegment:selected.segment.sourceSegment,
  targetSafeDistanceMeters:gcd({x,z},end),
  targetCarriagewayClearance:selected.segment.carriageway.nearest(
   end.x,end.z)?.clearance??null
 };
 return {
  x,z,cx,cz,nx,nz,yaw,radius,
  width:PAD_WIDTH,depth:PAD_DEPTH,groundOffset:HEIGHT_OFFSET,
  connector,connectedToMappedFootway:true,
  sourceWayIds:[tower.id,footway.id],source:BIKE_TOWER_ENTRY_PAVING_SOURCE.photo,
  provenance:'2022-and-2024-photos-plus-OSM-footway',
  approximateWidth:true,approximateBoundary:true,
  realOSMFootwayProtected:true,originalRoadsUntouched:true,
  buildingMoved:false,collisionsChanged:false,
  noNewRoads:true,photosCopied:false,drawCalls:1
 };
}

export function makeBikeTowerEntryPavingScene(THREE,{layer,terrainAt=()=>0,
 roadClearance}={}){
 let root=null,geometry=null,plan=null,sharedMaterial=null;
 function publish(){
  window.__miloviceBikeTowerEntryPaving={
   active:!!root,sourceWayIds:plan?.sourceWayIds||[],
   drawCalls:root?1:0,triangles:geometry?.index?.count/3||0,
   width:plan?.width||0,depth:plan?.depth||0,
   connectedToMappedFootway:!!root&&!!plan?.connectedToMappedFootway,
   targetInsideActuallyRenderedFootway:!!root&&
    !!plan?.connector?.targetInsideActuallyRenderedFootway,
   mappedFootwaySegment:plan?.connector?.sourceFootwaySegment??null,
   connectorLength:plan?.connector?.length||0,
   connectorEndWidth:plan?.connector?.widthEnd||0,
   connectorRoadMargin:plan?.connector?.otherRoadMargin??null,
   expectedFootwayId:BIKE_TOWER_ENTRY_PAVING_SOURCE.footwayWayId,
   source:BIKE_TOWER_ENTRY_PAVING_SOURCE.photo,
   photoDimensionsEstimated:true,roadClearanceVerified:!!root,
   noNewRoads:true,buildingMoved:false,originalRoadsUntouched:true,
   materialReused:!!sharedMaterial,photosCopied:false
  };
 }
 function reset(){
  if(root){root.parent?.remove(root);root=null;}
  geometry?.dispose();geometry=null;plan=null;sharedMaterial=null;
  publish();
 }
 function create(elements,{sidewalkMaterial}={}){
  if(root)return window.__miloviceBikeTowerEntryPaving;
  plan=planBikeTowerEntryPaving(elements,roadClearance);
  if(!plan||!sidewalkMaterial){publish();return window.__miloviceBikeTowerEntryPaving;}
  // ONE terrain-following mesh for both doorway pad and tapering connector.
  // It reuses the existing sidewalk material and its tile scale, no extra
  // texture, no isolated squares, no new road or parking geometry.
  const countX=8,countZ=6,vertices=[],uvs=[],indices=[];
  const tanX=plan.nz,tanZ=-plan.nx;
  for(let i=0;i<=countX;i++){
   const u=(i/countX-.5)*plan.width;
   for(let j=0;j<=countZ;j++){
    const v=(j/countZ-.5)*plan.depth;
    const x=plan.x+tanX*u+plan.nx*v;
    const z=plan.z+tanZ*u+plan.nz*v;
    vertices.push(x,terrainAt(x,z)+plan.groundOffset,z);
    uvs.push(u/1.2,v/1.2);
   }
  }
  for(let i=0;i<countX;i++)for(let j=0;j<countZ;j++){
   const k=i*(countZ+1)+j,after=k+countZ+1;
   // Right-handed tangent/front orientation; these triangles face UP.
   indices.push(k,k+1,after,k+1,after+1,after);
  }
  // Straight, nearly constant-width corridor to the RENDERED (unclipped)
  // mapped footway. Offset 4 mm above pad to prevent coincident
  // triangles flickering where the two pieces overlap at the entrance.
  const baseVertex=vertices.length/3,alongSteps=10,acrossSteps=4;
  const link=plan.connector;
  for(let i=0;i<=alongSteps;i++){
   const t=i/alongSteps;
   const width=link.widthStart*(1-t)+link.widthEnd*t;
   const cx=link.start.x+(link.end.x-link.start.x)*t;
   const cz=link.start.z+(link.end.z-link.start.z)*t;
   for(let j=0;j<=acrossSteps;j++){
    const lateral=(j/acrossSteps-.5)*width;
    const x=cx+link.side.x*lateral,z=cz+link.side.z*lateral;
    vertices.push(x,terrainAt(x,z)+plan.groundOffset+.004,z);
    const localX=(x-plan.x)*plan.nz-(z-plan.z)*plan.nx;
    const localZ=(x-plan.x)*plan.nx+(z-plan.z)*plan.nz;
    uvs.push(localX/1.2,localZ/1.2);
   }
  }
  for(let i=0;i<alongSteps;i++)for(let j=0;j<acrossSteps;j++){
   const k=baseVertex+i*(acrossSteps+1)+j,after=k+acrossSteps+1;
   indices.push(k,k+1,after,k+1,after+1,after);
  }
  geometry=new THREE.BufferGeometry();
  geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));
  geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  sharedMaterial=sidewalkMaterial;
  root=new THREE.Mesh(geometry,sharedMaterial);
  root.name='Photo2022_2024_BikeTower_EntryPaving_OSM1011197691';
  root.receiveShadow=true;root.userData.photoBoundaryEstimated=true;
  root.userData.lodX=plan.cx;root.userData.lodZ=plan.cz;
  root.userData.lodDetail=true;
  root.userData.originalRoadsUntouched=true;
  layer.add(root);publish();
  return window.__miloviceBikeTowerEntryPaving;
 }
 publish();
 return {create,reset,status:()=>window.__miloviceBikeTowerEntryPaving,
  plan:()=>plan};
}
