/** Milovice RP 5.163 — simulated walkers along 102.53m ORIGINAL
 * paved sidewalk 1316882852, OSM nodes [21,22]. The whole sidewalk has
 * 28 actual GPS vertices and surface=paving_stones / footway=sidewalk.
 * BOTH endpoints coincide with the EXISTING zebra crossing ways
 * 1316882854 (south), 1316882853 (north). Do not extrapolate a new
 * crossing or fake a door on the adjoining five-house block.
 *
 * 5.162 established 2 walkers on a genuine short spur (1316882860).
 * This builds two more people on the long, straight, existing eastern
 * Topolová footway; people are simulation, positions not photo-observed.
 * 4m trim before both documented crossings keeps NPCs off carriageways.
 */
export const TOPOLOVA_PROMENADE_5163=Object.freeze({
 region:'mlada',
 pavedSidewalk:Object.freeze({id:'1316882852',hash:'a50c0251',
  nodes:28,kind:'footway',footway:'sidewalk',
  surface:'paving_stones',lit:'yes'}),
 southernCrossing:Object.freeze({id:'1316882854',hash:'0e127baa',
  nodes:3,kind:'footway',footway:'crossing',crossing:'zebra'}),
 northernCrossing:Object.freeze({id:'1316882853',hash:'dcb5d34e',
  nodes:3,kind:'footway',footway:'crossing',crossing:'zebra'}),
 road:Object.freeze({id:'8618275',hash:'c0fe69b0',
  nodes:4,kind:'residential',name:'Topolová'}),
 pathNodes:Object.freeze([21,22]),roadNodes:Object.freeze([1,2]),
 sourceHouses:Object.freeze(['61979151','61979152','61979144','61979139','61979145']),
 trimMetresEachEnd:4,walkerCount:2
});
function hash(g){
 let h=2166136261;
 for(const c of g.map(p=>p.lat.toFixed(7)+','+p.lon.toFixed(7)).join(';')){
  h^=c.charCodeAt(0);h=Math.imul(h,16777619);
 }
 return(h>>>0).toString(16).padStart(8,'0');
}
const key=p=>p.lat.toFixed(7)+','+p.lon.toFixed(7);
const scale=111320,lonScale=scale*Math.cos(50.226*Math.PI/180);
const metres=(a,b)=>Math.hypot((a.lat-b.lat)*scale,(a.lon-b.lon)*lonScale);
const distToSegment=(p,a,b)=>{
 const px=p.lat*scale,py=p.lon*lonScale,ax=a.lat*scale,
  ay=a.lon*lonScale,bx=b.lat*scale,by=b.lon*lonScale,
  dx=bx-ax,dy=by-ay,t=Math.max(0,Math.min(1,
   ((px-ax)*dx+(py-ay)*dy)/(dx*dx+dy*dy)));
 return Math.hypot(px-ax-t*dx,py-ay-t*dy);
};
const good=(w,s)=>w?.tags?.highway===s.kind&&
 Array.isArray(w.geometry)&&w.geometry.length===s.nodes&&
 w.geometry.every(p=>Number.isFinite(p?.lat)&&Number.isFinite(p?.lon))&&
 hash(w.geometry)===s.hash&&
 !['private','no','customers'].includes(w.tags.access);
export function planTopolovaPromenade5163({
 regionId,rowPlan,shortWalkPlan,ways
}={}){
 const s=TOPOLOVA_PROMENADE_5163;
 if(regionId!==s.region||rowPlan?.version!=='5.155'||
  rowPlan.contiguousExactSharedPartyWalls!==4||
  rowPlan.visualAboveGroundLevels!==5||
  JSON.stringify(rowPlan.sourceOSMIds)!==JSON.stringify(s.sourceHouses)||
  shortWalkPlan?.version!=='5.162'||
  shortWalkPlan.sourceSidewalkId!==s.pavedSidewalk.id||
  shortWalkPlan.sourceFootwayId!=='1316882860'||
  !Array.isArray(ways))return null;
 const get=spec=>{
  const a=ways.filter(w=>String(w?.id)===spec.id);
  return a.length===1&&good(a[0],spec)?a[0]:null;
 };
 const walk=get(s.pavedSidewalk),south=get(s.southernCrossing),
  north=get(s.northernCrossing),road=get(s.road);
 if(!walk||!south||!north||!road||
  walk.tags.footway!==s.pavedSidewalk.footway||
  walk.tags.surface!==s.pavedSidewalk.surface||
  walk.tags.lit!==s.pavedSidewalk.lit||
  south.tags.footway!=='crossing'||north.tags.footway!=='crossing'||
  south.tags.crossing!=='zebra'||north.tags.crossing!=='zebra'||
  road.tags.name!==s.road.name||road.tags.lit!=='yes')return null;
 const a=walk.geometry[s.pathNodes[0]],b=walk.geometry[s.pathNodes[1]];
 if(key(a)!==key(south.geometry[2])||
  key(b)!==key(north.geometry[2])||
  key(shortWalkPlan.routeOriginalGPS[1])!==key(walk.geometry[13]))return null;
 // The road MUST be parallel and at an actual lateral distance
 // compatible with a sidewalk, not a walking line atop asphalt.
 const ra=road.geometry[s.roadNodes[0]],rb=road.geometry[s.roadNodes[1]];
 const dA=distToSegment(a,ra,rb),dB=distToSegment(b,ra,rb);
 const len=metres(a,b),roadLength=metres(ra,rb);
 if(len<101.5||len>103.5||
  roadLength<100||roadLength>104||
  dA<3.8||dA>5.5||dB<3.8||dB>5.5)return null;
 return {
  version:'5.163',regionId:'mlada',
  sourceSidewalkId:s.pavedSidewalk.id,
  sourceSidewalkHash:s.pavedSidewalk.hash,
  originalSourceFootwayNodes:s.pavedSidewalk.nodes,
  sourceCrossingIDs:[south.id,north.id].map(String),
  sourceTopolovaRoadId:s.road.id,
  originalGPSNodes:[{...a},{...b}],
  originalOSMSegmentIndices:[...s.pathNodes],
  fullOriginalSidewalkUnchanged:true,
  existingZebraCrossingsRetained:true,
  connectsTo5162FootwayNode:true,
  originalMetres:+len.toFixed(3),
  parallelRoadOffsetMeters:[+dA.toFixed(3),+dB.toFixed(3)],
  modelFootwayWidthMeters:1.8,
  trimEachEndMeters:s.trimMetresEachEnd,
  modelWalkerSpanMeters:+(len-2*s.trimMetresEachEnd).toFixed(3),
  modelWalkerCount:s.walkerCount,
  peopleSimulatedNotObserved:true,
  createdPedestrianCrossings:0,createdNewFootways:0,
  changedOriginalRoads:0,changedOriginalBuildings:0,
  addedStreetMeshes:0,addedColliders:0,
  unknownDoorsStillUnmapped:true
 };
}
export function topolovaPromenadeSegment5163(plan,toWorld){
 if(plan?.version!=='5.163'||typeof toWorld!=='function')return null;
 const world=plan.originalGPSNodes.map(toWorld);
 if(world.length!==2||world.some(p=>!Number.isFinite(p?.x)||!Number.isFinite(p?.y)))return null;
 const [a,b]=world,dx=b.x-a.x,dz=b.y-a.y,len=Math.hypot(dx,dz);
 if(Math.abs(len-plan.originalMetres)>.12||len<20)return null;
 const ux=dx/len,uz=dz/len,trim=plan.trimEachEndMeters;
 return {
  a:{x:a.x+ux*trim,y:a.y+uz*trim},
  b:{x:b.x-ux*trim,y:b.y-uz*trim},
  len:len-2*trim,width:plan.modelFootwayWidthMeters,
  wayId:plan.sourceSidewalkId,
  mappedSidewalkCentrelineOnly:true,
  syntheticStreetGeometry:0
 };
}
