/** 5.181 — 2D minimap destination for the existing fictional Topolova
 * walking job. A marker is not route guidance: no inferred connectors.
 * Canvas rendering consumes coordinates only; no scene objects are made.
 */
export function topolovaFootMinimapMarker5181(job,player,heading,scale=.30,limit=72){
 if(job?.version!=='5.179'||!Array.isArray(job.checkpoints)||
  !Number.isInteger(job.next)||job.next<0||job.next>=job.checkpoints.length||
  ![player?.x,player?.z,heading,scale,limit].every(Number.isFinite)||
  scale<=0||scale>2||limit<5||limit>90)return null;
 const target=job.checkpoints[job.next];
 if(!Number.isFinite(target?.x)||!Number.isFinite(target?.z))return null;
 const dx=(target.x-player.x)*scale,dz=(target.z-player.z)*scale;
 // Same signed heading convention as drawMini(): canvas.rotate(-heading).
 const c=Math.cos(-heading),s=Math.sin(-heading);
 const u=dx*c-dz*s,v=dx*s+dz*c;
 const max=Math.max(Math.abs(u),Math.abs(v),1);
 const fraction=Math.min(1,limit/max);
 return {version:'5.181',sourceWayId:job.sourceWayId,
  checkpoint:job.next+1,total:job.checkpoints.length,
  x:u*fraction,y:v*fraction,clamped:fraction<1,
  worldDistanceMetres:Math.hypot(target.x-player.x,target.z-player.z),
  radiusPixels:limit,
  directPointNotRoute:true,createdWorldMarkers:0};
}
