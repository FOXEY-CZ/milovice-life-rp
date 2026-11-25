// 5.320: screen-space destination marker, using the same rotation as the minimap streets.
export function mapGoalMarker5320(player,target,yaw,scale=.30,radius=66){
 if(![player?.x,player?.z,target?.x,target?.z,yaw,scale,radius].every(Number.isFinite)||scale<=0||radius<12||radius>72)return null;
 const dx=target.x-player.x,dz=target.z-player.z,distance=Math.hypot(dx,dz);
 const ca=Math.cos(-yaw),sa=Math.sin(-yaw);
 const x=(dx*ca-dz*sa)*scale,y=(dx*sa+dz*ca)*scale,screenDistance=Math.hypot(x,y);
 if(!Number.isFinite(distance)||!Number.isFinite(screenDistance))return null;
 const factor=screenDistance>radius?radius/screenDistance:1;
 return {x:x*factor,y:y*factor,clamped:factor<1,angle:Math.atan2(y,x),
  near:distance<=15,distanceMetres:distance,directPointNotRoute:true,newWorldObjects:0};
}
export function drawMapGoalMarker5320(ctx,marker){
 if(!ctx||!marker)return false;
 ctx.save();ctx.translate(90+marker.x,90+marker.y);
 ctx.strokeStyle='#1e1534';ctx.lineWidth=2;
 ctx.fillStyle='#c49aff';
 if(marker.near){
  ctx.strokeStyle='#c49aff';ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(0,0,15,0,Math.PI*2);ctx.stroke();
 }else if(marker.clamped){
  ctx.rotate(marker.angle);
  ctx.beginPath();ctx.moveTo(8,0);ctx.lineTo(-6,-6);ctx.lineTo(-6,6);ctx.closePath();ctx.fill();ctx.stroke();
 }else{
  ctx.beginPath();ctx.moveTo(0,-7);ctx.lineTo(7,0);ctx.lineTo(0,7);ctx.lineTo(-7,0);ctx.closePath();ctx.fill();ctx.stroke();
 }
 ctx.restore();return true;
}
