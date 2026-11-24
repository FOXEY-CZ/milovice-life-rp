/** 5.295 — original unmarked crossing/footway parking clearance.
 * The 4.25m model corridor is not a surveyed or legal parking restriction.
 * No new paths, markings, parking or physical collision geometry.
 */
const crossings=[
 ['1468803924','e20b801c','1316882862',2,'1468803923',1,'1468803916',2],
 ['1468803939','1671dad2','1046197814',3,'1468803938',0,'1468803937',1],
 ['1468803940','2260e3ab','1316882863',1,'1468803919',0,'1468803916',0],
 ['1468803944','c3abe11d','1046197817',1,'1468803943',0,'1468803942',0],
 ['1468803948','f7e466a7','1019598842',3,'1468803946',0,'1468803945',0],
 ['1468803950','68111e13','1019598842',6,'1468803920',0,'1468803949',0],
 ['1565531149','9ed4e80e','1019598842',9,'1468803922',0,'1468803921',0]
];
const approaches=[
 ['1468803916',3,'f508e769'],['1468803923',2,'4a15058e'],
 ['1468803937',2,'503c9b8f'],['1468803938',3,'2628ec41'],
 ['1468803919',3,'49d8c7cd'],['1468803942',2,'19267711'],
 ['1468803943',2,'04b3117a'],['1468803945',2,'7d8af823'],
 ['1468803946',3,'536e4c8d'],['1468803920',4,'de1fb359'],
 ['1468803949',2,'c88a40dd'],['1468803921',4,'ad678959'],
 ['1468803922',2,'7ee86bf6']
];
const roads=[
 ['1316882862',4,'f6ce4508'],['1046197814',6,'d66521c9'],
 ['1316882863',4,'dc9ee00e'],['1046197817',5,'fffa546b'],
 ['1019598842',16,'539da5e5']
];
export const ARMADNI_PARKING_5295=Object.freeze({
 crossings:Object.freeze(crossings.map(Object.freeze)),
 approaches:Object.freeze(approaches.map(Object.freeze)),
 roads:Object.freeze(roads.map(Object.freeze)),
 clearRadius:4.25,narrowRoadId:'1373371687',narrowFootwayId:'1468803914'
});
function hash(g){
 let h=2166136261;
 for(const c of g.map(p=>p.lat.toFixed(7)+','+p.lon.toFixed(7)).join(';')){
  h^=c.charCodeAt(0);h=Math.imul(h,16777619);
 }
 return(h>>>0).toString(16).padStart(8,'0');
}
const match=(w,n,h)=>w?.type==='way'&&Array.isArray(w.geometry)&&
 w.geometry.length===n&&w.geometry.every(p=>Number.isFinite(p?.lat)&&
 Number.isFinite(p?.lon))&&hash(w.geometry)===h;
const same=(a,b)=>a?.lat===b?.lat&&a?.lon===b?.lon;
const plainFoot=w=>w?.tags?.highway==='footway'&&Object.keys(w.tags).length===1;
const coord=p=>({x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 z:-(p.lat-50.226)*111320});
export function planArmadniParkingGuard5295({regionId,ways,toWorld=coord}={}){
 const c=ARMADNI_PARKING_5295;
 if(regionId!=='mlada'||!Array.isArray(ways)||typeof toWorld!=='function')return null;
 const byId=new Map(ways.map(w=>[String(w.id),w]));
 for(const [id,n,h] of c.roads){
  const w=byId.get(id);
  if(!match(w,n,h)||w.tags?.highway!=='residential')return null;
 }
 for(const [id,n,h] of c.approaches){
  const w=byId.get(id);
  if(!match(w,n,h)||!plainFoot(w))return null;
 }
 const narrow=byId.get(c.narrowRoadId),foot=byId.get(c.narrowFootwayId);
 if(!match(narrow,2,'4027f3bb')||narrow.tags?.highway!=='residential'||
  narrow.tags.lit!=='30'||Object.keys(narrow.tags).length!==2||
  !match(foot,4,'a0c94c44')||!plainFoot(foot))return null;
 for(const [id,h,r,ri,a,ai,b,bi] of c.crossings){
  const w=byId.get(id);
  if(!match(w,3,h)||w.tags?.highway!=='footway'||
   w.tags.footway!=='crossing'||w.tags.crossing!=='unmarked'||
   w.tags['crossing:markings']!=='no'||
   !same(w.geometry[1],byId.get(r).geometry[ri])||
   !same(w.geometry[0],byId.get(a).geometry[ai])||
   !same(w.geometry[2],byId.get(b).geometry[bi]))return null;
 }
 const sourceCrossingIds=c.crossings.map(r=>r[0]),
  sourceApproachIds=c.approaches.map(r=>r[0]);
 const protectedWayIds=[...sourceCrossingIds,...sourceApproachIds,c.narrowFootwayId];
 const segments=[];
 for(const id of protectedWayIds){
  const points=byId.get(id).geometry.map(p=>{
   const q=toWorld(p);return {x:q.x,z:q.z??q.y};
  });
  if(points.some(p=>!Number.isFinite(p.x)||!Number.isFinite(p.z)))return null;
  for(let i=1;i<points.length;i++)segments.push(Object.freeze({id,
   a:Object.freeze(points[i-1]),b:Object.freeze(points[i]),
   crossing:sourceCrossingIds.includes(id)}));
 }
 return Object.freeze({version:'5.295',sourceCrossingIds:Object.freeze(sourceCrossingIds),
  sourceApproachIds:Object.freeze(sourceApproachIds),protectedWayIds:Object.freeze(protectedWayIds),
  exactSourceJunctions:21,sourceRoadIds:Object.freeze(c.roads.map(r=>r[0])),
  narrowRoadId:c.narrowRoadId,segments:Object.freeze(segments),clearRadius:c.clearRadius,
  actualParkingSurveyed:false,newParking:0,newCrossings:0,newZebras:0,newKerbs:0,newColliders:0});
}
function distance(p,a,b){
 const dx=b.x-a.x,dz=b.z-a.z,t=Math.max(0,Math.min(1,
  ((p.x-a.x)*dx+(p.z-a.z)*dz)/(dx*dx+dz*dz||1)));
 return Math.hypot(p.x-a.x-t*dx,p.z-a.z-t*dz);
}
export function inspectArmadniParking5295(plan,spot){
 if(!plan||plan.version!=='5.295')return {clear:true,reason:'outside-source-plan'};
 if(!spot||!Number.isFinite(spot.x)||!Number.isFinite(spot.z))
  return {clear:false,reason:'invalid-candidate'};
 if(spot.type==='roadside'&&String(spot.sourceId)===plan.narrowRoadId)
  return {clear:false,reason:'narrow-model-road',sourceId:plan.narrowRoadId};
 for(const s of plan.segments)
  if(distance(spot,s.a,s.b)<plan.clearRadius)
   return {clear:false,reason:s.crossing?'original-unmarked-crossing':'original-footway',sourceId:s.id};
 return {clear:true,reason:'source-corridor-clear'};
}
