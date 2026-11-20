/** 5.179 — fictional pedestrian delivery on existing Topolová sidewalk.
 * The only physical route comes from source-locked 5.165 OSM west pavement.
 * No new posts/doors/shops/paths or invented real-world delivery address.
 */
export function makeTopolovaFootJob5179(loopPlan,toWorld){
 if(loopPlan?.version!=='5.165'||loopPlan.sourceWayIds?.[2]!=='1314665579'||
  loopPlan.originalGPSNodes?.length!==7||
  loopPlan.sourceGPSImmutable!==true||
  typeof toWorld!=='function')return null;
 const [a,b]=[loopPlan.originalGPSNodes[3],loopPlan.originalGPSNodes[4]].map(toWorld);
 if(![a?.x,a?.y,b?.x,b?.y].every(Number.isFinite))return null;
 const dx=b.x-a.x,dz=b.y-a.y,length=Math.hypot(dx,dz);
 if(length<102||length>103)return null;
 const at=t=>({x:a.x+dx*t,z:a.y+dz*t});
 const buffer=5/length;
 return {version:'5.179',sourceWayId:'1314665579',
  checkpoints:[at(buffer),at(.5),at(1-buffer)],
  routeLengthMetres:length,arrivalRadiusMetres:5,
  rewardCZK:80,simulatedDelivery:true,
  streetAssetsAdded:0,roadCrossingsRequired:0};
}
export function advanceTopolovaFootJob5179(job,player,walking){
 if(job?.version!=='5.179'||!Number.isInteger(job.next)||
  job.next<0||job.next>=job.checkpoints.length||
  !Number.isFinite(player?.x)||!Number.isFinite(player?.z))return null;
 const point=job.checkpoints[job.next];
 const distance=Math.hypot(player.x-point.x,player.z-point.z);
 const arrived=walking===true&&distance<=job.arrivalRadiusMetres;
 const next=job.next+(arrived?1:0);
 return {next,arrived,complete:arrived&&next===job.checkpoints.length,
  distanceMetres:distance,pausedInVehicle:walking!==true};
}
