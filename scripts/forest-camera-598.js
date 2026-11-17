// Milovice RP 5.98. The previous "forest camera" used the arithmetic
// mean of polygon vertices. That point can fall entirely outside a concave
// forest (Juventsky les is one of those cases).
// A tech-only camera is instead positioned within an actual mapped polygon,
// next to an existing estimated tree instance, with the view aimed at the crown.
// This is NOT a documented photo position or a surveyed individual tree.
const X=p=>p.x,Z=p=>p.z??p.y;
export function insideMappedPolygon(x,z,points){
 if(!Number.isFinite(x)||!Number.isFinite(z)||!Array.isArray(points)||points.length<3)return false;
 let hit=false;
 for(let i=0,j=points.length-1;i<points.length;j=i++){
  const a=points[i],b=points[j],az=Z(a),bz=Z(b);
  if(![a.x,az,b.x,bz].every(Number.isFinite))return false;
  if((az>z)!==(bz>z)&&x<(b.x-a.x)*(z-az)/(bz-az)+a.x)hit=!hit;
 }
 return hit;
}
export function planForestReviewCamera({forestId,trees,zone,
 isSafe=()=>true,offsetMeters=16}={}){
 if(!forestId||!Array.isArray(trees)||!zone||!Array.isArray(zone.points)||
  typeof isSafe!=='function'||!Number.isFinite(offsetMeters)||
  offsetMeters<9||offsetMeters>24)return null;
 const id=String(forestId);
 const group=trees.filter(t=>String(t.osmId)===id&&
  [t.x,t.z,t.height].every(Number.isFinite)&&t.height>1)
  .sort((a,b)=>a.x-b.x||a.z-b.z);
 if(!group.length)return null;
 // Search fixed directions and score visible crowns, not arbitrary vertex
 // averages or the camera's old eye point.
 const offsets=Array.from({length:12},(_,i)=>{
  const angle=i*Math.PI/6;
  return {x:Math.sin(angle)*offsetMeters,z:Math.cos(angle)*offsetMeters};
 });
 let best=null;
 for(const target of group)for(const offset of offsets){
  const x=target.x+offset.x,z=target.z+offset.z;
  if(!insideMappedPolygon(x,z,zone.points)||!isSafe(x,z))continue;
  if(group.some(t=>Math.hypot(t.x-x,t.z-z)<7.5))continue;
  const vx=target.x-x,vz=target.z-z,range=Math.hypot(vx,vz);
  const ux=vx/range,uz=vz/range;
  let visible=0,score=0;
  for(const other of group){
   const dx=other.x-x,dz=other.z-z,d=Math.hypot(dx,dz);
   if(d<7||d>125)continue;
   const dot=(dx*ux+dz*uz)/d;
   if(dot<.38)continue; // roughly in the horizontal field of view
   visible++;
   score+=Math.max(0,1-d/155)*(.5+.5*dot);
  }
  // Preserve deterministic tie breaking and prefer seeing several trees.
  const quality=visible*2+score;
  if(!best||quality>best.quality+1e-9)best={
   x,z,heading:(Math.atan2(vx,-vz)*180/Math.PI+360)%360,
   forestId:id,targetTree:{x:target.x,z:target.z,height:target.height},
   mappedForest:true,nearbyTreesInFront:visible,quality,
   eyeInsideMappedPolygon:true,eyeSafe:true,
   sourceTreePositionsEstimated:true,photoCameraPositionVerified:false,
   yRecalculatedFromRegionTerrain:true
  };
 }
 return best;
}
