// 5.304: preserve existing mapped pedestrian access near Juventa.
// Model clearance only; not a surveyed parking restriction.
const sources=[
 ['1472419121',42,'bf53acd7','service'],
 ['1472419122',3,'8f61e6a9','service'],
 ['1472419124',2,'5e4e141c','footway'],
 ['1472419127',4,'d3a9884b','footway'],
 ['1472419128',3,'6aba7fcc','footway']
];
function hash(g){
 let h=2166136261;
 for(const c of g.map(p=>p.lat.toFixed(7)+','+p.lon.toFixed(7)).join(';')){
  h^=c.charCodeAt(0);h=Math.imul(h,16777619);
 }
 return (h>>>0).toString(16).padStart(8,'0');
}
export function planJuventaAccess5304({regionId,ways,toWorld}={}){
 if(!['mlada','westlink'].includes(regionId)||!Array.isArray(ways)||typeof toWorld!=='function')return null;
 const byId=new Map(ways.map(w=>[String(w.id),w]));
 for(const [id,n,h,kind] of sources){
  const w=byId.get(id);
  if(w?.type!=='way'||w.tags?.highway!==kind||!Array.isArray(w.geometry)||
   w.geometry.length!==n||!w.geometry.every(p=>Number.isFinite(p?.lat)&&Number.isFinite(p?.lon))||hash(w.geometry)!==h)return null;
 }
 const segments=[];
 const protectedWayIds=sources.filter(s=>s[3]==='footway').map(s=>s[0]);
 for(const id of protectedWayIds){
  const points=byId.get(id).geometry.map(p=>{const q=toWorld(p);return {x:q.x,z:q.z??q.y}});
  if(points.some(p=>!Number.isFinite(p.x)||!Number.isFinite(p.z)))return null;
  for(let i=1;i<points.length;i++)segments.push({id,a:points[i-1],b:points[i]});
 }
 return {sourceRegion:regionId,protectedWayIds,segments,clearRadius:4.25,actualParkingSurveyed:false};
}
export function permitJuventaParking5304(plan,spot){
 if(!plan)return true;
 if(!spot||!Number.isFinite(spot.x)||!Number.isFinite(spot.z))return false;
 return !plan.segments.some(({a,b})=>{
  const dx=b.x-a.x,dz=b.z-a.z;
  const t=Math.max(0,Math.min(1,((spot.x-a.x)*dx+(spot.z-a.z)*dz)/(dx*dx+dz*dz||1)));
  return Math.hypot(spot.x-a.x-t*dx,spot.z-a.z-t*dz)<plan.clearRadius;
 });
}
