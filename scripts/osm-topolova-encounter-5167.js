/** Milovice RP 5.167 — TEST-ONLY real-engine encounter setup.
 * Only enabled by ?streetAudit=topolova-encounter-5167&encounterTest=1.
 * Uses the actual 5.165 pedestrian, real 5.166 priority controller and
 * the same driveSegments consumed by ordinary AI cars.
 * No synthetic roads, GPS modifications, pedestrian teleport, mock update
 * loop, persistent vehicle or added building/street geometry.
 */
export const TOPOLOVA_ENCOUNTER_5167=Object.freeze({
 region:'mlada',sourceRoad:'8618275',
 crossing:'1316882854',sourceHash:'c0fe69b0',
 actorVersion:'5.165',trafficVersion:'5.166',
 roadSegmentIndex:0,startAheadMetres:13.5,speedMetresPerSec:8
});
const close=(p,q)=>Number.isFinite(p?.x)&&Number.isFinite(p?.y)&&
 Number.isFinite(q?.x)&&Number.isFinite(q?.z)&&
 Math.hypot(p.x-q.x,p.y-q.z)<.1;
export function planTopolovaEncounter5167({
 regionId,priorityPlan,control,route,driveSegments
}={}){
 const s=TOPOLOVA_ENCOUNTER_5167;
 if(regionId!==s.region||
  priorityPlan?.version!=='5.166'||
  priorityPlan.sourceRoadHash!==s.sourceHash||
  priorityPlan.roadId!==s.sourceRoad||
  priorityPlan.sourceCrossingIDs?.[0]!==s.crossing||
  control?.version!==s.trafficVersion||
  control.roadId!==s.sourceRoad||
  control.crossingIDs?.[0]!==s.crossing||
  control.roadSegments?.length!==3||
  route?.version!==s.actorVersion||
  route.segments?.length!==6||
  route.segments[1].sourceWayId!==s.crossing||
  !Array.isArray(driveSegments))return null;
 const original=control.roadSegments[s.roadSegmentIndex];
 const matching=driveSegments.filter(seg=>String(seg?.osmId)===s.sourceRoad&&
  close(seg.a,original.a)&&close(seg.b,original.b)&&
  Math.abs(seg.len-original.len)<.15);
 if(matching.length!==1||matching[0].len<s.startAheadMetres+4)
  return null;
 const seg=matching[0],progress=1-s.startAheadMetres/seg.len;
 if(progress<=0||progress>=1)return null;
 const southGate=route.segments[0].endMetres;
 return {
  version:'5.167',sourceRoadId:s.sourceRoad,sourceCrossingId:s.crossing,
  roadSegmentIndex:s.roadSegmentIndex,
  realDriveSegment:seg, // Same mutable reference already used by real traffic.
  originalVehicleProgress:progress,initialAhead:s.startAheadMetres,
  initialActorBeforeCrossing:route.segments[0].endMetres,
  actorCrossingGate:southGate,
  initialWalkerOffsetMetres:southGate-.7,
  speed:s.speedMetresPerSec,
  controlledOnlyForAudit:true,simulationNotStreetSurvey:true,
  newRoads:0,newCrossings:0,newSidewalks:0,newColliders:0
 };
}
