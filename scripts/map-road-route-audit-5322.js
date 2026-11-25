// 5.322: audit a route against the actual existing public-road segments.
// Do not treat road-graph node quantization as exact surveyed connectivity.
const valid=p=>Number.isFinite(p?.x)&&Number.isFinite(p?.y);
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const node=p=>Math.round(p.x*3)+','+Math.round(p.y*3);
function project(p,s){
 const dx=s.b.x-s.a.x,dy=s.b.y-s.a.y,d=dx*dx+dy*dy;
 if(d<=0)return null;
 const t=((p.x-s.a.x)*dx+(p.y-s.a.y)*dy)/d;
 if(t< -1e-7||t>1+1e-7)return null;
 return {t,error:distance(p,{x:s.a.x+dx*t,y:s.a.y+dy*t})};
}
export function auditPublicRoadRoute5322(route,segments){
 if(route?.status!=='ready'||!Array.isArray(route.legs)||!Array.isArray(segments)||
 !Number.isFinite(route.distanceMetres)||route.distanceMetres<0)return null;
 const byId=new Map();
 for(const s of segments){
  if(!valid(s.a)||!valid(s.b)||!Number.isFinite(s.len)||s.len<=0)continue;
  const id=String(s.osmId);if(!byId.has(id))byId.set(id,[]);byId.get(id).push(s);
 }
 let total=0,maxJoinGap=0,previous=null;
 const ids=new Set();
 for(const leg of route.legs){
  if(!valid(leg?.a)||!valid(leg?.b))return null;
  const id=String(leg.osmId),length=distance(leg.a,leg.b);
  if(length<=1e-6)return null;
  const matched=(byId.get(id)||[]).some(s=>{
   const a=project(leg.a,s),b=project(leg.b,s);
   if(!a||!b||a.error>1e-5||b.error>1e-5)return false;
   return b.t>=a.t?s.oneway!==-1:s.oneway!==1;
  });
  if(!matched)return null;
  if(previous){
   const gap=distance(previous,leg.a);
   if(gap>1e-5&&node(previous)!==node(leg.a))return null;
   maxJoinGap=Math.max(maxJoinGap,gap);
  }
  total+=length;previous=leg.b;ids.add(id);
 }
 if(Math.abs(total-route.distanceMetres)>.001)return null;
 if(previous&&(!valid(route.destinationRoadPoint)||distance(previous,route.destinationRoadPoint)>1e-5))return null;
 return {valid:true,legCount:route.legs.length,sourceRoadIds:[...ids],lengthMetres:total,maxJoinGap,
  usesExistingPublicSegments:true,obeysSegmentOneWay:true,turnRestrictionsVerified:false,
  destinationEntranceVerified:false,newRoadLinks:0};
}
