/** 5.180 — screen-relative wayfinding for existing 5.179 foot delivery.
 * Player's view looks along (-sin(yaw),-cos(yaw)) in scene X/Z.
 * Does not modify paths, checkpoints, map features or physically route
 * the player across the street; shows direct bearing, not route distance.
 */
export function directionTopolovaFootJob5180(job,player,yaw){
 if(job?.version!=='5.179'||!Array.isArray(job.checkpoints)||
  !Number.isInteger(job.next)||job.next<0||
  job.next>=job.checkpoints.length||!Number.isFinite(player?.x)||
  !Number.isFinite(player?.z)||!Number.isFinite(yaw))return null;
 const goal=job.checkpoints[job.next];
 if(!Number.isFinite(goal?.x)||!Number.isFinite(goal?.z))return null;
 const dx=goal.x-player.x,dz=goal.z-player.z;
 const distance=Math.hypot(dx,dz);
 const targetYaw=Math.atan2(-dx,-dz);
 const relative=Math.atan2(Math.sin(targetYaw-yaw),Math.cos(targetYaw-yaw));
 // Positive yaw difference is a target on the player's view-left side.
 const arrows=['↑','↖','←','↙','↓','↘','→','↗'];
 const sector=(Math.round(relative/(Math.PI/4))+8)%8;
 return {arrow:distance<=job.arrivalRadiusMetres?'✓':arrows[sector],
  distanceMetres:distance,directBearingOnly:true,
  checkpoint:job.next+1,total:job.checkpoints.length,
  withinArrivalRadius:distance<=job.arrivalRadiusMetres,
  noInferredStreetRoute:true};
}
