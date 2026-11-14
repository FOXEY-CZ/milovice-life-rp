// Milovice RP 5.75 — a continuous road-like sidewalk strip instead of square panels.
// The 5.72 "fix" drew a new OSM sidewalk directly OVER Nádražní's asphalt,
// rather than removing the relevant strip from the parking surface.
// The user confirmed the exact topology: existing road (UNTOUCHED),
// narrow sidewalk from the OUTER/EAST edge of the parking island,
// and remaining gridded parking to its WEST. Reuse the same textured
// city sidewalk material without copying any Mapy.com imagery.
// Keep both parking banks and the independent right-hand entrance corner.
// Screenshots are VISUAL EVIDENCE only: no proprietary image is stored.
// Geometry is source-constrained, approximate, and drawn from our own shapes.
// NO Mapy.com screenshot pixels, panoramas, or textures are redistributed.
import {isRoadFreeRect} from './road-clearance.js';
import {stationGpsToWorld} from './station-forecourt-pass.js';

export const STATION_PARKING_REFERENCE=Object.freeze({
 westAccessWayId:675778842,eastStreetWayId:128308366,
 centralFootwayId:1165594426,rightCornerFootwayId:1282187911,
 kind:'photo-and-OSM-anchored-forecourt-paver-island',
 photos:Object.freeze([
  {url:'https://commons.wikimedia.org/wiki/File:Milovice,_n%C3%A1dra%C5%BE%C3%AD,_parkovi%C5%A1t%C4%9B.jpg',
   lat:50.2297692,lon:14.8823936,heading:200,date:'2024-05-30'},
  {url:'https://commons.wikimedia.org/wiki/File:Milovice,_n%C3%A1dra%C5%BE%C3%AD,_parkovi%C5%A1t%C4%9B_(01).jpg',
   lat:50.2296525,lon:14.8823131,heading:200,date:'2024-05-30'}
 ]),
 author:'ŠJů',license:'CC BY 4.0',
 userReference:'user-shared 2022-05-17 Mapy.com comparison, observation only, no image retained',
 observed:['two dark asphalt routes bound a large pale paved parking island',
  'wide pale concrete-block paving rather than narrow detached strips',
  'second grass-grid parking row across the western access road',
  'outer Nádražní-facing sidewalk CARVED FROM the safe parking-island footprint, aligned with nearby OSM 1165594426',
  'separate paved right corner at the road entrance, connected to mapped footway 1282187911',
  'rounded island tip and a low kerb','bike tower and rail-side vegetation'],
 excluded:['unlocated trees and traffic signs','imaginary parked cars','invented new asphalt roads'],
 accuracy:'Photo-informed broad surface and tip. Only OSM road centerlines are georeferenced. Edges, counts and paving pattern are approximations.'
});
const d2=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
function closestPointToPolyline(p,poly){
 let best=null;
 for(let i=1;i<poly.length;i++){
  const a=poly[i-1],b=poly[i],dx=b.x-a.x,dz=b.z-a.z;
  const n=dx*dx+dz*dz;
  if(n<.0001)continue;
  const t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.z-a.z)*dz)/n));
  const x=a.x+dx*t,z=a.z+dz*t;
  const distance=d2(p,{x,z});
  if(!best||distance<best.distance)best={x,z,distance,i,t};
 }
 return best;
}
function signedPolygonGap(p,poly){
 let inside=false,min=Infinity;
 for(let i=0,j=poly.length-1;i<poly.length;j=i++){
  const a=poly[j],b=poly[i],dx=b.x-a.x,dz=b.z-a.z,n=dx*dx+dz*dz;
  const t=n?Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.z-a.z)*dz)/n)):0;
  min=Math.min(min,Math.hypot(p.x-a.x-t*dx,p.z-a.z-t*dz));
  if((a.z>p.z)!==(b.z>p.z)&&p.x<(b.x-a.x)*(p.z-a.z)/(b.z-a.z)+a.x)
   inside=!inside;
 }
 return inside?-min:min;
}
function frame(a,b){
 const length=d2(a,b);
 if(length<55||length>95)return null;
 const ux=(b.x-a.x)/length,uz=(b.z-a.z)/length;
 return {a,b,length,ux,uz,nx:-uz,nz:ux,yaw:Math.atan2(-uz,ux)};
}
function at(f,along,offset){
 return {x:f.a.x+f.ux*along+f.nx*offset,z:f.a.z+f.uz*along+f.nz*offset};
}
// The user requested a single road-like strip, not Minecraft-like squares.
// Each band cross-section lies WITHIN the OSM-safe island cells. Halfway
// intersections connect adjacent rows with diagonal transitions; they never
// claim ground outside the approved parking-island footprint.
export function planContinuousOuterSidewalk(tiles,{rowStep=.76,overlap=.006}={}){
 const grouped=new Map();
 for(const p of tiles){
  if(!grouped.has(p.along))grouped.set(p.along,[]);
  grouped.get(p.along).push(p);
 }
 const rows=[...grouped.entries()].sort((a,b)=>a[0]-b[0]).map(([along,cells])=>{
  const sorted=cells.slice().sort((a,b)=>a.offset-b.offset);
  return {along,low:sorted[0].offset-sorted[0].depth/2-overlap,
   high:sorted.at(-1).offset+sorted.at(-1).depth/2+overlap,
   length:Math.min(...sorted.map(c=>c.length))};
 });
 const parts=[],minJoinWidth=.38;
 let active=null,joins=0;
 const cap=(row,side)=>({along:row.along+side*(row.length/2+overlap),
  low:row.low,high:row.high});
 function add(p){
  if(!active)active=[];
  if(!active.length||p.along>active.at(-1).along+.000001)active.push(p);
 }
 function finish(row){
  if(!active)return;
  add(cap(row,1));
  if(active.length>=2)parts.push(active);
  active=null;
 }
 for(let i=0;i<rows.length;i++){
  const current=rows[i],previous=rows[i-1];
  if(!previous){
   add(cap(current,-1));add({along:current.along,low:current.low,high:current.high});
   continue;
  }
  const gap=current.along-previous.along;
  const low=Math.max(current.low,previous.low);
  const high=Math.min(current.high,previous.high);
  if(gap>rowStep+.045||high-low<minJoinWidth){
   finish(previous);
   add(cap(current,-1));add({along:current.along,low:current.low,high:current.high});
   continue;
  }
  add({along:(current.along+previous.along)/2,low,high});
  add({along:current.along,low:current.low,high:current.high});
  joins++;
 }
 if(rows.length)finish(rows.at(-1));
 return {parts,rows:rows.length,joins,
  metres:parts.reduce((n,p)=>n+p.at(-1).along-p[0].along,0),
  triangles:parts.reduce((n,p)=>n+Math.max(0,p.length-1)*2,0),
  pavementPanels:0,continuous:parts.length===1,
  roadFootprintExpansion:false,photoEstimatedWidth:true};
}
export function planStationPhotoParking(elements,roadClearance){
 if(!Array.isArray(elements)||!roadClearance?.isClear)return null;
 const west=elements.find(e=>Number(e.id)===STATION_PARKING_REFERENCE.westAccessWayId);
 const east=elements.find(e=>Number(e.id)===STATION_PARKING_REFERENCE.eastStreetWayId);
 if(west?.tags?.highway!=='service'||west.tags.oneway!=='yes'||
    west.geometry?.length<2||east?.tags?.highway!=='residential'||
    east.geometry?.length<4)return null;
 const f=frame(stationGpsToWorld(west.geometry[0]),stationGpsToWorld(west.geometry[1]));
 if(!f)return null;
 const other=east.geometry.map(stationGpsToWorld);
 // 2024 geotagged photography shows the lane, not surveyed stone outlines.
 const cameras=STATION_PARKING_REFERENCE.photos.map(photo=>{
  const p=stationGpsToWorld(photo),q=closestPointToPolyline(p,
   west.geometry.map(stationGpsToWorld));
  return {...q,along:(p.x-f.a.x)*f.ux+(p.z-f.a.z)*f.uz};
 });
 if(cameras.some(c=>!c||c.distance>3||c.along<15||c.along>f.length))return null;
 const buildings=elements.filter(e=>e.tags?.building&&e.geometry?.length>=4)
  .map(e=>e.geometry.map(stationGpsToWorld))
  .filter(poly=>poly.some(p=>d2(p,f.a)<110));
 const rails=elements.filter(e=>e.tags?.railway==='rail'&&e.geometry?.length>=2)
  .map(e=>e.geometry.map(stationGpsToWorld))
  .filter(line=>line.some(p=>d2(p,f.a)<130));
 const cells=[],curbs=[],rejected=[];
 // Exact right-side offset is recalculated against the SECOND mapped road
 // every row. We never paint rectangles between arbitrary parallel vectors.
 const length=.75,depth=.73,alongStep=.76,acrossStep=.74;
 const rowStats=[];
 for(let along=-1.2;along<f.length-3.6;along+=alongStep){
  const middle=at(f,along,0),near=closestPointToPolyline(middle,other);
  if(!near)continue;
  const gap=(near.x-middle.x)*f.nx+(near.z-middle.z)*f.nz;
  const longitudinal=(near.x-middle.x)*f.ux+(near.z-middle.z)*f.uz;
  if(gap<7||gap>20||Math.abs(longitudinal)>3.5)continue;
  // Modelled 4.5m western service and 7.8m eastern residential ways.
  // Do not turn OSM centreline buffers into a fictitious new vehicle road.
  let left=2.35,right=gap-3.98;
  if(right-left<1.3)continue;
  const center=(left+right)*.5;
  let half=(right-left)*.5;
  // The south tip is rounded instead of a sharp rectangular start.
  // Radius is an approximation informed by the supplied 2022 comparison.
  const nose=Math.max(0,Math.min(1,(along+1.4)/6,(f.length-2.5-along)/5));
  half*=Math.sqrt(Math.max(.01,1-(1-nose)**2));
  left=center-half;right=center+half;
  let acceptedRow=0;
  // The OUTER pedestrian route is the mapped OSM footway to the east of
  // these parking cells, so restore the full inside width. Reserving
  // this western edge was the mistaken 5.71 placement.
  for(let offset=2.52;offset<gap-3.96;offset+=acrossStep){
   if(offset<left+depth*.47||offset>right-depth*.47)continue;
   const p=at(f,along,offset);
   // Whole tile's footprint (not just its centre) clears ALL OSM roads and
   // footpaths. False-painted asphalt and clipped sidewalks are forbidden.
   if(!isRoadFreeRect(roadClearance,{
    ...p,length,depth,yaw:f.yaw,buffer:.025,step:.33
   })){rejected.push({along,offset,reason:'road-or-footway'});continue}
   const safetyPoints=[
    p,at(f,along-length*.5,offset-depth*.5),
    at(f,along+length*.5,offset+depth*.5),
    at(f,along-length*.5,offset+depth*.5),
    at(f,along+length*.5,offset-depth*.5)
   ];
   if(safetyPoints.some(pt=>buildings.some(poly=>signedPolygonGap(pt,poly)<.22))){
    rejected.push({along,offset,reason:'building'});continue;
   }
   if(safetyPoints.some(pt=>rails.some(line=>
    (closestPointToPolyline(pt,line)?.distance??Infinity)<1.65))){
    rejected.push({along,offset,reason:'railway'});continue;
   }
   cells.push({...p,along,offset,length,depth,yaw:f.yaw});
   acceptedRow++;
  }
  rowStats.push({along,betweenRoadsMetres:gap,accepted:acceptedRow});
  if(acceptedRow){
   // Curbs border the PHOTO-APPROXIMATE island, not the carriageway.
   // Their tiny sections are each checked against mapped road surfaces.
   // The eastern curb is rebuilt from the LAST safe tile edge below:
   // the old gap-4.16 curb crossed the proposed sidewalk itself.
   for(const edge of [2.52]){
    const p=at(f,along,edge);
    if(!isRoadFreeRect(roadClearance,{
     ...p,length:.71,depth:.11,yaw:f.yaw,buffer:.03,step:.26
    }))continue;
    if(buildings.some(poly=>signedPolygonGap(p,poly)<.20))continue;
    curbs.push({...p,yaw:f.yaw});
   }
  }
 }
 if(!cells.length)return null;
 // 5.68: opposite (rail-side) parking is a SEPARATE row across the existing
 // western access asphalt. The screenshot shows grass-grid slabs there.
 // Reserve a FULL 1.54m pedestrian strip outside the parking; never assume
 // every untagged grassy patch belongs to the parking bay.
 const railSideParking=[],railRejected=[];
 const railParkingOffset=-5.03,railParkingDepth=4.02;
 const safePlace=(p,length,depth,buffer=.12)=>{
  if(!isRoadFreeRect(roadClearance,{...p,length,depth,yaw:f.yaw,buffer,step:.36}))
   return 'mapped-road-or-footway';
  for(let i=-3;i<=3;i++)for(let j=-4;j<=4;j++){
   const q=at(f,(p.x-f.a.x)*f.ux+(p.z-f.a.z)*f.uz+i*length/6,
    (p.x-f.a.x)*f.nx+(p.z-f.a.z)*f.nz+j*depth/8);
   if(buildings.some(poly=>signedPolygonGap(q,poly)<.30))return 'building-footprint';
   if(rails.some(line=>(closestPointToPolyline(q,line)?.distance??Infinity)<2.30))
    return 'railway-clearance';
  }
  return null;
 };
 for(let along=8;along<=Math.min(65,f.length-8);along+=2.85){
  const p=at(f,along,railParkingOffset);
  const failure=safePlace(p,2.46,railParkingDepth);
  if(failure)railRejected.push({along,kind:'parking',reason:failure});
  else railSideParking.push({...p,along,offset:railParkingOffset,yaw:f.yaw,
   length:2.46,depth:railParkingDepth});
 }
 // A central candidate cell must have EXACTLY ONE role. We partition
 // ALL validated OSM-safe island tiles into parking OR outer sidewalk.
 // No extra terrain is claimed, so no new path can overlay the road.
 // Partitioning is below, after verifying the mapped OUTER path's identity.
 const centralFootway=elements.find(e=>
  Number(e.id)===STATION_PARKING_REFERENCE.centralFootwayId);
 const cornerWay=elements.find(e=>
  Number(e.id)===STATION_PARKING_REFERENCE.rightCornerFootwayId);
 if(centralFootway?.tags?.highway!=='footway'||centralFootway.geometry?.length<7||
    cornerWay?.tags?.highway!=='footway'||cornerWay.geometry?.length<4)return null;
 // The OUTER walking strip is a REAL OSM highway=footway. Model it with
 // the SAME textured terrain-hugging sidewalk mesh as all city footpaths,
 // not 80 bright 3D BoxGeometry tiles. The city road renderer owns the
 // material, shared UV mapping and photo-specific y-layer override.
 // Three OSM segments [4->5,5->6,6->7] border the outer Nádražní edge.
 const outerFootwayPoints=centralFootway.geometry.slice(4,8).map(stationGpsToWorld);
 const frameCoord=p=>({
  along:(p.x-f.a.x)*f.ux+(p.z-f.a.z)*f.uz,
  offset:(p.x-f.a.x)*f.nx+(p.z-f.a.z)*f.nz
 });
 const outerFootwayStations=outerFootwayPoints.map(frameCoord);
 if(outerFootwayStations.length!==4||
    outerFootwayStations[0].along>-1||outerFootwayStations[0].along< -8||
    outerFootwayStations.at(-1).along<70||
    outerFootwayStations.some((p,i)=>i&&p.along<=outerFootwayStations[i-1].along))
  return null;
 // Photographed outside = larger lateral offset from the service lane
 // and closer to Nádražní. This invariant prevents another side swap.
 for(let i=0;i<3;i++){
  const p=outerFootwayPoints[i];
  const station=outerFootwayStations[i];
  const outsideRoad=closestPointToPolyline(p,other)?.distance??0;
  if(outsideRoad<2.5||station.offset<5)return null;
 }
 const walkWidth=1.8;
 const outerFootwaySegments=outerFootwayPoints.slice(1).map((b,i)=>({
  from:outerFootwayPoints[i],to:b,sourceWayId:centralFootway.id,
  waySegmentIndex:i+5,metres:d2(outerFootwayPoints[i],b)
 }));
 if(outerFootwaySegments.some(s=>s.metres<2))return null;
 // 5.73: reserve the TWO most easterly columns (where available) on each
 // photographed parking-island cross-section. This removes these pavers
 // from PARKING and replaces them in situ with a sidewalk texture. Every
 // selected footprint was already road/footway/rail/building checked above.
 // The outside position is checked against the actual outer OSM footway.
 const perRow=new Map();
 for(const cell of cells){
  if(!perRow.has(cell.along))perRow.set(cell.along,[]);
  perRow.get(cell.along).push(cell);
 }
 // 5.74 photo QA: 5.73's parking/sidewalk polarity is correct, but the
 // road-facing island edge has isolated one-cell fingers. They come from
 // rasterized tiles surviving an OSM road-buffer check in one row, while
 // adjacent rows fail it. TRIM those individual protrusions; never extend
 // the sidewalk out into Nádražní and never modify a mapped carriageway.
 const orderedRows=[...perRow.entries()].sort((a,b)=>a[0]-b[0]);
 const edgeSpursRemoved=new Set();
 for(const [,row] of orderedRows){
  row.sort((a,b)=>a.offset-b.offset);
  // A cell separated by a missing whole tile is not continuous paving.
  while(row.length>=4&&
   row.at(-1).offset-row.at(-2).offset>acrossStep+.035){
   edgeSpursRemoved.add(row.pop());
  }
 }
 for(let i=1;i<orderedRows.length-1;i++){
  const [station,row]=orderedRows[i];
  const [priorStation,prior]=orderedRows[i-1];
  const [nextStation,next]=orderedRows[i+1];
  if(row.length<4||!prior.length||!next.length||
     station-priorStation>alongStep+.035||nextStation-station>alongStep+.035)
   continue;
  const outer=row.at(-1).offset;
  // Remove a sole one-tile spike on the outer boundary; the .74m tile
  // cannot be part of a smoothly joined curb at two smaller neighbours.
  if(outer>Math.max(prior.at(-1).offset,next.at(-1).offset)+acrossStep*.77)
   edgeSpursRemoved.add(row.pop());
 }
 if(edgeSpursRemoved.size){
  for(let i=cells.length-1;i>=0;i--)
   if(edgeSpursRemoved.has(cells[i]))cells.splice(i,1);
  for(const patch of edgeSpursRemoved)
   rejected.push({along:patch.along,offset:patch.offset,reason:'isolated-outer-island-spur'});
  for(const r of rowStats)
   if(perRow.has(r.along))r.accepted=perRow.get(r.along).length;
 }
 const centralParkingCells=[],outerSidewalkCells=[],outerSidewalkCurbs=[];
 let outerSidewalkMaxOsmDistance=0;
 for(const row of perRow.values()){
  row.sort((a,b)=>a.offset-b.offset);
  const reserved=Math.min(row.length,row.length>=3?2:1);
  const split=row.length-reserved;
  centralParkingCells.push(...row.slice(0,split));
  const pathCells=row.slice(split);
  for(const patch of pathCells){
   const source=closestPointToPolyline(patch,outerFootwayPoints);
   const distance=source?.distance??Infinity;
   // The photo tells us which SIDE to build on. Actual pedestrian paving
   // is INSIDE the island, NOT along the OSM path where 5.72 hit asphalt.
   if(distance>4.5)return null;
   outerSidewalkMaxOsmDistance=Math.max(outerSidewalkMaxOsmDistance,distance);
   outerSidewalkCells.push(patch);
  }
  // Keep a low curb on the road-facing boundary of the new sidewalk,
  // deliberately INSET from the last SAFE paver footprint.
  const edge=pathCells.at(-1);
  if(edge){
   const curb=at(f,edge.along,edge.offset+edge.depth/2-.085);
   if(isRoadFreeRect(roadClearance,{
    ...curb,length:.70,depth:.10,yaw:f.yaw,buffer:.015,step:.25
   }))outerSidewalkCurbs.push({...curb,yaw:f.yaw,along:edge.along});
  }
 }
 if(outerSidewalkCells.length<100||centralParkingCells.length<270)
  return null;
 const continuousRibbon=planContinuousOuterSidewalk(outerSidewalkCells);
 if(!continuousRibbon.parts.length||continuousRibbon.joins<60||
    continuousRibbon.metres<45)return null;
 // Refuse any stranded road-side edge tile; no "floating fingers".
 for(const [station,row] of orderedRows){
  if(row.length>=2&&row.at(-1).offset-row.at(-2).offset>acrossStep+.035)
   return null;
 }
 if(centralParkingCells.length+outerSidewalkCells.length!==cells.length)
  throw Error('Island parking/footpath partition has a missing or double-used cell');
 // The OUTER edge must remain pedestrian, and no parking tile may lie
 // further toward Nádražní in the same row.
 for(const foot of outerSidewalkCells){
  if(centralParkingCells.some(p=>p.along===foot.along&&p.offset>foot.offset))
   return null;
 }

 // User's RIGHT-HAND curved sidewalk is the southern corner by this
 // photographed, mapped east-bound footway. Extend only its exterior edge,
 // never paint through the OSM footway or a roadway.
 const cornerPaving=[],cornerCurbs=[],cornerRejected=[];
 const cornerPoint=stationGpsToWorld(cornerWay.geometry[2]);
 const nextPoint=stationGpsToWorld(cornerWay.geometry[3]);
 const dx=nextPoint.x-cornerPoint.x,dz=nextPoint.z-cornerPoint.z;
 const segmentLength=Math.hypot(dx,dz);
 if(segmentLength<65||segmentLength>160)return null;
 const ux=dx/segmentLength,uz=dz/segmentLength,nx=-uz,nz=ux;
 const cornerYaw=Math.atan2(-uz,ux);
 // Choose the side with greatest clearance to ALL mapped streets, not
 // merely Nádražní. The opposite side is Školská (OSM 22880480):
 // choosing it would bury the supposedly right-hand sidewalk in asphalt.
 const sideCandidates=[-1,1].map(side=>{
  const point={x:cornerPoint.x+nx*side*1.9,
   z:cornerPoint.z+nz*side*1.9};
  return {side,clearance:roadClearance.nearest(point)?.clearance??-Infinity};
 });
 sideCandidates.sort((a,b)=>b.clearance-a.clearance);
 const cornerSide=sideCandidates[0].side;
 const cornerAt=(along,lateral)=>({
  x:cornerPoint.x+ux*along+nx*cornerSide*lateral,
  z:cornerPoint.z+uz*along+nz*cornerSide*lateral
 });
 const cornerSafe=(point,length,depth,buffer=.09)=>{
  if(!isRoadFreeRect(roadClearance,{...point,
   length,depth,yaw:cornerYaw,buffer,step:.28}))return 'road-or-mapped-walkway';
  // Four true corners must remain outside buildings and railway exclusion.
  for(const x of [-length*.5,0,length*.5])for(const z of [-depth*.5,0,depth*.5]){
   const q={x:point.x+ux*x+nx*z,z:point.z+uz*x+nz*z};
   if(buildings.some(poly=>signedPolygonGap(q,poly)<.30))return 'building';
   if(rails.some(line=>(closestPointToPolyline(q,line)?.distance??Infinity)<2))
    return 'rail';
  }
  return null;
 };
 // Rounded/widening apron next to an ACTUAL mapped walking route, in a
 // small entrance corner only. The centreline itself remains OSM-rendered.
 for(let along=1.3;along<17.2;along+=.74){
  for(const lateral of [1.55,2.28]){
   // Slightly narrower right at the turning corner instead of sharp edges.
   if(along<3.9&&lateral>2)continue;
   const point=cornerAt(along,lateral);
   const failure=cornerSafe(point,.69,.62);
   if(failure){cornerRejected.push({along,lateral,reason:failure});continue}
   cornerPaving.push({...point,along,lateral,length:.69,depth:.62,yaw:cornerYaw});
  }
  const kerb=cornerAt(along,2.75);
  if(!cornerSafe(kerb,.65,.12,.025))
   cornerCurbs.push({...kerb,along,yaw:cornerYaw});
 }
 return {cells,curbs,rejected,rowStats,frame:f,cameras,
  railSideParking,railRejected,
  outerFootwaySegments,outerFootwayStations,outerSidewalkCells,
  outerSidewalkCurbs,outerSidewalkMaxOsmDistance,
  edgeSpursTrimmed:edgeSpursRemoved.size,continuousRibbon,
  centralParkingCells,cornerPaving,cornerCurbs,cornerRejected,
  rightCornerFootwayId:cornerWay.id,centralFootwayId:centralFootway.id,
  incorrectlyPlacedRailSidewalkRemoved:true,
  parkingBanks:['central-between-roads','opposite-rail-side'],
  pedestrianCorridorWidth:1.48,pedestrianSeparation:0,
  centralPedestrianSurface:'carved-from-OSM-safe-outer-parking-cells',
  centralParkingSurface:'remaining-inner-grid-parking-cells',
  pedestrianStripSide:'outer-east-facing-Nadrazni-128308366',
  pedestrianStripOsmAnchored:false,pedestrianStripPhotoEstimated:true,
  outerFootwayRendering:'continuous-roadlike-terrain-ribbon-city-paving',
  originalRoadSurfaceUnmodified:true,
  mistakenParkingAsSidewalkRemoved:true,
  mappedFootwayIdPreserved:centralFootway.id,
  sourceIds:[west.id,east.id],sourcePhotos:STATION_PARKING_REFERENCE.photos.length,
  groundType:'concrete-paving-island',exactParkingOutlineMeasured:false,
  photoInformed:true,modelledRoundedNose:true,legacyDetachedStripsRemoved:true,
  protectedRoadsAndPaths:true,protectedBuildings:true,protectedRailways:true,
  originalCarriagewaysUntouched:true};
}
export function makeStationPhotoParkingScene(THREE,{layer,terrainAt=()=>0,roadClearance}={}){
 const roots=[],geo=new THREE.BoxGeometry(1,1,1);
 const material={
  grout:new THREE.MeshLambertMaterial({color:0x92928a}),
  paver:new THREE.MeshLambertMaterial({color:0xc7c6bd}),
  curb:new THREE.MeshLambertMaterial({color:0xb9b9b3}),
  railGrid:new THREE.MeshLambertMaterial({color:0x69794f}),
  railPaver:new THREE.MeshLambertMaterial({color:0xc1c3b9}),
  sidewalk:new THREE.MeshLambertMaterial({color:0xe0dcd1})
 };
 let planned=null,drawMeshes=0,instances=0,sharedSidewalkTexture=false;
 const stats=()=>({
  active:roots.length>0,sourceIds:planned?.sourceIds||[],
  photos:STATION_PARKING_REFERENCE.photos.length,
  pavingCells:planned?.cells.length||0,curbSegments:planned?.curbs.length||0,
  rejectedCells:planned?.rejected.length||0,
  coveredRows:planned?.rowStats.filter(r=>r.accepted>0).length||0,
  parkingBanks:planned?.parkingBanks||[],
  oppositeParkingBays:planned?.railSideParking.length||0,
  centralParkingTiles:planned?.centralParkingCells.length||0,
  centralMistakenSidewalkTiles:0,
  mappedOuterSidewalkSegments:planned?.outerFootwaySegments.length||0,
  outerSidewalkRendering:planned?.outerFootwayRendering||null,
  outerSidewalkPatches:planned?.outerSidewalkCells.length||0,
  outerSidewalkCurbs:planned?.outerSidewalkCurbs.length||0,
  isolatedOuterSpursRemoved:planned?.edgeSpursTrimmed||0,
  continuousSidewalkSegments:planned?.continuousRibbon.parts.length||0,
  continuousSidewalkJoins:planned?.continuousRibbon.joins||0,
  continuousSidewalkMetres:planned?.continuousRibbon.metres||0,
  continuousSidewalkTriangles:planned?.continuousRibbon.triangles||0,
  sidewalkPanelCount:planned?.continuousRibbon.pavementPanels??null,
  continuousKerb:true,
  maxOuterFootwayOsmDistance:planned?.outerSidewalkMaxOsmDistance??null,
  visibleOuterSidewalkTiles:0,
  oldInnerSidewalkTiles:0,
  roadSurfaceUnmodified:planned?.originalRoadSurfaceUnmodified||false,
  sharedCitySidewalkTexture:sharedSidewalkTexture,
  visibleSidewalkWidth:planned?.pedestrianCorridorWidth||0,
  sidewalkParkingGap:planned?.pedestrianSeparation??null,
  visibleSidewalkSide:planned?.pedestrianStripSide||null,
  centralWalkwaySource:planned?.centralPedestrianSurface||null,
  parkingSidewalkSwapFixed:planned?.mistakenParkingAsSidewalkRemoved||false,
  rightCornerPavingTiles:planned?.cornerPaving.length||0,
  rightCornerCurbs:planned?.cornerCurbs.length||0,
  wrongRailSidewalkTiles:0,
  wrongRailSidewalkRemoved:planned?.incorrectlyPlacedRailSidewalkRemoved||false,
  sidewalkWidth:planned?.pedestrianCorridorWidth||0,
  mappedFootwayIdPreserved:planned?.mappedFootwayIdPreserved||null,
  rightCornerFootwayId:planned?.rightCornerFootwayId||null,
  surface:'walkway-carved-from-outer-safe-parking-no-road-overlays',
  oldDetachedPaverStripsRemoved:true,
  roundedTip:true,drawMeshes,instances,
  collisionSafe:true,estimatedLayout:true,noSyntheticCars:true,sourceAnchored:true
 });
 const publish=()=>{if(typeof window!=='undefined')window.__miloviceStationParking=stats()};
 function batch(group,mat,items,colors=null){
  if(!items.length)return;
  const mesh=new THREE.InstancedMesh(geo,mat,items.length);
  const dummy=new THREE.Object3D(),tint=new THREE.Color();
  for(let i=0;i<items.length;i++){
   const p=items[i];dummy.position.set(p.x,p.y,p.z);
   dummy.rotation.set(0,p.yaw,0);dummy.scale.set(p.sx,p.sy,p.sz);
   dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);
   if(colors)mesh.setColorAt(i,tint.setHex(colors[i%colors.length]));
  }
  mesh.instanceMatrix.needsUpdate=true;
  if(colors)mesh.instanceColor.needsUpdate=true;
  mesh.computeBoundingSphere();group.add(mesh);drawMeshes++;instances+=items.length;
 }
 // Join all reserved outer island cells into ONE textured ground mesh.
 // Zero BoxGeometry slabs for the sidewalk; every world-space corner comes
 // from the exact original OSM-validated parking footprint.
 function texturedOuterSidewalk(group,tiles,material){
  if(!tiles.length||!material)return;
  const vertices=[],uvs=[],indices=[];
  const chamfers=planOuterSidewalkChamfers(tiles);
  for(const p of tiles){
   const k=vertices.length/3;
   // Each 0.75x0.73 tile occupies a 0.76x0.74 grid. Expand by 6mm
   // within the existing 25mm clearance buffer to hide bright-green
   // terrain pinstripes. This is a VISUAL seam closure, not new territory.
   const overlap=.006;
   const clip=chamfers.get(p)||{start:0,end:0};
   const corners=[
    [p.along-p.length/2-overlap,p.offset-p.depth/2-overlap],
    [p.along+p.length/2+overlap,p.offset-p.depth/2-overlap],
    [p.along+p.length/2+overlap,p.offset+p.depth/2+overlap-clip.end],
    [p.along-p.length/2-overlap,p.offset+p.depth/2+overlap-clip.start]
   ];
   for(const [along,offset] of corners){
    const pt=at(planned.frame,along,offset);
    vertices.push(pt.x,terrainAt(pt.x,pt.z)+.214,pt.z);
    // Same ground-paving UV scale and material as regular city sidewalks.
    uvs.push(offset/1.8,along/8);
   }
   // Upward-facing winding in x,z world coordinates.
   indices.push(k,k+2,k+1,k,k+3,k+2);
  }
  const geometry=new THREE.BufferGeometry();
  geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));
  geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));
  geometry.setIndex(indices);geometry.computeVertexNormals();
  const mesh=new THREE.Mesh(geometry,material);
  mesh.receiveShadow=true;mesh.name='OuterParkingCarvedTexturedFootway';
  group.add(mesh);drawMeshes++;
 }
 function create(elements,{sidewalkMaterial}={}){
  if(roots.length)return stats();
  planned=planStationPhotoParking(elements,roadClearance);
  if(!planned){publish();return stats()}
  const group=new THREE.Group();group.name='PhotoStationForecourtPavedIsland_2022_2024';
  sharedSidewalkTexture=!!sidewalkMaterial?.map;
  group.userData.photoInformedLayout=true;
  group.userData.estimatedParkingPolygon=true;
  group.userData.sourceWayIds=planned.sourceIds;
  group.userData.needsVisualReview=true;
  group.userData.lodX=planned.frame.a.x+planned.frame.ux*31;
  group.userData.lodZ=planned.frame.a.z+planned.frame.uz*31;
  group.userData.lodDetail=true;
  const grout=[],stones=[],curb=[];
  const oppositeGrass=[],oppositePavers=[],sidewalkPavers=[];
  for(const p of planned.centralParkingCells){
   const y=terrainAt(p.x,p.z);
   // Nearly seamless backing slabs eliminate the old green pinstripes.
   // Each cell's 2x2 smaller concrete blocks share the same instanced
   // geometry/material, rather than one overbright sidewalk-sized panel.
   // Seamless backing stays inside the validated 25mm road-clearance
   // margin; smaller stone blocks remain on the proper parking side.
   grout.push({...p,y:y+.156,sx:p.length+.012,sy:.030,sz:p.depth+.012});
   for(let i=-1;i<=1;i+=2)for(let j=-1;j<=1;j+=2){
    const q=at(planned.frame,p.along+i*.185,p.offset+j*.181);
    stones.push({...q,y:terrainAt(q.x,q.z)+.178,yaw:p.yaw,
     sx:.346,sy:.027,sz:.337});
   }
  }
  for(const p of planned.curbs)
   curb.push({...p,y:terrainAt(p.x,p.z)+.209,sx:.75,sy:.103,sz:.11});
  // 5.69: keep the real opposite parking bank without a false footpath behind it.
  // green-grid surface, NOT a duplicate of the broad central pale island.
  for(const bay of planned.railSideParking){
   const y=terrainAt(bay.x,bay.z);
   oppositeGrass.push({...bay,y:y+.159,sx:bay.length,sy:.024,sz:bay.depth});
   for(let i=0;i<4;i++)for(let j=0;j<7;j++){
    const p=at(planned.frame,bay.along+(i-1.5)*.58,
     bay.offset+(j-3)*.53);
    oppositePavers.push({...p,y:terrainAt(p.x,p.z)+.181,
     yaw:bay.yaw,sx:.49,sy:.026,sz:.40});
   }
  }
  // Road edges stay EXACTLY as in 5.72, but the wrongly forced full-width
  // road-facing overlay is gone. A narrow pedestrian path is cut OUT of
  // the validated parking island, using the real city's paving texture.
  for(const p of planned.outerSidewalkCurbs)
   curb.push({...p,y:terrainAt(p.x,p.z)+.217,
    sx:.735,sy:.105,sz:.10});
  // Wrong rail-side sidewalk stays removed. Keep the RIGHT entrance corner
  // as a separate part of the observed pedestrian environment.
  for(const p of planned.cornerPaving)
   sidewalkPavers.push({...p,y:terrainAt(p.x,p.z)+.187,
    sx:p.length,sy:.058,sz:p.depth});
  for(const p of planned.cornerCurbs)
   curb.push({...p,y:terrainAt(p.x,p.z)+.155,
    sx:.65,sy:.135,sz:.12});
  batch(group,material.grout,grout);
  batch(group,material.paver,stones,[0xcac9c0,0xd4d1c8,0xc4c3bb,0xbdbeb6]);
  batch(group,material.railGrid,oppositeGrass);
  batch(group,material.railPaver,oppositePavers,
   [0xbcbeb4,0xcacbc1,0xaeb4a8,0xd4d2c7]);
  batch(group,material.sidewalk,sidewalkPavers);
  batch(group,material.curb,curb);
  texturedOuterSidewalk(group,planned.outerSidewalkCells,
   sidewalkMaterial||material.sidewalk);
  layer.add(group);roots.push(group);publish();return stats();
 }
 function reset(){
  for(const root of roots)root.parent?.remove(root);
  roots.length=0;planned=null;drawMeshes=instances=0;sharedSidewalkTexture=false;publish();
 }
 publish();
 return {create,reset,status:stats,plan:()=>planned};
}
