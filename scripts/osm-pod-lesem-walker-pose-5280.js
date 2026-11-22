/** 5.280: visually smooth ONE source-locked Pod Lesem walker.
 * Geometry, speed and vehicle yielding stay in the original 5.275–5.278
 * pedestrian planners. Only facing and limb animation are altered.
 */
const TAU=Math.PI*2;
export function stepPodLesemWalkerPose5280({
 yaw,targetYaw,dt,movedMetres,phase,swing,waiting=false
}={}){
 if(![yaw,targetYaw,dt,movedMetres,phase,swing].every(Number.isFinite)||
  dt<0||movedMetres<0||![true,false].includes(waiting))return null;
 // Clamping delayed frames prevents huge visual jumps after tab suspension.
 const frame=Math.min(dt,.1);
 const angle=Math.atan2(Math.sin(targetYaw-yaw),Math.cos(targetYaw-yaw));
 const maxTurn=4.6*frame;
 const turn=Math.max(-maxTurn,Math.min(maxTurn,angle));
 const nextYaw=Math.atan2(Math.sin(yaw+turn),Math.cos(yaw+turn));
 // Footsteps follow actual world distance, not frame/clock time. Waiting at
 // the zebra relaxes both arms and legs instead of marching in place.
 const nextPhase=(phase+(waiting?0:Math.min(movedMetres,3)*TAU/1.55))%TAU;
 const wanted=waiting?0:Math.sin(nextPhase)*.46;
 const nextSwing=swing+(wanted-swing)*Math.min(1,frame*12);
 return {yaw:nextYaw,phase:nextPhase,swing:nextSwing,
  turnRadians:turn,idle:waiting,sourceGeometryUntouched:true};
}
