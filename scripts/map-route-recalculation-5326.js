// 5.326 candidate: bounded recalculation policy for cached audited routes.
// Pure decision only. Does not create road links or run a pathfinder.
const finitePoint=p=>Number.isFinite(p?.x)&&Number.isFinite(p?.y);
function distanceToLeg(point,leg){
 if(!finitePoint(leg?.a)||!finitePoint(leg?.b))return Infinity;
 const dx=leg.b.x-leg.a.x,dy=leg.b.y-leg.a.y,den=dx*dx+dy*dy;
 if(!Number.isFinite(den)||den<=1e-12)return Infinity;
 const t=Math.max(0,Math.min(1,((point.x-leg.a.x)*dx+(point.y-leg.a.y)*dy)/den));
 return Math.hypot(point.x-leg.a.x-t*dx,point.y-leg.a.y-t*dy);
}
export function routeRecalculation5326(cache,{now,x,z,goal,revision}={}){
 if(!Number.isFinite(now)||!Number.isFinite(x)||!Number.isFinite(z)||!goal)return null;
 if(!cache||cache.goal!==goal||cache.revision!==revision)return 'changed';
 if(![cache.time,cache.x,cache.z].every(Number.isFinite)||now<cache.time)return 'changed';
 const elapsed=now-cache.time,moved=Math.hypot(x-cache.x,z-cache.z);
 // Keep original periodic behavior, including retry after an unavailable route.
 if(elapsed>2000&&moved>15)return 'movement';
 // No scan or early route recomputation while standing still or within cooldown.
 if(elapsed<1000||moved<8)return null;
 const route=cache.result,audit=cache.audit;
 if(route?.status!=='ready'||!audit?.valid||!Array.isArray(route.legs)||
    !route.legs.length||audit.legCount!==route.legs.length||
    !Number.isFinite(route.startOffset)||route.startOffset<0)return null;
 // A vehicle may already be offset from the road at the last computation.
 // Only trigger when farther away than both the base margin and initial offset.
 const threshold=Math.max(18,route.startOffset+8),point={x,y:z};
 for(const leg of route.legs){
  const distance=distanceToLeg(point,leg);
  if(!Number.isFinite(distance)||distance<=threshold)return null;
 }
 return 'deviation';
}
