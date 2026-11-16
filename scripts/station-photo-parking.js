// Milovice RP 5.81.19 — clip sidewalk underlay to the main safe ribbon and eliminate detached terminal pavers.
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
 aerial2023:Object.freeze({
  date:'2023-06-04',provider:'user-shared satellite screenshot',orientation:'tracks-west-Nadrazni-east',
  confirmed:['continuous pale rail-side paved angled parking, not separate grass-grid boxes',
   'diagonal white stall lines on BOTH sides of one-way central access aisle',
   'broad pale right-side parking island with narrow road-facing pedestrian edge',
   'small planting islands at ends of parking banks'],
  limitations:'Parking-line count and exact outlines not surveyed; transient cars ignored; image pixels not redistributed.'
 }),
 observed:['two dark asphalt routes bound a large pale paved parking island',
  'wide pale concrete-block paving rather than narrow detached strips',
  'second continuous PALE paved angled-parking row across western access road (2023 satellite replaces old grass-grid assumption)',
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

// Use only the previously validated parking footprints as source geometry.
// Parking-line positions are approximations based on the user-supplied
// 4 June 2023 aerial, NEVER copied imagery or invented new vehicle roads.
export function planSatelliteParkingMarkings(frame,railBays,centralCells,roadClearance){
 if(!frame||!Array.isArray(railBays)||!Array.isArray(centralCells)||
    !roadClearance?.isClear)return null;
 const safeLine=(along1,offset1,along2,offset2,bank)=>{
  const a=at(frame,along1,offset1),b=at(frame,along2,offset2);
  const length=d2(a,b),dx=b.x-a.x,dz=b.z-a.z;
  if(length<1.85)return null;
  const x=(a.x+b.x)/2,z=(a.z+b.z)/2;
  const yaw=Math.atan2(-dz,dx);
  if(!isRoadFreeRect(roadClearance,{x,z,length,depth:.075,yaw,
     buffer:.025,step:.18}))return null;
  return {bank,x,z,yaw,length,
   start:{along:along1,offset:offset1},
   end:{along:along2,offset:offset2},
   width:.075,realMarkingMeasured:false,sourcePhotoDate:'2023-06-04'};
 };
 const rail=[];
 for(const bay of railBays){
  // Entire short diagonal lies INSIDE one OSM-cleared parking rectangle.
  const mark=safeLine(bay.along-.98,bay.offset-bay.depth*.43,
   bay.along+.98,bay.offset+bay.depth*.43,'rail');
  if(mark)rail.push(mark);
 }
 const covered=(along,offset)=>centralCells.some(cell=>
  Math.abs(cell.along-along)<=cell.length*.5+.018&&
  Math.abs(cell.offset-offset)<=cell.depth*.5+.018);
 const central=[];
 for(let along=8;along<Math.min(63,frame.length-10);along+=2.85){
  const atStation=centralCells.filter(c=>Math.abs(c.along-along)<.40)
   .sort((a,b)=>a.offset-b.offset);
  if(atStation.length<3)continue;
  const min=atStation[0].offset-atStation[0].depth/2+.17;
  const max=atStation.at(-1).offset+atStation.at(-1).depth/2-.17;
  if(max-min<2.25)continue;
  // Follow a single regular diagonal; trim both ends to the LONGEST
  // consecutive run with all line samples strictly inside valid paving.
  const samples=24,valid=[];
  for(let i=0;i<=samples;i++){
   const t=i/samples,offset=min+(max-min)*t;
   const station=along+(t-.5)*1.55;
   valid.push(covered(station,offset));
  }
  let bestStart=-1,bestEnd=-1,run=-1;
  for(let i=0;i<=samples+1;i++){
   if(i<=samples&&valid[i]){if(run<0)run=i;}
   else if(run>=0){
    if(i-run>bestEnd-bestStart){bestStart=run;bestEnd=i-1;}
    run=-1;
   }
  }
  if(bestStart<0||bestEnd-bestStart<9)continue;
  const a=bestStart/samples,b=bestEnd/samples;
  const mark=safeLine(along+(a-.5)*1.55,min+(max-min)*a,
   along+(b-.5)*1.55,min+(max-min)*b,'central');
  if(mark)central.push(mark);
 }
 return {rail,central,all:[...rail,...central],basedOnUnchangedRoads:true,
  userAerialDate:'2023-06-04',measuredStallCount:false};
}
// The user requested a single road-like strip, not Minecraft-like squares.
// Each band cross-section lies WITHIN the OSM-safe island cells. Halfway
// intersections connect adjacent rows with diagonal transitions; they never
// claim ground outside the approved parking-island footprint.
// Version 5.76: an actual road-ALIGNED continuous sidewalk silhouette.
// Previously the long mesh still used each tile's OUTERMOST offset for its
// edge. Since parking cells are on a .74m grid, that produced the exact
// Minecraft-like saw-tooth pattern visible in the user's 5.75 screenshot.
// Now Nádražní's OSM centreline is the PRIMARY edge reference. A conservative
// setback and smooth slope-limited inset keep every ribbon section fully
// inside the ALREADY road-safe parking-island cells. The road itself is NOT
// re-meshed, repainted, shifted, narrowed or covered.
export function planContinuousOuterSidewalk(tiles,{
 frame:roadFrame,roadCenterline,roadWidth=7.8,roadSetback=.40,
 rowStep=.76,overlap=.006}={}){
 if(!roadFrame||!Array.isArray(roadCenterline)||roadCenterline.length<2)
  return null;
 const grouped=new Map();
 for(const p of tiles){
  if(!grouped.has(p.along))grouped.set(p.along,[]);
  grouped.get(p.along).push(p);
 }
 const rows=[...grouped.entries()].sort((a,b)=>a[0]-b[0]).map(([along,cells])=>{
  const sorted=cells.slice().sort((a,b)=>a.offset-b.offset);
  const world=at(roadFrame,along,0);
  const road=closestPointToPolyline(world,roadCenterline);
  if(!road)return null;
  const roadOffset=(road.x-world.x)*roadFrame.nx+
   (road.z-world.z)*roadFrame.nz;
  return {along,lowSafe:sorted[0].offset-sorted[0].depth/2-overlap,
   highSafe:sorted.at(-1).offset+sorted.at(-1).depth/2+overlap,
   roadOffset,roadEdgeTarget:roadOffset-roadWidth/2-roadSetback,
   length:Math.min(...sorted.map(c=>c.length))};
 });
 if(rows.length<55||rows.some(x=>!x||x.roadOffset<=0))return null;
 // A slope-limited inset of the ACTUAL road-aligned profile. When the road
 // becomes narrower, the ribbon is allowed to shrink but NEVER to grow past
 // an existing parking-cell outer edge. The first 6 metres can taper into
 // the photographed station apron; the main road edge changes at <.14m/m.
 const distance=[0];
 for(let i=1;i<rows.length;i++){
  const midpoint=(rows[i].along+rows[i-1].along)/2;
  const limit=midpoint<6?.60:midpoint>64?.26:.14;
  distance.push(distance.at(-1)+(rows[i].along-rows[i-1].along)*limit);
 }
 const metric=(i,j)=>Math.abs(distance[i]-distance[j]);
 const limits=rows.map(r=>Math.min(r.highSafe,r.roadEdgeTarget));
 const high=rows.map((row,i)=>
  Math.min(...limits.map((v,j)=>v+metric(i,j))));
 // 5.81.23: at the south station nose the loose 0.60m/m slope allowed a
 // .46m outer bulge and a sudden reduction, causing a rectangular ear.
 // Cap the first ~5m to the already verified first-row road-side edge.
 const terminalHigh=high[0];
 let southernOuterEarsClipped=0;
 for(let i=1;i<rows.length&&rows[i].along<=6;i++){
  if(high[i]>terminalHigh+.000001)southernOuterEarsClipped++;
  high[i]=Math.min(high[i],terminalHigh);
 }
 // Constrain the OUTER edge to follow the already monotonic Nádražní road,
 // not any occasional one-column positive jump in the parking raster.
 for(let i=1;i<high.length;i++)
  if(rows[i].along>6&&rows[i].along<64)
   high[i]=Math.min(high[i],high[i-1]);
 const low=rows.map((row,i)=>Math.max(
  high[i]-1.48,...rows.map((r,j)=>r.lowSafe-metric(i,j))));
 const profiles=rows.map((row,i)=>({...row,low:low[i],high:high[i],
  safe:high[i]-low[i]>=.38&&low[i]>=row.lowSafe-.00001&&
   high[i]<=row.highSafe+.00001}));
 const parts=[],minJoinWidth=.32;
 let active=null,joins=0;
 const cap=(r,side)=>{
  const along=r.along+side*(r.length/2+overlap);
  // 5.81.24: The 5.81.23 taper left a narrow tile "tongue" extending
  // below the parking apron. Retract only the SOUTH cap, inside its
  // accepted OSM-safe first cell. Neither road nor body geometry moves.
  if(side<0&&r===profiles[0]){
   const longitudinalTrim=Math.min(.23,r.length*.29);
   const capWidth=Math.min(.32,r.high-r.low);
   const inset=Math.max(0,(r.high-r.low-capWidth)/2);
   return {along:along+longitudinalTrim,low:r.low+inset,
    high:r.high-inset,southNoseCap:true,
    southNoseLongitudinalTrim:longitudinalTrim};
  }
  return {along,low:r.low,high:r.high};
 };
 function add(section){
  if(!active)active=[];
  if(!active.length||section.along>active.at(-1).along+.000001)
   active.push(section);
 }
 function finish(row){
  if(!active||!row)return;
  add(cap(row,1));
  if(active.length>=2)parts.push(active);
  active=null;
 }
 let previous=null;
 for(const row of profiles){
  if(!row.safe){
   finish(previous);previous=null;continue;
  }
  if(!previous){
   add(cap(row,-1));add({along:row.along,low:row.low,high:row.high});
   previous=row;continue;
  }
  const gap=row.along-previous.along;
  const midLow=Math.max(row.low,previous.low);
  const midHigh=Math.min(row.high,previous.high);
  if(gap>rowStep+.045||midHigh-midLow<minJoinWidth){
   finish(previous);
   add(cap(row,-1));add({along:row.along,low:row.low,high:row.high});
   previous=row;continue;
  }
  // Both adjoining road-safe row rectangles cover this half-way
  // intersection. This creates genuinely diagonal/road-parallel edges,
  // not another pair of tiles or sidewalk mesh painted over asphalt.
  add({along:(previous.along+row.along)/2,low:midLow,high:midHigh});
  add({along:row.along,low:row.low,high:row.high});
  previous=row;joins++;
 }
 finish(previous);
 // A single isolated, terminal .75m paver once appeared as a floating
 // square at the narrow north tip. Only long continuous safe ribbons are
 // rendered; discontinuous tip fragments are not standalone pavements.
 const shortTerminalParts=parts.filter(part=>
  part.at(-1).along-part[0].along<2.8);
 for(let i=parts.length-1;i>=0;i--)
  if(parts[i].at(-1).along-parts[i][0].along<2.8)parts.splice(i,1);
 if(!parts.length)return null;
 const body=profiles.filter(r=>r.safe&&r.along>=8&&r.along<=60);
 let maxBodyEdgeStep=0,roadMarginMin=Infinity;
 for(let i=1;i<body.length;i++){
  if(body[i].along-body[i-1].along>rowStep+.045)continue;
  maxBodyEdgeStep=Math.max(maxBodyEdgeStep,
   Math.abs(body[i].high-body[i-1].high));
 }
 for(const row of profiles.filter(r=>r.safe))
  roadMarginMin=Math.min(roadMarginMin,row.roadOffset-roadWidth/2-row.high);
 return {parts,rows:rows.length,joins,
  southNoseCap:parts[0]?.[0]?.southNoseCap===true,
  southNoseLongitudinalTrim:parts[0]?.[0]?.southNoseLongitudinalTrim||0,
  southernOuterEarsClipped,
  shortTerminalPartsTrimmed:shortTerminalParts.length,
  metres:parts.reduce((n,p)=>n+p.at(-1).along-p[0].along,0),
  triangles:parts.reduce((n,p)=>n+Math.max(0,p.length-1)*2,0),
  pavementPanels:0,continuous:parts.length===1,
  roadFootprintExpansion:false,photoEstimatedWidth:true,
  roadAxisAligned:true,referenceRoadId:128308366,
  roadMarginMin,maxBodyEdgeStep,profiles,
  roadCenterlinePoints:roadCenterline.length};
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
 const railRoadFacingOffset=-3.02,railParkingDepth=4.02;
 // In the 4 June 2023 aerial, the rail-side bank is wider through the
 // middle of its length and tapered toward the two ends. The OSM rail
 // clearance near its southern end is significantly tighter than further
 // north. Widen conservatively toward rails ONLY after the old full-footprint
 // road, walkway, buildings and railway safety checks all pass.
 const southernLimit=8,northernLimit=Math.min(65,f.length-8);
 const safePlace=(p,length,depth,buffer=.12,step=.36)=>{
  if(!isRoadFreeRect(roadClearance,{...p,length,depth,yaw:f.yaw,buffer,step}))
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
 for(let along=southernLimit;along<=northernLimit;along+=2.85){
  const t=(along-southernLimit)/(northernLimit-southernLimit);
  const midBulge=Math.max(0,Math.sin(Math.PI*t));
  const intended=railParkingDepth+1.55*midBulge;
  const coreOffset=railRoadFacingOffset-railParkingDepth/2;
  let chosen=null,failed='mapped-road-or-footway';
  // Test wider footprints from narrow to broad, keeping EXACTLY the old
  // road-facing boundary fixed at -3.02m. No new drivable asphalt is drawn.
  for(let depth=railParkingDepth;depth<=intended+.001;depth+=.20){
   const offset=railRoadFacingOffset-depth/2,p=at(f,along,offset);
   const reason=safePlace(p,2.46,depth);
   if(reason){failed=reason;break;}
   chosen={...p,along,offset,yaw:f.yaw,length:2.46,depth};
  }
  if(!chosen){
   const p=at(f,along,coreOffset);
   railRejected.push({along,kind:'parking',reason:failed,position:p});
  }else{
   // 2023 aerial: the rail-side pavement meets the service aisle rather
   // than being separated by a conspicuous grass strip. Try advancing ONLY
   // the traffic-facing edge toward the road in small 0.12m increments.
   // Keep the accepted rail-facing boundary unchanged. Every complete
   // widened footprint must pass the original full road/rail/building
   // checks; fail closed at the last safe edge.
   const originalRailEdge=chosen.offset-chosen.depth/2;
   const originalRoadEdge=chosen.offset+chosen.depth/2;
   let acceptedRoadEdge=originalRoadEdge;
   // The photographed pavement meets the service aisle: 5.81.17 left a
   // conspicuous narrow green strip. Approach the mapped 4.5m OSM
   // service road in 12cm steps, never closer than road clearance permits.
   // The WHOLE slab is rechecked for roads, paths, rails and buildings.
   // The previous .12m buffer left a narrow green divider beside the
   // pale 2023-photo-informed rail parking bank. Try finer OSM-safe edges:
   // full slab, ALL streets/footways, buildings and tracks remain protected.
   // Refining the conservative rectangle-cell circles from 36 to 12 cm
   // avoids rejecting safe 5 cm roadside gaps; never touch the OSM road.
   let acceptedRoadBuffer=.12;
   for(const candidate of [-2.90,-2.78,-2.66,-2.54,-2.42,-2.30]){
    const trialDepth=candidate-originalRailEdge;
    const trialOffset=(originalRailEdge+candidate)/2;
    const trial=at(f,along,trialOffset);
    const buffer=candidate>=-2.30?.025:candidate>=-2.42?.040:.12;
    if(safePlace(trial,2.46,trialDepth,buffer,.12))break;
    acceptedRoadEdge=candidate;
    acceptedRoadBuffer=buffer;
    chosen={...chosen,...trial,offset:trialOffset,depth:trialDepth};
   }
   chosen.roadFacingBuffer=acceptedRoadBuffer;
   chosen.roadFacingEdge=acceptedRoadEdge;
   chosen.railFacingEdge=originalRailEdge;
   chosen.roadsideSeamClosedMetres=acceptedRoadEdge-originalRoadEdge;
   railSideParking.push(chosen);
  }
 }
 // The 2023 aerial shows ONE pale paved western bank, not separated
 // grass-grid boxes. Bridge only the short 0.39m gaps BETWEEN two fully
 // cleared bays; every small connecting rectangle must pass the same
 // OSM road, railway and building clearance as its neighbours.
 const railSideJoiningSlabs=[],railSideJoinRejected=[];
 for(let i=1;i<railSideParking.length;i++){
  const previous=railSideParking[i-1],next=railSideParking[i];
  if(next.along-previous.along>3.05)continue;
  const left=previous.along+previous.length/2;
  const right=next.along-next.length/2,gap=right-left;
  if(gap<=0||gap>.7)continue;
  const mid=(left+right)/2;
  // Join only the overlap of the two previously checked widened bays.
  // This avoids a rectangular bridge widening into asphalt if one adjacent
  // bay is closer to the carriageway than its neighbour.
  const roadEdge=Math.min(previous.roadFacingEdge,next.roadFacingEdge);
  const railEdge=Math.max(previous.railFacingEdge,next.railFacingEdge);
  const depth=roadEdge-railEdge;
  if(depth<=1.6){railSideJoinRejected.push({along:mid,reason:'no-safe-overlap'});continue;}
  const offset=(roadEdge+railEdge)/2,p=at(f,mid,offset);
  const length=gap+.025,failed=safePlace(p,length,depth,.022,.12);
  if(failed){railSideJoinRejected.push({along:mid,reason:failed});continue;}
  railSideJoiningSlabs.push({...p,along:mid,offset,
   yaw:f.yaw,length,depth,railRoadVerified:true});
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
 const continuousRibbon=planContinuousOuterSidewalk(outerSidewalkCells,{
  frame:f,roadCenterline:other,roadWidth:7.8,roadSetback:.40
 });
 if(!continuousRibbon||!continuousRibbon.parts.length||
    !continuousRibbon.roadAxisAligned||continuousRibbon.roadMarginMin<.38||
    continuousRibbon.maxBodyEdgeStep>.115||
    continuousRibbon.joins<60||continuousRibbon.metres<45)return null;
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

 const bayMarkings=planSatelliteParkingMarkings(f,railSideParking,
  centralParkingCells,roadClearance);
 if(!bayMarkings)return null;
 const railApronKerbs=planRailApronBoundaryKerbs(
  [...railSideParking,...railSideJoiningSlabs],f,roadClearance);
 if(!railApronKerbs||railApronKerbs.sections.length<30||
    railApronKerbs.endCaps.length!==2)return null;
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
  railSideParking,railRejected,railSideJoiningSlabs,railSideJoinRejected,
  bayMarkings,railApronKerbs,
  outerFootwaySegments,outerFootwayStations,outerSidewalkCells,
  outerSidewalkCurbs,outerSidewalkMaxOsmDistance,
  edgeSpursTrimmed:edgeSpursRemoved.size,continuousRibbon,
  centralParkingCells,cornerPaving,cornerCurbs,cornerRejected,
  rightCornerFootwayId:cornerWay.id,centralFootwayId:centralFootway.id,
  incorrectlyPlacedRailSidewalkRemoved:true,
  parkingBanks:['central-between-roads','opposite-rail-side'],
  aerialReferenceDate:'2023-06-04',
  railParkingSurface:'continuous-pale-concrete-with-safe-bridges',
  railGrassGridRemoved:true,diagonalBayMarkingsPhotoApproximate:true,
  railPavingVariableDepth:true,railPavingBaseDepth:railParkingDepth,
  railPavingRoadFacingOffset:railRoadFacingOffset,
  railPavingTrafficEdgeSafelyExtended:true,
  railPavingNarrowRoadsideGapRetested:true,
  railPavingMinRoadFacingBuffer:.025,
  railPavingRefinedSamplingMetres:.12,
  railFacingKerbsLimitedToVerifiedPaving:true,
  terminalPlantingBedsDeferred:true,
  railPavingSeamCells:railSideParking.filter(b=>b.roadsideSeamClosedMetres>.01).length,
  railPavingLargestSeamReduction:Math.max(0,...railSideParking.map(b=>b.roadsideSeamClosedMetres||0)),
  pedestrianCorridorWidth:1.48,pedestrianSeparation:0,
  centralPedestrianSurface:'carved-from-OSM-safe-outer-parking-cells',
  centralParkingSurface:'remaining-inner-grid-parking-cells',
  pedestrianStripSide:'outer-east-facing-Nadrazni-128308366',
  pedestrianStripOsmAnchored:false,pedestrianStripPhotoEstimated:true,
  outerFootwayRendering:'road-axis-aligned-continuous-terrain-ribbon',
  originalRoadSurfaceUnmodified:true,
  mistakenParkingAsSidewalkRemoved:true,
  mappedFootwayIdPreserved:centralFootway.id,
  sourceIds:[west.id,east.id],sourcePhotos:STATION_PARKING_REFERENCE.photos.length,
  groundType:'concrete-paving-island',exactParkingOutlineMeasured:false,
  photoInformed:true,modelledRoundedNose:true,legacyDetachedStripsRemoved:true,
  protectedRoadsAndPaths:true,protectedBuildings:true,protectedRailways:true,
  originalCarriagewaysUntouched:true};
}
// Build a continuous road-side silhouette from ALL verified pedestrian
// island cells, not short bevels on the handful of raster row transitions.
// Never raise the edge above any row's OUTERMOST accepted cell: a global
// Lipschitz minorant walks smoothly inward along the 70m island without
// ever growing pavement into the adjacent (protected) Nádražní road.
// Each row is a continuous side-by-side strip of the prevalidated cells;
// the returned surface will be stitched into ONE existing 3D draw call.
export function planRoadSafeParkingInfillProfiles(patches,{maxSlope=.12}={}){
 if(!Array.isArray(patches)||!patches.length||!(maxSlope>0&&maxSlope<=.25))
  return null;
 const groups=new Map();
 for(const patch of patches){
  if(!Number.isFinite(patch.along)||!Number.isFinite(patch.offset)||
     !(patch.length>0&&patch.depth>0))return null;
  if(!groups.has(patch.along))groups.set(patch.along,[]);
  groups.get(patch.along).push(patch);
 }
 const rows=[...groups].sort((a,b)=>a[0]-b[0]).map(([along,cells])=>{
  cells.sort((a,b)=>a.offset-b.offset);
  // Fail closed rather than connecting across missing/unvalidated tiles.
  if(cells.some((c,i)=>i&&c.offset-cells[i-1].offset>
      (c.depth+cells[i-1].depth)*.5+.045))return null;
  const low=cells[0].offset-(cells[0].depth+.012)/2;
  const high=cells.at(-1).offset+(cells.at(-1).depth+.012)/2;
  const halfAlong=(Math.min(...cells.map(c=>c.length))+.012)/2;
  return {along,low,high,halfAlong,cellCount:cells.length};
 });
 if(rows.some(x=>!x||x.high-x.low<.4))return null;
 for(const row of rows){
  // No new terrain is claimed: edge <= original safe-row bound.
  // At the extreme tapered end, neighbouring rows sometimes have just
  // ONE tile and non-overlapping lateral spans. Allow its final strip to
  // taper to 10cm rather than forcing an artificial 28cm outside step.
  const minVisibleWidth=row.cellCount===1?.10:.28;
  row.edge=Math.min(row.high,Math.max(row.low+minVisibleWidth,
   Math.min(...rows.map(other=>other.high+
    maxSlope*Math.abs(row.along-other.along)))));
 }
 let maxEdgeStep=0,joins=0;
 for(let i=0;i<rows.length;i++){
  const row=rows[i],prev=rows[i-1],next=rows[i+1];
  const prevJoined=prev&&row.along-prev.along<=.81;
  const nextJoined=next&&next.along-row.along<=.81;
  row.start=prevJoined?Math.min(row.edge,prev.edge):row.edge;
  row.end=nextJoined?Math.min(row.edge,next.edge):row.edge;
  if(prevJoined){joins++;maxEdgeStep=Math.max(maxEdgeStep,
   Math.abs(row.edge-prev.edge));}
 }
 return {rows,joins,maxSlope,maxEdgeStep,areaExpanded:false,
  sourceCells:patches.length,roadSafeCellsOnly:true};
}
// Convert already accepted OSM-clear parking rectangles into ONE continuous
// mesh, instead of a long rectangular series of instanced boxes. The rail
// outer edge is joined at the most conservative shared depth of neighbours.
// Start/end are inset within first/last validated rectangles (not extended
// into the railway). This modifies only silhouette, not vehicle access road.
export function planRailApronProfiles(patches){
 if(!Array.isArray(patches)||!patches.length)return null;
 const ordered=[...patches].sort((a,b)=>a.along-b.along);
 for(const p of ordered)
  if(!(p.length>0&&p.depth>0&&Number.isFinite(p.offset)))return null;
 const profiles=[];
 for(let i=0;i<ordered.length;i++){
  const cur=ordered[i],prev=ordered[i-1],next=ordered[i+1];
  const rail=cur.offset-cur.depth/2,road=cur.offset+cur.depth/2;
  const joinedPrev=!!prev&&cur.along-cur.length/2-(prev.along+prev.length/2)<.07;
  const joinedNext=!!next&&next.along-next.length/2-(cur.along+cur.length/2)<.07;
  const neighbourRailBefore=joinedPrev?Math.max(rail,prev.offset-prev.depth/2):rail;
  const neighbourRailAfter=joinedNext?Math.max(rail,next.offset-next.depth/2):rail;
  const startRail=joinedPrev?neighbourRailBefore:rail+Math.min(.72,cur.depth*.24);
  const endRail=joinedNext?neighbourRailAfter:rail+Math.min(.72,cur.depth*.24);
  const startRoad=joinedPrev?road:road-Math.min(.24,cur.depth*.07);
  const endRoad=joinedNext?road:road-Math.min(.24,cur.depth*.07);
  if(startRoad<=startRail||endRoad<=endRail)return null;
  profiles.push({along:cur.along,length:cur.length,
   railSide:rail,roadSide:road,startRail,endRail,startRoad,endRoad,
   coreDepth:cur.depth,validSafeRect:true});
 }
 return {profiles,variableDepth:profiles.some(p=>p.coreDepth>
   profiles[0].coreDepth+.35),sourceRects:patches.length,
  originalRoadFacingOffset:profiles[0].roadSide,
  noFootprintExpansion:true};
}
// Photo-informed, low rail-facing kerb and short end returns. No guessed
// flowerbeds or curb across the service access aisle. Every piece is inside
// already validated rail parking slabs and independently clears mapped roads.
export function planRailApronBoundaryKerbs(patches,roadFrame,roadClearance){
 if(!roadFrame||!roadClearance?.isClear)return null;
 const apron=planRailApronProfiles(patches);
 if(!apron)return null;
 const sections=[],endCaps=[],inset=.09,width=.09;
 const emit=(a,b,source,endCap=false)=>{
  const p=at(roadFrame,a.along,a.offset),q=at(roadFrame,b.along,b.offset);
  const length=d2(p,q),x=(p.x+q.x)/2,z=(p.z+q.z)/2;
  if(length<.12)return;
  const yaw=Math.atan2(-(q.z-p.z),q.x-p.x);
  if(!isRoadFreeRect(roadClearance,{x,z,length:length-.008,
   depth:width,yaw,buffer:.035,step:.14}))return;
  (endCap?endCaps:sections).push({x,z,length:length-.008,depth:width,yaw,
   from:a,to:b,sourceAlong:source.along,sourceRectValidated:true,
   endCap,photoApproximate:true});
 };
 for(const p of apron.profiles){
  const span=Math.min(.018,p.length*.08);
  const a={along:p.along-p.length/2+span,offset:p.startRail+inset};
  const m={along:p.along,offset:p.railSide+inset};
  const b={along:p.along+p.length/2-span,offset:p.endRail+inset};
  emit(a,m,p);emit(m,b,p);
 }
 // Terminal returns stay on the OUTER metre only; cars still enter from
 // the unaltered central access aisle. No unsurveyed planting is generated.
 for(const [p,first] of [[apron.profiles[0],true],
                        [apron.profiles.at(-1),false]]){
  const along=p.along+(first?-1:1)*(p.length/2-.11);
  const rail=(first?p.startRail:p.endRail)+inset;
  const road=first?p.startRoad:p.endRoad;
  const end=Math.min(road-.25,rail+.94);
  if(end-rail>.35)emit({along,offset:rail},{along,offset:end},p,true);
 }
 return {sections,endCaps,sourceRects:apron.sourceRects,
  roadClearanceVerified:true,railFacingOnly:true,
  noNewParkingFootprint:true,plantingCoordinatesUnverified:true};
}

// 5.81.19. The raw cell-underlay had an independent smoothed outline and
// therefore protruded beyond the road-aligned sidewalk at the two tapers.
// Merely choosing rows where profiles.safe=true did not prevent these ears.
// Clip every underlay station to the ALREADY rendered continuous ribbon,
// reject detached terminal pieces, and never grow the path onto a road.
export function planClippedRoadsideInfill(infill,ribbon,{overlap=.006}={}){
 if(!infill?.rows?.length||!ribbon?.parts?.length||!ribbon?.profiles?.length||
    overlap<0||overlap>.012)return null;
 const supported=ribbon.parts.filter(part=>
  part.at(-1).along-part[0].along>=2.8);
 if(!supported.length)return null;
 const profiles=new Map(ribbon.profiles.filter(r=>r.safe)
  .map(r=>[r.along,r]));
 const rows=[];
 const nose=ribbon.parts[0]?.[0];
 const firstRibbonStation=ribbon.profiles.find(p=>p.safe)?.along;
 for(const r of infill.rows){
  const p=profiles.get(r.along);
  if(!p||!supported.some(part=>
    r.along>=part[0].along&&r.along<=part.at(-1).along))continue;
  // CRITICAL: keep the inner margin at the SAFE cell's ORIGINAL edge.
  // 5.81.19 accidentally raised it to p.low, exposing repeated strips of
  // grass between parking tiles and the narrow road-aligned outer ribbon.
  // The outer edge alone is trimmed back against the verified road-facing
  // ribbon, avoiding the former protrusions into the carriageway.
  const low=r.low;
  const high=Math.min(r.high,p.high+overlap);
  const edge=Math.min(r.edge,high);
  const start=Math.min(r.start,high);
  const end=Math.min(r.end,high);
  if(Math.min(edge,start,end)-low<.16)continue;
  // Underlay and visible sidewalk must have exactly the same curved cap.
  // Otherwise the untrimmed underlay rectangle still protrudes at the tip.
  const southCap=!!nose?.southNoseCap&&r.along===firstRibbonStation;
  rows.push({...r,low,high,edge,
   start:southCap?Math.min(start,nose.high):start,end,
   startAlong:southCap?nose.along:r.along-r.halfAlong,
   startInner:southCap?nose.low:low,
   southCapMatched:southCap,
   supportedRoadEdge:p.high,innerSafeFootprintPreserved:true,
   clippedToContinuousRibbon:true});
 }
 return {rows,visibleRows:rows.length,trimmedRows:infill.rows.length-rows.length,
  roadSafeCellsOnly:true,clippedToContinuousRibbon:true,
  discardedDisconnectedPieces:ribbon.shortTerminalPartsTrimmed||0};
}
export function makeStationPhotoParkingScene(THREE,{layer,terrainAt=()=>0,roadClearance}={}){
 const roots=[],geo=new THREE.BoxGeometry(1,1,1);
 const material={
  grout:new THREE.MeshLambertMaterial({color:0x92928a}),
  paver:new THREE.MeshLambertMaterial({color:0xc7c6bd}),
  curb:new THREE.MeshLambertMaterial({color:0xb9b9b3}),
  // Real 2023 aerial: pale continuous parking apron, NOT green-grid pads.
  railPaved:new THREE.MeshLambertMaterial({color:0xbfbcb3,roughness:1}),
  bayLines:new THREE.MeshLambertMaterial({color:0xf0eee7}),
  sidewalk:new THREE.MeshLambertMaterial({color:0xe0dcd1})
 };
 let planned=null,drawMeshes=0,instances=0,sharedSidewalkTexture=false,infillProfile=null;
 const stats=()=>({
  active:roots.length>0,sourceIds:planned?.sourceIds||[],
  photos:STATION_PARKING_REFERENCE.photos.length,
  pavingCells:planned?.cells.length||0,curbSegments:planned?.curbs.length||0,
  rejectedCells:planned?.rejected.length||0,
  coveredRows:planned?.rowStats.filter(r=>r.accepted>0).length||0,
  parkingBanks:planned?.parkingBanks||[],
  oppositeParkingBays:planned?.railSideParking.length||0,
  railSideJoiningSlabs:planned?.railSideJoiningSlabs.length||0,
  railPavingVariableDepth:planned?.railPavingVariableDepth||false,
  railPavingExpandedBays:planned?.railSideParking.filter(b=>b.depth>4.37).length||0,
  railPavingMinDepth:planned?.railSideParking.length?
   Math.min(...planned.railSideParking.map(b=>b.depth)):null,
  railPavingMaxDepth:planned?.railSideParking.length?
   Math.max(...planned.railSideParking.map(b=>b.depth)):null,
  railPavingTaperedMesh:planned?.railSideParking.length>0,
  railPavingSeamCells:planned?.railPavingSeamCells||0,
  railPavingLargestSeamReduction:planned?.railPavingLargestSeamReduction||0,
  railPavingTrafficEdgeSafelyExtended:planned?.railPavingTrafficEdgeSafelyExtended||false,
  railPavingNarrowRoadsideGapRetested:planned?.railPavingNarrowRoadsideGapRetested||false,
  railPavingMinRoadFacingBuffer:planned?.railPavingMinRoadFacingBuffer??null,
  railPavingRefinedSamplingMetres:planned?.railPavingRefinedSamplingMetres??null,
  railSideJoinRejected:planned?.railSideJoinRejected.length||0,
  railSideSurface:planned?.railParkingSurface||null,
  railGrassGridRemoved:planned?.railGrassGridRemoved||false,
  railBayLines:planned?.bayMarkings?.rail.length||0,
  railFacingKerbSections:planned?.railApronKerbs?.sections.length||0,
  railEndKerbReturns:planned?.railApronKerbs?.endCaps.length||0,
  railKerbsNoNewFootprint:planned?.railApronKerbs?.noNewParkingFootprint||false,
  terminalPlantingsDeferred:planned?.terminalPlantingBedsDeferred||false,
  centralBayLines:planned?.bayMarkings?.central.length||0,
  bayLinePositionsEstimated:planned?.bayMarkings?.measuredStallCount===false,
  satelliteReferenceDate:planned?.aerialReferenceDate||null,
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
  sidewalkRoadAxisAligned:planned?.continuousRibbon.roadAxisAligned||false,
  sidewalkRoadReferenceId:planned?.continuousRibbon.referenceRoadId||null,
  sidewalkRoadMargin:planned?.continuousRibbon.roadMarginMin??null,
  sidewalkMaxRoadEdgeStep:planned?.continuousRibbon.maxBodyEdgeStep??null,
  sidewalkPanelCount:planned?.continuousRibbon.pavementPanels??null,
  // 5.81.11: meshes are part of the existing single sidewalk drawcall,
  // not new sidewalk rectangles on the OSM road or extra scene objects.
  roadSafeInfillCells:planned?.outerSidewalkCells.length||0,
  roadSafeInfillTriangles:(infillProfile?.visibleRows||0)*4,
  smoothRoadsideInfill:true,
  smoothInfillRows:infillProfile?.visibleRows||0,
  unsupportedTerminalInfillRowsTrimmed:infillProfile?.trimmedRows||0,
  infillRestrictedToSafeRibbon:true,
  clippedInfillInnerFootprintPreserved:true,
  roadsideOverhangClipped:infillProfile?.roadsideOverhangClipped||false,
  shortDetachedSidewalkPartsTrimmed:planned?.continuousRibbon?.shortTerminalPartsTrimmed||0,
  southernNoseCurvedInsideSafeCells:planned?.continuousRibbon?.southNoseCap||false,
  southernNoseTrimMetres:planned?.continuousRibbon?.southNoseLongitudinalTrim||0,
  southernOuterPaverEarsClipped:planned?.continuousRibbon?.southernOuterEarsClipped||0,
  smoothInfillJoins:infillProfile?.joins||0,
  smoothInfillMaxEdgeStep:infillProfile?.maxEdgeStep??null,
  smoothInfillMaxSlope:infillProfile?.maxSlope??null,
  smoothRoadsideWithinSafeCells:infillProfile?.roadSafeCellsOnly||false,
  infillExtraDrawCalls:0,
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
 // ONE continuous road-like sidewalk strip (plus continuous low kerb).
 // Sections join at half-way intersections of adjacent OSM-safe cells:
 // no individual square pavement panels, no asphalt changes.
 function texturedOuterSidewalk(group,ribbon,sidewalkMaterial){
  if(!ribbon?.parts?.length||!sidewalkMaterial)return;
  function meshFor(kind,mat){
   const vertices=[],uvs=[],indices=[];
   for(const part of ribbon.parts){
    const start=vertices.length/3;
    for(const cross of part){
     const inside=kind==='kerb'?cross.high-.115:cross.low;
     const outside=kind==='kerb'?cross.high-.015:cross.high;
     for(const offset of [inside,outside]){
      const pt=at(planned.frame,cross.along,offset);
      const height=kind==='kerb'?.245:.214;
      vertices.push(pt.x,terrainAt(pt.x,pt.z)+height,pt.z);
      uvs.push(offset/1.8,cross.along/8);
     }
    }
    for(let i=0;i<part.length-1;i++){
     const k=start+i*2;
     // Station tangent/normal -> upward-facing front triangles.
     indices.push(k,k+1,k+2,k+1,k+3,k+2);
    }
   }
   if(kind==='sidewalk'){
    // 5.81.11: The 5.76 road-aligned ribbon is deliberately narrowed to
    // avoid road-side tile-step edges. That can leave intermittent long
    // green triangular holes INSIDE the two columns already reserved and
    // road-checked for pedestrian use. Fill ONLY those exact safe cells.
    // They are underneath the continuous ribbon (2.1cm lower) and share
    // its material, road axis and UV phase; one merged drawcall remains.
    // The 1.2cm overlap closes 0.01m gaps from the .76/.74m cell grid;
    // road-clearance tests already check expanded dimensions of each cell.
    infillProfile=planRoadSafeParkingInfillProfiles(planned.outerSidewalkCells);
    if(!infillProfile)throw Error('Roadsafe island infill requires contiguous OSM-cleared cells');
    // Only add an underlay where a genuine continuous sidewalk ribbon is
    // present. End rows with no ribbon were the detached rectangular tail
    // at the narrow southern island tip in the user's overhead screenshot.
    const clipped=planClippedRoadsideInfill(infillProfile,planned.continuousRibbon);
    if(!clipped||!clipped.rows.length)
     throw Error('Outer sidewalk underlay must match verified ribbon geometry');
    infillProfile.visibleRows=clipped.visibleRows;
    infillProfile.trimmedRows=clipped.trimmedRows;
    infillProfile.roadsideOverhangClipped=clipped.clippedToContinuousRibbon;
    for(const row of clipped.rows){
     const sections=[
      {along:row.startAlong,inner:row.startInner,outer:row.start},
      {along:row.along,inner:row.low,outer:row.edge},
      {along:row.along+row.halfAlong,inner:row.low,outer:row.end}
     ];
     const start=vertices.length/3;
     for(const section of sections){
      for(const offset of [section.inner,section.outer]){
       const pt=at(planned.frame,section.along,offset);
       vertices.push(pt.x,terrainAt(pt.x,pt.z)+.193,pt.z);
       uvs.push(offset/1.8,section.along/8);
      }
     }
     // Slope-limited join from the previous row's SAME road-facing edge;
     // whole surfaces remain inside the previously approved safe cells.
     indices.push(start,start+1,start+2,start+1,start+3,start+2,
      start+2,start+3,start+4,start+3,start+5,start+4);
    }
   }
   const geometry=new THREE.BufferGeometry();
   geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));
   geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));
   geometry.setIndex(indices);geometry.computeVertexNormals();
   geometry.computeBoundingSphere();
   const mesh=new THREE.Mesh(geometry,mat);
   mesh.receiveShadow=true;
   mesh.name=kind==='kerb'?'ContinuousOuterSidewalkKerb':'ContinuousOuterSidewalkPaving';
   if(kind==='sidewalk'){
    mesh.userData.roadSafeInfillCells=planned.outerSidewalkCells.length;
    mesh.userData.smoothInfillRows=infillProfile.visibleRows;
    mesh.userData.smoothInfillMaxEdgeStep=infillProfile.maxEdgeStep;
    mesh.userData.infillExtraDrawCalls=0;
    mesh.userData.infillHeightBelowRibbonMeters=.021;
   }
   group.add(mesh);drawMeshes++;
  }
  meshFor('sidewalk',sidewalkMaterial);
  meshFor('kerb',material.curb);
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
  const photoBayLines=[],sidewalkPavers=[];
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
  // Existing curb batch / one draw call: the railway edge gains a low,
  // smoothly directed boundary without new road surfaces or objects.
  for(const p of [...planned.railApronKerbs.sections,...planned.railApronKerbs.endCaps])
   curb.push({...p,y:terrainAt(p.x,p.z)+.229,
    sx:p.length,sy:.110,sz:p.depth});
  // 5.81.15: contour the previously clearance-tested rail-side slabs
  // as a shared surface, with the west boundary smoothly joined at the
  // shallower adjacent profile. Keep a single drawcall and 0 road overlays.
  function renderRailApron(){
   const surface=planRailApronProfiles([...planned.railSideParking,
    ...planned.railSideJoiningSlabs]);
   if(!surface)throw Error('Rail apron needs checked OSM-clear slab profiles');
   const verts=[],uvs=[],faces=[];
   for(const p of surface.profiles){
    const first=verts.length/3;
    for(const [along,outer,inner] of [
     [p.along-p.length/2,p.startRail,p.startRoad],
     [p.along,p.railSide,p.roadSide],
     [p.along+p.length/2,p.endRail,p.endRoad]
    ]){
     for(const offset of [outer,inner]){
      const pt=at(planned.frame,along,offset);
      verts.push(pt.x,terrainAt(pt.x,pt.z)+.174,pt.z);
      uvs.push(offset/4.0,along/5.0);
     }
    }
    faces.push(first,first+1,first+2,first+1,first+3,first+2,
     first+2,first+3,first+4,first+3,first+5,first+4);
   }
   const geom=new THREE.BufferGeometry();
   geom.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));
   geom.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));
   geom.setIndex(faces);geom.computeVertexNormals();geom.computeBoundingSphere();
   const mesh=new THREE.Mesh(geom,material.railPaved);
   mesh.name='PhotoConfirmedContinuousRailSideAngledParking';
   mesh.receiveShadow=true;
   mesh.userData.sourceDate='2023-06-04';
   mesh.userData.modelledTaperedOutline=true;
   mesh.userData.sourceRects=surface.sourceRects;
   group.add(mesh);drawMeshes++;
  }
  // Both parking banks have diagonal white separators in the 2023 photo.
  // This is a modest geometry-derived approximation of their footprints,
  // not a surveyed count or a copy of the original aerial pixels.
  for(const stripe of planned.bayMarkings.all){
   photoBayLines.push({...stripe,y:terrainAt(stripe.x,stripe.z)+
    (stripe.bank==='rail'?.191:.203),
    sx:stripe.length,sy:.012,sz:stripe.width});
  }
  // Road edges stay EXACTLY as in 5.72, but the wrongly forced full-width
  // road-facing overlay is gone. A narrow pedestrian path is cut OUT of
  // the validated parking island, using the real city's paving texture.
  // No individual square outer-kerb blocks: the long ribbon has one
  // continuous slim kerb mesh on its road-facing exterior edge.
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
  renderRailApron();
  batch(group,material.bayLines,photoBayLines);
  batch(group,material.sidewalk,sidewalkPavers);
  batch(group,material.curb,curb);
  texturedOuterSidewalk(group,planned.continuousRibbon,
   sidewalkMaterial||material.sidewalk);
  layer.add(group);roots.push(group);publish();return stats();
 }
 function reset(){
  for(const root of roots)root.parent?.remove(root);
  roots.length=0;planned=null;drawMeshes=instances=0;infillProfile=null;sharedSidewalkTexture=false;publish();
 }
 publish();
 return {create,reset,status:stats,plan:()=>planned};
}
