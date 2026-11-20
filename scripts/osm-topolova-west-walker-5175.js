/** 5.175: one simulated pedestrian on the original WEST Topolova sidewalk.
 * Physical path is OSM 1314665579, already the west section of 5.165 loop.
 * Turn back 4m before both marked zebra endpoints: never step on asphalt.
 */
export const TOPOLOVA_WEST_WALK_5175=Object.freeze({
 sourceLoop:'5.165',westWay:'1314665579',
 westSegmentIndex:3,trimEachEndMetres:4,simulatedPeople:1
});
export function planTopolovaWestWalk5175(loopPlan){
 const cfg=TOPOLOVA_WEST_WALK_5175;
 if(loopPlan?.version!==cfg.sourceLoop||
  loopPlan.sourceWayIds?.[2]!==cfg.westWay||
  loopPlan.actualMarkedCrossings!==2||
  loopPlan.originalSegmentCount!==6||
  loopPlan.originalGPSNodes?.length!==7||
  loopPlan.sourceGPSImmutable!==true)return null;
 const a=loopPlan.originalGPSNodes[3],b=loopPlan.originalGPSNodes[4];
 if(![a?.lat,a?.lon,b?.lat,b?.lon].every(Number.isFinite))return null;
 const originalLength=Math.hypot((b.lat-a.lat)*111320,
  (b.lon-a.lon)*111320*Math.cos(50.226*Math.PI/180));
 if(originalLength<102||originalLength>103)return null;
 return {version:'5.175',sourceWayId:cfg.westWay,
  originalEndpoints:[{...a},{...b}],originalLengthMetres:originalLength,
  trimMetres:cfg.trimEachEndMetres,walkerCount:cfg.simulatedPeople,
  originalOSMUntouched:true,simulatedNotPhotographed:true,
  newPaths:0,newCrossings:0,newStreetMeshes:0,newColliders:0,
  actuallyCrossesRoad:false};
}
export function makeTopolovaWestWalk5175(plan,toWorld){
 if(plan?.version!=='5.175'||typeof toWorld!=='function')return null;
 const [a,b]=plan.originalEndpoints.map(toWorld);
 if(![a?.x,a?.y,b?.x,b?.y].every(Number.isFinite))return null;
 const dx=b.x-a.x,dz=b.y-a.y,length=Math.hypot(dx,dz);
 if(Math.abs(length-plan.originalLengthMetres)>.15||
  length<=2*plan.trimMetres)return null;
 const ux=dx/length,uz=dz/length,t=plan.trimMetres;
 return {a:{x:a.x+ux*t,y:a.y+uz*t},
  b:{x:b.x-ux*t,y:b.y-uz*t},
  len:length-2*t,width:1.8,wayId:plan.sourceWayId,
  originalOSMRouteUnmodified:true,neverCrossesRoad:true};
}
