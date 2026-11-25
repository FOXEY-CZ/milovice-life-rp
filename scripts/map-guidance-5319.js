// 5.319: straight-line player-relative navigation, not a road route or entrance.
export function calculateMapGuidance5319(player,target,yaw){
 if(![player?.x,player?.z,target?.x,target?.z,yaw].every(Number.isFinite))return null;
 const dx=target.x-player.x,dz=target.z-player.z,distance=Math.hypot(dx,dz);
 if(!Number.isFinite(distance))return null;
 const bearing=Math.atan2(dx,-dz),relative=((bearing+yaw)%(2*Math.PI)+2*Math.PI)%(2*Math.PI);
 const near=distance<=15;
 const arrows=['↑','↗','→','↘','↓','↙','←','↖'];
 return {distanceMetres:distance,roundedMetres:Math.round(distance),relativeDegrees:relative*180/Math.PI,
  arrow:near?'●':arrows[Math.round(relative/(Math.PI/4))%8],near,straightLine:true,entranceVerified:false};
}
