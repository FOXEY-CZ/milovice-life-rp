/** Milovice RP 5.168 — TEST-ONLY dual-direction AI encounter at the
 * ORIGINAL north zebra of Topolova. Normal gameplay is untouched.
 * Activated exclusively by north audit + encounterTest=1. One existing
 * 5.165 actor is INITIALIZED at the mapped western curb for this test.
 * This is a controlled test spawn, not a natural 223m preceding walk.
 * Both real 5.166 AI cars use original road 8618275 and live traffic loop.
 */
export const TOPOLOVA_NORTH_ENCOUNTER_5168=Object.freeze({
 region:'mlada',sourceRoadId:'8618275',sourceRoadHash:'c0fe69b0',
 southSource:'1316882854',northSource:'1316882853',
 westSidewalk:'1314665579',eastSidewalk:'1316882852',
 carSegments:Object.freeze([1,2]),
 carDirections:Object.freeze([1,-1]),
 startAheadMetres:13.5,startPedestrianBeforeNorthMetres:.7,
 carSpeedMetresPerSec:8
});
const close=(p,q)=>Number.isFinite(p?.x)&&Number.isFinite(p?.y)&&
 Number.isFinite(q?.x)&&Number.isFinite(q?.z)&&
 Math.hypot(p.x-q.x,p.y-q.z)<.1;
const closeXZ=(p,q)=>Number.isFinite(p?.x)&&Number.isFinite(p?.z)&&
 Number.isFinite(q?.x)&&Number.isFinite(q?.z)&&
 Math.hypot(p.x-q.x,p.z-q.z)<.1;
export function planTopolovaNorthEncounter5168({
 regionId,priorityPlan,control,route,driveSegments
}={}){
 const s=TOPOLOVA_NORTH_ENCOUNTER_5168;
 if(regionId!==s.region||
  priorityPlan?.version!=='5.166'||
  priorityPlan.sourceRoadHash!==s.sourceRoadHash||
  priorityPlan.roadId!==s.sourceRoadId||
  priorityPlan.sourceCrossingIDs?.join(',')!==
   [s.southSource,s.northSource].join(',')||
  control?.version!=='5.166'||control.roadId!==s.sourceRoadId||
  control.crossingIDs?.join(',')!==
   [s.southSource,s.northSource].join(',')||
  control.roadSegments?.length!==3||
  route?.version!=='5.165'||route.segments?.length!==6||
  route.segments[0].sourceWayId!==s.eastSidewalk||
  route.segments[3].sourceWayId!==s.westSidewalk||
  route.segments[4].sourceWayId!==s.northSource||
  route.segments[5].sourceWayId!==s.northSource||
  route.segments[1].sourceWayId!==s.southSource||
  !Array.isArray(driveSegments)||
  !closeXZ(route.segments[4].b,control.roadSegments[1].b)||
  !closeXZ(route.segments[5].a,control.roadSegments[2].a))
  return null;
 const carPlans=[];
 for(let n=0;n<2;n++){
  const index=s.carSegments[n],dir=s.carDirections[n];
  const original=control.roadSegments[index];
  const matches=driveSegments.filter(seg=>
   String(seg?.osmId)===s.sourceRoadId&&
   close(seg.a,original.a)&&close(seg.b,original.b)&&
   Math.abs(seg.len-original.len)<.15&&
   (seg.oneway===0||seg.oneway===dir));
  if(matches.length!==1||matches[0].len<s.startAheadMetres+3.5)
   return null;
  const segment=matches[0];
  const progress=dir===1?1-s.startAheadMetres/segment.len:
   s.startAheadMetres/segment.len;
  if(progress<=0||progress>=1)return null;
  carPlans.push({
   roadSegmentIndex:index,direction:dir,segment,progress,
   initialAheadMetres:s.startAheadMetres,speed:s.carSpeedMetresPerSec
  });
 }
 const before=route.segments[3].endMetres-
  s.startPedestrianBeforeNorthMetres;
 if(!(before>route.segments[3].startMetres)||
  !(before<route.segments[3].endMetres)||
  route.length<=route.segments[5].endMetres-.01)return null;
 return {
  version:'5.168',regionId,sourceRoadId:s.sourceRoadId,
  sourceRoadHash:s.sourceRoadHash,sourceCrossingId:s.northSource,
  sourceWestSidewalkId:s.westSidewalk,
  sourceEastSidewalkId:s.eastSidewalk,
  actorStartDistanceMetres:before,
  northGateMetres:route.segments[3].endMetres,
  cars:carPlans,
  testCars:2,vehiclesOnlyWithAuditQuery:true,
  actorTestStartRepositioned:true,
  usesExistingRoadGeometry:true,
  newRoads:0,newCrossings:0,newSidewalks:0,newColliders:0,
  newEntrances:0,newStreetProps:0
 };
}
