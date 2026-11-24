/** 5.294 — SOURCE-LOCKED existing east Armádní C15/C16 footways.
 * OSM proves the original centrelines and exact map-node connectivity,
 * NOT the installed real-world paving material. We use the existing shared
 * neutral model material only to make the mapped pedestrian network legible.
 * No generated paths, crossings, kerbs, parking or collision objects.
 */
export const ARMADNI_EAST_WALKS_5294=Object.freeze({
 region:'mlada',material:'armadni-c13c14-planned-pavers',
 realPavingVerified:false,designOnly:true,
 ways:Object.freeze([
  Object.freeze({id:'1468803918',nodes:2,hash:'a0214f0c'}),
  Object.freeze({id:'1468803919',nodes:3,hash:'49d8c7cd'}),
  Object.freeze({id:'1468803920',nodes:4,hash:'de1fb359'})
 ]),
 north:Object.freeze({id:'1373371686',nodes:7,hash:'7134a638'}),
 joins:Object.freeze([
  Object.freeze({from:'1468803918',fromNode:0,to:'1373371686',toNode:3}),
  Object.freeze({from:'1468803918',fromNode:1,to:'1468803919',toNode:1}),
  Object.freeze({from:'1468803919',fromNode:2,to:'1468803920',toNode:1}),
  Object.freeze({from:'1468803920',fromNode:3,to:'1373371686',toNode:1})
 ])
});
const hash=g=>{
 let h=2166136261;
 for(const c of g.map(p=>p.lat.toFixed(7)+','+p.lon.toFixed(7)).join(';'))
  for(let i=0;i<c.length;i++){h^=c.charCodeAt(i);h=Math.imul(h,16777619);}
 return(h>>>0).toString(16).padStart(8,'0');
};
const matches=(w,source)=>String(w?.id)===source.id&&w.type==='way'&&
 w.tags&&Object.keys(w.tags).length===1&&w.tags.highway==='footway'&&
 Array.isArray(w.geometry)&&w.geometry.length===source.nodes&&
 w.geometry.every(p=>Number.isFinite(p?.lat)&&Number.isFinite(p?.lon))&&
 hash(w.geometry)===source.hash;
const point=p=>({x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 z:-(p.lat-50.226)*111320});
const length=g=>g.slice(1).reduce((n,p,i)=>{
 const a=point(g[i]),b=point(p);
 return n+Math.hypot(a.x-b.x,a.z-b.z);
},0);
const same=(a,b)=>a?.lat===b?.lat&&a?.lon===b?.lon;
export function planArmadniEastWalks5294({regionId,ways}={}){
 const c=ARMADNI_EAST_WALKS_5294;
 if(regionId!==c.region||!Array.isArray(ways))return null;
 const originals=new Map();
 for(const source of [...c.ways,c.north]){
  const w=ways.find(e=>String(e?.id)===source.id);
  if(!matches(w,source))return null;
  originals.set(source.id,w);
 }
 const joins=[];
 for(const j of c.joins){
  const a=originals.get(j.from),b=originals.get(j.to);
  if(!same(a?.geometry[j.fromNode],b?.geometry[j.toNode]))return null;
  joins.push(Object.freeze({...j,exactOriginalOSMNode:true}));
 }
 const routes=c.ways.map(s=>Object.freeze({
  id:s.id,sourceHash:s.hash,sourceNodes:s.nodes,
  sourceMetres:+length(originals.get(s.id).geometry).toFixed(3)
 }));
 const metres=routes.reduce((n,p)=>n+p.sourceMetres,0);
 if(metres<185||metres>188)return null;
 return Object.freeze({
  version:'5.294',regionId,material:c.material,
  sourceWayIds:Object.freeze(routes.map(r=>r.id)),
  routes:Object.freeze(routes),sourceMetres:+metres.toFixed(3),
  connections:Object.freeze(joins),exactMapJunctions:joins.length,
  northPromenadeSourceOSMId:c.north.id,
  sourceGPSUnchanged:true,existingRoadSafeClippingReused:true,
  modelTintNotAsBuilt:true,realPavingVerified:false,
  newFootways:0,newRoads:0,newCrossings:0,newZebras:0,
  newKerbs:0,newParking:0,newColliders:0,newMeshObjects:0
 });
}
export const isArmadniEastWay5294=(plan,way)=>Boolean(
 plan?.version==='5.294'&&ARMADNI_EAST_WALKS_5294.ways.some(s=>
  plan.sourceWayIds.includes(s.id)&&matches(way,s)));
