/** Milovice RP 5.162 — actual OSM footway pedestrian NPC route for
 * Topolová 614–618. No invented physical pavement or entrance coordinates.
 * Residents are gameplay SIMULATION, not proof of real pedestrian positions.
 * Source route is only original OSM 1316882860: paving_stones, lit=yes.
 * One end shares a coordinate with mapped sidewalk 1316882852; the other
 * shares the terminal service-road coordinate 202399863. Trim 2m at both
 * ends to prevent NPCs stepping into the road or turning at the T junction.
 */
export const TOPOLOVA_WALK_5162=Object.freeze({
 region:'mlada',
 footway:Object.freeze({id:'1316882860',hash:'35c50c19',nodes:2,
  kind:'footway',surface:'paving_stones',lit:'yes'}),
 sidewalk:Object.freeze({id:'1316882852',hash:'a50c0251',nodes:28,
  kind:'footway',surface:'paving_stones',footway:'sidewalk'}),
 service:Object.freeze({id:'202399863',hash:'ec6c3bc0',nodes:4,
  kind:'service',service:'driveway'}),
 sourceHouseIds:Object.freeze(['61979151','61979152','61979144','61979139','61979145']),
 trimmedMetresEachEnd:2,
 simulatedPeople:2
});
const hash=g=>{
 let h=2166136261;
 for(const c of g.map(p=>p.lat.toFixed(7)+','+p.lon.toFixed(7)).join(';')){
  h^=c.charCodeAt(0);h=Math.imul(h,16777619);
 }
 return (h>>>0).toString(16).padStart(8,'0');
};
const good=w,s=>w?.tags?.highway===s.kind&&
 Array.isArray(w.geometry)&&w.geometry.length===s.nodes&&
 w.geometry.every(p=>Number.isFinite(p?.lat)&&Number.isFinite(p?.lon))&&
 hash(w.geometry)===s.hash&&
 !['private','no','customers'].includes(w.tags.access);
const same=(a,b)=>a.lat.toFixed(7)===b.lat.toFixed(7)&&
 a.lon.toFixed(7)===b.lon.toFixed(7);
const metres=(a,b)=>Math.hypot((a.lat-b.lat)*111320,
 (a.lon-b.lon)*111320*Math.cos(50.226*Math.PI/180));
export function planTopolovaMappedWalkers5162({regionId,rowPlan,ways}={}){
 const s=TOPOLOVA_WALK_5162;
 if(regionId!==s.region||rowPlan?.version!=='5.155'||
  rowPlan.contiguousExactSharedPartyWalls!==4||
  JSON.stringify(rowPlan.sourceOSMIds)!==JSON.stringify(s.sourceHouseIds)||
  !Array.isArray(ways))return null;
 const get=spec=>{
  const a=ways.filter(x=>String(x?.id)===spec.id);
  return a.length===1&&good(a[0],spec)?a[0]:null;
 };
 const walk=get(s.footway),sidewalk=get(s.sidewalk),service=get(s.service);
 if(!walk||!sidewalk||!service||
  walk.tags.surface!==s.footway.surface||
  walk.tags.lit!==s.footway.lit||
  sidewalk.tags.surface!==s.sidewalk.surface||
  sidewalk.tags.footway!==s.sidewalk.footway||
  service.tags.service!==s.service.service||
  service.tags.lit!=='yes')return null;
 const a=walk.geometry[0],b=walk.geometry[1];
 if(!same(a,service.geometry[2])||
  sidewalk.geometry.filter(p=>same(p,b)).length!==1||
  !same(b,sidewalk.geometry[13]))return null;
 const len=metres(a,b);
 if(len<29||len>30.5)return null;
 return {
  version:'5.162',regionId,
  sourceFootwayId:s.footway.id,sourceFootwayHash:s.footway.hash,
  sourceSidewalkId:s.sidewalk.id,sourceServiceId:s.service.id,
  routeOriginalGPS:[{...a},{...b}],
  rawLengthMetres:+len.toFixed(3),
  actorTrimFromJunctionMeters:s.trimmedMetresEachEnd,
  routeWalkableMetres:+(len-2*s.trimmedMetresEachEnd).toFixed(3),
  visibleWalkers:s.simulatedPeople,modelWalkWidthMeters:1.8,
  fullFiveHouseRowRetained:true,connectedOnActualOSMNode:true,
  routeCentrelineIsOriginalOSM:true,actualPeopleAreSimulation:true,
  inventedFootwaySegments:0,sourceRoadVerticesChanged:0,
  addedPavementGeometry:0,addedColliders:0,
  noCrossingIntoServiceRoad:true,unknownHouseEntrancesUntouched:true
 };
}
export function toTopolovaWalkSegment5162(plan,toWorld){
 if(plan?.version!=='5.162'||typeof toWorld!=='function')return null;
 const pts=plan.routeOriginalGPS.map(toWorld);
 if(pts.length!==2||
  pts.some(p=>!Number.isFinite(p?.x)||!Number.isFinite(p?.y)))return null;
 const [p,q]=pts,dx=q.x-p.x,dz=q.y-p.y,len=Math.hypot(dx,dz);
 if(Math.abs(len-plan.rawLengthMetres)>.12||len<8)return null;
 const ux=dx/len,uz=dz/len,trim=plan.actorTrimFromJunctionMeters;
 return {a:{x:p.x+ux*trim,y:p.y+uz*trim},
  b:{x:q.x-ux*trim,y:q.y-uz*trim},
  len:len-2*trim,width:plan.modelWalkWidthMeters,
  wayId:plan.sourceFootwayId,
  originalOSMRouteUnmodified:true,sidewalkOnly:true};
}
