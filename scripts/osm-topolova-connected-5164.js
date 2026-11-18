/** Milovice RP 5.164 — real OSM pedestrian junction, no new walkway.
 *
 * OSM footway 1316882860 ends exactly at node 13 of OSM sidewalk
 * 1316882852. The mapped paving bends through existing nodes 14..21
 * and reaches the original 102.53m promenade (21->22). An NPC can
 * walk the entire continuous GPS trace without turning back at the
 * shared 5.162/5.163 route boundaries or crossing any roadway.
 *
 * The pedestrian is ONLY game simulation: no verified person, door,
 * entrance path, fence, public bench or extra physical surface.
 */
export const TOPOLOVA_CONNECTED_5164=Object.freeze({
 region:'mlada',
 spur:Object.freeze({id:'1316882860',hash:'35c50c19',vertices:2,
  highway:'footway',surface:'paving_stones',lit:'yes'}),
 pavement:Object.freeze({id:'1316882852',hash:'a50c0251',vertices:28,
  highway:'footway',footway:'sidewalk',surface:'paving_stones',lit:'yes'}),
 service:Object.freeze({id:'202399863',hash:'ec6c3bc0',vertices:4,
  highway:'service',service:'driveway'}),
 southernZebra:'1316882854',northernZebra:'1316882853',
 sidewalkJunctionIndex:13,lastSidewalkIndex:22,
 northVehicleBufferMeters:2,northZebraBufferMeters:4,
 exampleWalkers:1,
 sourceRowIds:Object.freeze([
  '61979151','61979152','61979144','61979139','61979145'
 ])
});
const same=(a,b)=>a?.lat?.toFixed(7)===b?.lat?.toFixed(7)&&
 a?.lon?.toFixed(7)===b?.lon?.toFixed(7);
const m=(a,b)=>Math.hypot((a.lat-b.lat)*111320,
 (a.lon-b.lon)*111320*Math.cos(50.226*Math.PI/180));
const hash=g=>{
 let h=2166136261;
 for(const ch of g.map(p=>p.lat.toFixed(7)+','+p.lon.toFixed(7)).join(';')){
  h^=ch.charCodeAt(0);h=Math.imul(h,16777619);
 }
 return(h>>>0).toString(16).padStart(8,'0');
};
const match=(w,s)=>w?.tags?.highway===s.highway&&
 Array.isArray(w.geometry)&&w.geometry.length===s.vertices&&
 w.geometry.every(p=>Number.isFinite(p?.lat)&&Number.isFinite(p?.lon))&&
 hash(w.geometry)===s.hash&&
 !['private','no','customers'].includes(w.tags.access);
export function planTopolovaConnectedWalk5164({
 regionId,rowPlan,shortWalkPlan,promenadePlan,ways
}={}){
 const s=TOPOLOVA_CONNECTED_5164;
 if(regionId!==s.region||!Array.isArray(ways)||
  rowPlan?.version!=='5.155'||rowPlan.contiguousExactSharedPartyWalls!==4||
  JSON.stringify(rowPlan.sourceOSMIds)!==JSON.stringify(s.sourceRowIds)||
  shortWalkPlan?.version!=='5.162'||
  shortWalkPlan.sourceFootwayHash!==s.spur.hash||
  shortWalkPlan.sourceSidewalkId!==s.pavement.id||
  promenadePlan?.version!=='5.163'||
  promenadePlan.sourceSidewalkHash!==s.pavement.hash||
  promenadePlan.sourceCrossingIDs?.join(',')!==
   [s.southernZebra,s.northernZebra].join(','))
  return null;
 const find=spec=>{
  const matched=ways.filter(w=>String(w?.id)===spec.id);
  return matched.length===1&&match(matched[0],spec)?matched[0]:null;
 };
 const a=find(s.spur),b=find(s.pavement),c=find(s.service);
 if(!a||!b||!c||
  a.tags.surface!==s.spur.surface||a.tags.lit!==s.spur.lit||
  b.tags.surface!==s.pavement.surface||
  b.tags.footway!==s.pavement.footway||
  b.tags.lit!==s.pavement.lit||
  c.tags.service!==s.service.service||
  !same(a.geometry[0],c.geometry[2])||
  !same(a.geometry[1],b.geometry[s.sidewalkJunctionIndex])||
  !same(a.geometry[1],shortWalkPlan.routeOriginalGPS[1])||
  !same(b.geometry[21],promenadePlan.originalGPSNodes[0])||
  !same(b.geometry[22],promenadePlan.originalGPSNodes[1]))
  return null;
 const selected=[...a.geometry,b.geometry[s.sidewalkJunctionIndex],
  ...b.geometry.slice(s.sidewalkJunctionIndex+1,s.lastSidewalkIndex+1)];
 // Do not insert the duplicated junction coordinate as a zero-length leg.
 selected.splice(2,1);
 if(selected.length!==11||
  !selected.every(p=>Number.isFinite(p.lat)&&Number.isFinite(p.lon)))return null;
 const sectionMeters=selected.slice(1).map((p,i)=>m(p,selected[i]));
 const original=sectionMeters.reduce((a,b)=>a+b,0);
 const maxLeg=Math.max(...sectionMeters),shortestLeg=Math.min(...sectionMeters);
 if(original<196||original>198||maxLeg>104||shortestLeg<2||
  Math.abs(sectionMeters[0]-shortWalkPlan.rawLengthMetres)>.13||
  Math.abs(sectionMeters.at(-1)-promenadePlan.originalMetres)>.13)
  return null;
 return {
  version:'5.164',
  sourceWayIds:[s.spur.id,s.pavement.id],
  sourceOSMHashes:[s.spur.hash,s.pavement.hash],
  originalGPSNodes:selected.map(p=>({lat:p.lat,lon:p.lon})),
  originalOSMRouteMeters:+original.toFixed(3),
  originalWorldNodeCount:selected.length,
  contiguousOriginalWayTransitions:1,
  junctionNodeIndex:1,junctionAt:s.sidewalkJunctionIndex,
  routeInternalTurns:9,
  originalSpurMetres:+sectionMeters[0].toFixed(3),
  originalPromenadeMetres:+sectionMeters.at(-1).toFixed(3),
  firstJunctionTrimsMeters:s.northVehicleBufferMeters,
  finalZebraTrimsMeters:s.northZebraBufferMeters,
  navigableRouteMeters:+(original-6).toFixed(3),
  sourceSouthZebraId:s.southernZebra,
  sourceNorthZebraId:s.northernZebra,
  modelsSimulated:s.exampleWalkers,
  peopleNotPhotoVerified:true,
  sourceGPSImmutable:true,
  noDrivewayOrZebraWalking:true,
  newPavementMeshes:0,createdRoads:0,createdCrossings:0,
  createdEntrances:0,createdColliders:0,createdStreetProps:0
 };
}
export function makeTopolovaConnectedRoute5164(plan,toWorld){
 if(plan?.version!=='5.164'||typeof toWorld!=='function')return null;
 const w=plan.originalGPSNodes?.map(toWorld);
 if(w?.length!==11||w.some(p=>!Number.isFinite(p?.x)||!Number.isFinite(p?.y)))
  return null;
 const pts=w.map(p=>({x:p.x,z:p.y}));
 const trim=(at,next,distance,sign)=>{
  const dx=next.x-at.x,dz=next.z-at.z,len=Math.hypot(dx,dz);
  return {x:at.x+dx/len*distance*sign,z:at.z+dz/len*distance*sign};
 };
 // Move only the actor's ROUTE endpoints inward. Never move a physical
 // OSM source vertex, sidewalk geometry or mapped marked crossing.
 pts[0]=trim(pts[0],pts[1],plan.firstJunctionTrimsMeters,1);
 pts[pts.length-1]=trim(pts.at(-1),pts.at(-2),
  plan.finalZebraTrimsMeters,1);
 const segs=[],cumulative=[0];
 for(let i=0;i<pts.length-1;i++){
  const a=pts[i],b=pts[i+1],len=Math.hypot(b.x-a.x,b.z-a.z);
  if(!Number.isFinite(len)||len<1.5||len>104)return null;
  const item={a,b,len,ux:(b.x-a.x)/len,uz:(b.z-a.z)/len,
   sourceWayId:i===0?plan.sourceWayIds[0]:plan.sourceWayIds[1],
   originalWorldSegmentIndex:i,
   startMetres:cumulative[i],endMetres:cumulative[i]+len};
  segs.push(item);cumulative.push(item.endMetres);
 }
 const total=cumulative.at(-1);
 if(Math.abs(total-plan.navigableRouteMeters)>.15)return null;
 return {
  version:'5.164',segments:segs,cumulative,
  length:total,junctionDistance:segs[0].len,
  sourceWayIds:[...plan.sourceWayIds],newGeometry:0
 };
}
export function sampleTopolovaConnectedRoute5164(route,distance,direction=1){
 if(route?.version!=='5.164'||!Number.isFinite(distance)||
  !Number.isFinite(route.length)||route.length<=0||
  ![1,-1].includes(direction))return null;
 const bounded=Math.max(0,Math.min(route.length,distance));
 let i=route.segments.findIndex(s=>bounded<s.endMetres);
 if(i<0)i=route.segments.length-1;
 const seg=route.segments[i],t=Math.max(0,
  Math.min(1,(bounded-seg.startMetres)/seg.len));
 return {
  x:seg.a.x+(seg.b.x-seg.a.x)*t,
  z:seg.a.z+(seg.b.z-seg.a.z)*t,
  tangentX:seg.ux*direction,tangentZ:seg.uz*direction,
  distance:bounded,direction,segmentIndex:i,
  onSpur:i===0,sourceWayId:seg.sourceWayId
 };
}
export function advanceTopolovaConnectedRoute5164(
 route,distance,direction,metres
){
 if(!Number.isFinite(metres)||metres<0||!Number.isFinite(distance)||
  ![1,-1].includes(direction)||route?.version!=='5.164')return null;
 let d=distance+direction*metres,dir=direction,bounces=0;
 while(d<0||d>route.length){
  if(d>route.length){d=2*route.length-d;dir=-1}
  else if(d<0){d=-d;dir=1}
  bounces++;
  if(bounces>8)return null;
 }
 return {...sampleTopolovaConnectedRoute5164(route,d,dir),bounces};
}
