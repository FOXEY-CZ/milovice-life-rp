// 5.304: preserve existing mapped pedestrian access near Juventa.
// Model clearance only; not a surveyed parking restriction.
const sources=[
 ['1472419121',42,'bf53acd7','service'],
 ['1472419122',3,'8f61e6a9','service'],
 ['1472419124',2,'5e4e141c','footway'],
 ['1472419127',4,'d3a9884b','footway'],
 ['1472419128',3,'6aba7fcc','footway'],
 ['1076211056',3,'7d86f217','footway'],
 ['1076211057',10,'a737b2a2','footway'],
 ['1076211058',5,'3f3e550a','footway'],
 ['1076211060',11,'37a5a4a4','footway'],
 ['128087255',12,'b298f8e2','residential'],
 ['128087257',10,'a4b250f9','residential'],
 ['1472419123',2,'d7a25ad2','service']
];
// Exact shared source nodes, not constructed crossings or new footpaths.
const junctions=[
 ['1076211056',1,'128087255',6],
 ['1076211056',2,'1076211057',0],
 ['1076211056',2,'1076211058',0],
 ['1076211056',2,'1076211060',0],
 ['1076211057',1,'1472419121',1],
 ['1076211057',9,'1472419127',0],
 ['1076211057',9,'1472419128',0],
 ['1076211058',2,'1472419124',0],
 ['1472419124',1,'1472419121',5],
 ['1472419124',1,'1472419123',1],
 ['1472419127',3,'1472419122',1],
 ['1472419128',1,'1472419121',40],
 ['1472419121',0,'128087255',5],
 ['1472419121',41,'128087257',3]
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
 const crossing=byId.get('1076211056');
 if(crossing.tags.footway!=='crossing'||crossing.tags.crossing!=='marked'||
  crossing.tags['crossing:markings']!=='yes'||byId.get('1076211060').tags.footway!=='sidewalk'||
  byId.get('128087255').tags.name!=='Komenského'||byId.get('128087257').tags.name!=='Komenského')return null;
 for(const [a,i,b,j] of junctions){
  const p=byId.get(a).geometry[i],q=byId.get(b).geometry[j];
  if(p.lat!==q.lat||p.lon!==q.lon)return null;
 }
 const segments=[];
 const protectedWayIds=sources.filter(s=>s[3]==='footway').map(s=>s[0]);
 for(const id of protectedWayIds){
  const points=byId.get(id).geometry.map(p=>{const q=toWorld(p);return {x:q.x,z:q.z??q.y}});
  if(points.some(p=>!Number.isFinite(p.x)||!Number.isFinite(p.z)))return null;
  for(let i=1;i<points.length;i++)segments.push({id,a:points[i-1],b:points[i]});
 }
 return {sourceRegion:regionId,protectedWayIds,segments,clearRadius:4.25,actualParkingSurveyed:false,
  exactSourceJunctions:junctions.length,sourceCrossingId:'1076211056'};
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
