/** Milovice RP 5.166 — modeled pedestrian right-of-way at two EXISTING
 * Topolova OSM zebras. AI cars on real road 8618275 slow/stop 3.5 m
 * before the mapped road crossing nodes; 5.165 NPC waits at curbs.
 * Source GPS remains immutable. Player-driven cars are not auto-braked.
 * Distances are gameplay estimates, not official stop lines.
 */
export const TOPOLOVA_PRIORITY_5166=Object.freeze({
 region:'mlada',roadId:'8618275',hash:'c0fe69b0',nodes:4,
 sourceCrossings:['1316882854','1316882853'],
 stopBuffer:3.5,slowdown:9,watch:18,settled:.22,
 curbHold:.08,curbLookahead:1.35
});
const key=p=>Number.isFinite(p?.lat)&&Number.isFinite(p?.lon)?
 p.lat.toFixed(7)+','+p.lon.toFixed(7):'invalid';
const hash=g=>{
 let h=2166136261;
 for(const c of g.map(key).join(';')){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}
 return(h>>>0).toString(16).padStart(8,'0');
};
const meters=(a,b)=>Math.hypot((a.lat-b.lat)*111320,
 (a.lon-b.lon)*111320*Math.cos(50.226*Math.PI/180));
export function planTopolovaPriority5166({regionId,loopPlan,ways}={}){
 const s=TOPOLOVA_PRIORITY_5166;
 if(regionId!==s.region||loopPlan?.version!=='5.165'||
  loopPlan.actualMarkedCrossings!==2||!Array.isArray(ways)||
  loopPlan.sourceWayIds?.join(',')!==
   ['1316882852',s.sourceCrossings[0],'1314665579',
    s.sourceCrossings[1]].join(','))return null;
 const matches=ways.filter(w=>String(w?.id)===s.roadId);
 if(matches.length!==1)return null;
 const road=matches[0],gps=road.geometry;
 if(road.tags?.highway!=='residential'||road.tags?.name!=='Topolová'||
  ['private','no','customers'].includes(road.tags.access)||
  gps?.length!==s.nodes||gps.some(p=>key(p)==='invalid')||
  hash(gps)!==s.hash||
  key(gps[1])!==key(loopPlan.originalGPSNodes?.[2])||
  key(gps[2])!==key(loopPlan.originalGPSNodes?.[5])||
  meters(gps[1],gps[2])<100||
  meters(gps[1],gps[2])>104)return null;
 return {version:'5.166',regionId,roadId:s.roadId,
  sourceRoadHash:s.hash,sourceRoadGPS:gps.map(p=>({lat:p.lat,lon:p.lon})),
  sourceCrossingIDs:[...s.sourceCrossings],
  originalRoadNodes:4,originalZebras:2,
  stopBuffer:s.stopBuffer,slowdown:s.slowdown,watch:s.watch,
  settled:s.settled,curbHold:s.curbHold,curbLookahead:s.curbLookahead,
  sourceGPSUnchanged:true,noAddedGeometry:true,
  playerCarNotAutomaticallyBraked:true,
  newRoads:0,newCrossings:0,newColliders:0,newProps:0
 };
}
export function makeTopolovaPriority5166(plan,toWorld){
 if(plan?.version!=='5.166'||typeof toWorld!=='function')return null;
 const ps=plan.sourceRoadGPS?.map(toWorld).map(p=>({x:p?.x,z:p?.y}));
 if(ps?.length!==4||ps.some(p=>!Number.isFinite(p.x)||
  !Number.isFinite(p.z)))return null;
 const roadSegments=ps.slice(1).map((b,i)=>{
  const a=ps[i];return {a,b,len:Math.hypot(b.x-a.x,b.z-a.z)};
 });
 if(roadSegments.some(s=>s.len<9||s.len>104))return null;
 return {version:'5.166',roadId:plan.roadId,roadSegments,
  crossingIDs:[...plan.sourceCrossingIDs],
  stopBuffer:plan.stopBuffer,slowdown:plan.slowdown,
  watch:plan.watch,settled:plan.settled,
  curbHold:plan.curbHold,curbLookahead:plan.curbLookahead,
  newMeshes:0
 };
}
const near=(p,q)=>Math.hypot(p.x-q.x,p.y-q.z)<.12;
export function topolovaApproach5166(control,car){
 if(control?.version!=='5.166'||String(car?.seg?.osmId)!==control.roadId||
  ![1,-1].includes(car?.direction)||!Number.isFinite(car?.progress)||
  car.progress<0||car.progress>1||!Number.isFinite(car.seg.len))return null;
 const i=control.roadSegments.findIndex(s=>
  near(car.seg.a,s.a)&&near(car.seg.b,s.b)&&
  Math.abs(car.seg.len-s.len)<.15);
 if(i<0)return null;
 const dir=car.direction;
 const key=dir===1?(i===0?'south':i===1?'north':null):
  (i===1?'south':i===2?'north':null);
 if(!key)return null;
 const ahead=(dir===1?1-car.progress:car.progress)*car.seg.len;
 return {key,segmentIndex:i,direction:dir,distanceAhead:ahead,
  committed:ahead<control.stopBuffer};
}
export function topolovaIntent5166(control,route,distance){
 if(control?.version!=='5.166'||route?.version!=='5.165'||
  route.segments?.length!==6||!Number.isFinite(distance)||
  distance<0||!Number.isFinite(route.length)||route.length<=0)return null;
 const d=distance%route.length;
 const south=route.segments[0].endMetres,north=route.segments[3].endMetres;
 if(d>=south-control.curbLookahead&&d<route.segments[2].endMetres)
  return {key:'south',gate:south,onCrossing:d>=south};
 if(d>=north-control.curbLookahead&&d<route.segments[5].endMetres)
  return {key:'north',gate:north,onCrossing:d>=north};
 return null;
}
export function topolovaYieldCar5166(control,car,intent,dt){
 const approach=topolovaApproach5166(control,car);
 const no={yielding:false,approach,capMetres:Infinity,factor:1};
 if(!approach||!intent||approach.key!==intent.key||
  car.driven||car.parked||!Number.isFinite(dt)||dt<=0||
  approach.committed||approach.distanceAhead>control.watch)return no;
 const budget=Math.max(0,approach.distanceAhead-control.stopBuffer);
 return {yielding:true,approach,capMetres:budget,
  factor:Math.min(1,budget/control.slowdown)};
}
export function topolovaWaitAtCurb5166(control,route,distance,step,cars){
 if(control?.version!=='5.166'||route?.version!=='5.165'||
  !Number.isFinite(distance)||distance<0||
  !Number.isFinite(step)||step<0||!Array.isArray(cars))return null;
 const intent=topolovaIntent5166(control,route,distance);
 if(!intent||intent.onCrossing||
  (distance%route.length)+step<intent.gate)
  return {wait:false,step,intent,reason:'no-entry'};
 const unsafe=cars.some(car=>{
  if(car.parked)return false;
  const a=topolovaApproach5166(control,car);
  if(!a||a.key!==intent.key||a.distanceAhead>control.watch)return false;
  if(car.driven)return true;
  return a.committed||a.distanceAhead>control.stopBuffer+control.settled;
 });
 if(!unsafe)return {wait:false,step,intent,reason:'clear-or-yielded'};
 return {wait:true,step:Math.max(0,Math.min(step,
  intent.gate-control.curbHold-(distance%route.length))),
  intent,reason:'vehicle-not-yet-yielded'};
}
