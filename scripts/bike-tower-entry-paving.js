// Milovice RP 5.81.9 — source-safe continuous forecourt with mapped-footway UV matching between tower and rendered footway
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
const JOIN_WIDTH_AT_PAD=PAD_WIDTH,JOIN_WIDTH_AT_FOOTWAY=1.64;
const PAD_ROWS=6,CONNECTOR_ROWS=24,ACROSS_ROWS=12;
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
  // The short forecourt connector cannot affect an OSM route >16m away.
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

// Shift wider paved area toward the station, preserving more grass around
// the tower and a narrower 1.64m landing at the 1.8m source-mapped path.
// Geometric boundaries are visual design estimates, NOT surveyed paving.
function forecourtHalfWidths(t){
 const ease=t*t*(3-2*t),bulge=Math.sin(Math.PI*t)**2;
 return {
  station:PAD_WIDTH/2+2.10*bulge-.60*ease,
  road:PAD_WIDTH/2-.86*ease
 };
}
function normalize(v){
 const d=Math.hypot(v.x,v.z)||1;
 return {x:v.x/d,z:v.z/d};
}
// Use the same station-side orientation for the door apron and corridor.
function buildForecourtRows({x,z,nx,nz,depth,connector}){
 const padSide={x:-nz,z:nx},rows=[];
 for(let i=0;i<=PAD_ROWS;i++){
  const d=(i/PAD_ROWS-.5)*depth;
  rows.push({x:x+nx*d,z:z+nz*d,
   side:padSide,station:PAD_WIDTH/2,road:PAD_WIDTH/2,phase:'apron'});
 }
 for(let i=1;i<=CONNECTOR_ROWS;i++){
  const t=i/CONNECTOR_ROWS;
  // Exact first connector edge equals last apron edge: no duplicate patch,
  // overlapping triangles, z-fighting, or seam at the front of the tower.
  const side=normalize({
   x:padSide.x*(1-Math.min(1,t*4))+connector.side.x*Math.min(1,t*4),
   z:padSide.z*(1-Math.min(1,t*4))+connector.side.z*Math.min(1,t*4)
  });
  const widths=forecourtHalfWidths(t);
  rows.push({
   x:connector.start.x+(connector.end.x-connector.start.x)*t,
   z:connector.start.z+(connector.end.z-connector.start.z)*t,
   side,station:widths.station,road:widths.road,phase:'forecourt'
  });
 }
 return rows;
}
function sampleRow(row,u){
 const offset=-row.road+(row.station+row.road)*u;
 return {x:row.x+row.side.x*offset,z:row.z+row.side.z*offset};
}
function nearBuildingPolygons(elements,origin,towerId){
 const result=[];
 for(const e of elements){
  if(!e?.tags?.building||Number(e.id)===towerId||e.geometry?.length<3)
   continue;
  const poly=e.geometry.map(stationGpsToWorld);
  if(!poly.some(p=>gcd(p,origin)<28))continue;
  result.push(poly);
 }
 return result;
}
function polygonGap(p,poly){
 let inside=false,min=Infinity;
 for(let i=0,j=poly.length-1;i<poly.length;j=i++){
  const a=poly[j],b=poly[i],dx=b.x-a.x,dz=b.z-a.z;
  const lengthSq=dx*dx+dz*dz;
  if(lengthSq>.001){
   const t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.z-a.z)*dz)/lengthSq));
   min=Math.min(min,Math.hypot(p.x-a.x-dx*t,p.z-a.z-dz*t));
  }
  if(((a.z>p.z)!==(b.z>p.z))&&
    p.x<(b.x-a.x)*(p.z-a.z)/(b.z-a.z)+a.x)inside=!inside;
 }
 return inside?-min:min;
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
 const start={x:x+nx*PAD_DEPTH/2,
  z:z+nz*PAD_DEPTH/2};
 const end=selected.end;
 // Overlap the EXISTING pad by 12cm and end in the visible mapped path.
 const length=gcd(start,end);
 if(length<4||length>10)return null;
 const ux=(end.x-start.x)/length,uz=(end.z-start.z)/length;
 const side={x:-uz,z:ux};
 if(!selected.segment.carriageway.isClear(end.x,end.z,.9,.08))
  return null;
 const protectedSegments=nearbyProtectedSegments(elements,Number(footway.id),{x,z});
 if(!protectedSegments.length)return null;
 const connectorBasic={start,end,side,length};
 const forecourtRows=buildForecourtRows({
  x,z,nx,nz,depth:PAD_DEPTH,connector:connectorBasic
 });
 const buildings=nearBuildingPolygons(elements,{x,z},Number(tower.id));
 let otherRoadMargin=Infinity,buildingMargin=Infinity,expandedArea=0;
 let widest=0,narrowest=Infinity;
 // Validate the *actual expanded boundary*, not the old narrow
 // connector. Interpolate between rows to cover their whole area.
 for(let i=PAD_ROWS;i<forecourtRows.length-1;i++){
  const a=forecourtRows[i],b=forecourtRows[i+1];
  for(let si=0;si<=2;si++){
   const u=si/2;
   const row={
    x:a.x+(b.x-a.x)*u,z:a.z+(b.z-a.z)*u,
    side:normalize({
     x:a.side.x+(b.side.x-a.side.x)*u,
     z:a.side.z+(b.side.z-a.side.z)*u
    }),
    station:a.station+(b.station-a.station)*u,
    road:a.road+(b.road-a.road)*u
   };
   const width=row.station+row.road;
   widest=Math.max(widest,width);
   narrowest=Math.min(narrowest,width);
   for(let j=0;j<=16;j++){
    const p=sampleRow(row,j/16);
    const other=nearOtherMappedWay(protectedSegments,p);
    otherRoadMargin=Math.min(otherRoadMargin,other.clearance);
    if(other.clearance<.18||gcd(p,{x:cx,z:cz})<radius+.12)
     return null;
    for(const polygon of buildings){
     const gap=polygonGap(p,polygon);
     buildingMargin=Math.min(buildingMargin,gap);
     if(gap<.45)return null;
    }
   }
  }
  expandedArea+=(gcd(a,b))*(a.station+a.road+b.station+b.road)/2;
 }
 if(widest<4||narrowest<1.5||expandedArea<20)return null;
 // Align the new single-surface texture with the EXISTING clipped OSM
 // sidewalk's UV frame. osmStrip uses u=0..1 across 1.8m and v=distance/8
 // from the beginning of its rendered segment. Previously this forecourt
 // used localX/1.2 and localZ/1.2; the abrupt scale/angle change at the
 // landing looked like an attached patch in close mobile screenshots.
 const footwayDx=selected.segment.b.x-selected.segment.a.x;
 const footwayDz=selected.segment.b.z-selected.segment.a.z;
 const footwayLength=Math.hypot(footwayDx,footwayDz);
 if(footwayLength<.01)return null;
 const textureBasis={
  origin:{x:selected.segment.a.x,z:selected.segment.a.z},
  longitudinal:{x:footwayDx/footwayLength,z:footwayDz/footwayLength},
  lateral:{x:-footwayDz/footwayLength,z:footwayDx/footwayLength},
  footwayWidthMeters:1.8,repeatAlongMeters:8
 };
 const connector={
  start,end,side,length,widthStart:JOIN_WIDTH_AT_PAD,
  widthEnd:JOIN_WIDTH_AT_FOOTWAY,
  footwayWayId:footway.id,otherRoadMargin,buildingMargin,
  widestWidth:widest,narrowestWidth:narrowest,
  estimatedAreaM2:expandedArea+PAD_WIDTH*PAD_DEPTH,
  stationSideExpanded:true,roadSideConstrained:true,
  singleContinuousSurface:true,forecourtRows,textureBasis,
  uvAlignedWithMappedFootway:true,
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
  singleContinuousSurface:true,sourceLandscapeVegetationPreserved:true,
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
   nearbyBuildingMargin:plan?.connector?.buildingMargin??null,
   widestPavedWidth:plan?.connector?.widestWidth??0,
   narrowestPavedWidth:plan?.connector?.narrowestWidth??0,
   estimatedPavedAreaM2:plan?.connector?.estimatedAreaM2??0,
   oneContinuousSurface:!!root&&!!plan?.singleContinuousSurface,
   uvAlignedWithMappedFootway:!!root&&!!plan?.connector?.uvAlignedWithMappedFootway,
   preservedGreenery:!!root&&!!plan?.sourceLandscapeVegetationPreserved,
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
  // One continuous, NON-OVERLAPPING terrain-following mesh from the
  // entry threshold to the visibly rendered OSM sidewalk. Widening is
  // deliberately asymmetric toward the station. There is no separate
  // rectangular pad or pointed ribbon intersecting it.
  const vertices=[],uvs=[],indices=[];
  const rows=plan.connector.forecourtRows;
  const basis=plan.connector.textureBasis;
  for(const row of rows){
   for(let j=0;j<=ACROSS_ROWS;j++){
    const pt=sampleRow(row,j/ACROSS_ROWS);
    vertices.push(pt.x,terrainAt(pt.x,pt.z)+plan.groundOffset,pt.z);
    const dx=pt.x-basis.origin.x,dz=pt.z-basis.origin.z;
    // Same UV units, origin and rotation as the mapped OSM sidewalk strip.
    // World-projected UVs are continuous even as forecourt widths curve.
    uvs.push(.5+(dx*basis.lateral.x+dz*basis.lateral.z)/basis.footwayWidthMeters,
     (dx*basis.longitudinal.x+dz*basis.longitudinal.z)/basis.repeatAlongMeters);
   }
  }
  for(let i=0;i<rows.length-1;i++)for(let j=0;j<ACROSS_ROWS;j++){
   const k=i*(ACROSS_ROWS+1)+j,after=k+ACROSS_ROWS+1;
   // sideWEST crossed with directionOUT points upward in world coordinates.
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
  root.userData.singleContinuousSurface=true;
  root.userData.sourceAreaApproximate=true;
  layer.add(root);publish();
  return window.__miloviceBikeTowerEntryPaving;
 }
 publish();
 return {create,reset,status:()=>window.__miloviceBikeTowerEntryPaving,
  plan:()=>plan};
}
