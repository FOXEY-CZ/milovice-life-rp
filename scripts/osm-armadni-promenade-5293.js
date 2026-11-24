/** Milovice RP 5.293 — continuous visual paving on an ORIGINAL OSM
 * north Armádní promenade, not a new footway. It meets exactly THREE
 * source-mapped pedestrian ways at unchanged OSM nodes.
 * Material is inspired by the C13/C14 2022 DESIGN drawing; whether the
 * full promenade was built in precisely this stone/shade is not surveyed.
 */
export const ARMADNI_PROMENADE_5293=Object.freeze({
 region:'mlada',sourceOSMId:'1373371686',nodes:7,hash:'7134a638',
 material:'armadni-c13c14-planned-pavers',actualMaterialSurveyed:false,
 links:Object.freeze([
  Object.freeze({id:'1468803921',nodes:4,hash:'ad678959',mainNode:6,linkedNode:3}),
  Object.freeze({id:'1468803914',nodes:4,hash:'a0c94c44',mainNode:5,linkedNode:0}),
  Object.freeze({id:'1468803920',nodes:4,hash:'de1fb359',mainNode:1,linkedNode:3})
 ])
});
const geoHash=g=>{let h=2166136261;
 for(const c of g.map(p=>p.lat.toFixed(7)+','+p.lon.toFixed(7)).join(';')){
  h^=c.charCodeAt(0);h=Math.imul(h,16777619);
 }
 return(h>>>0).toString(16).padStart(8,'0');
};
const matching=(way,id,n,hash)=>String(way?.id)===id&&way.type==='way'&&
 way.tags&&Object.keys(way.tags).length===1&&way.tags.highway==='footway'&&
 Array.isArray(way.geometry)&&way.geometry.length===n&&
 way.geometry.every(p=>Number.isFinite(p?.lat)&&Number.isFinite(p?.lon))&&
 geoHash(way.geometry)===hash;
const same=(a,b)=>a?.lat===b?.lat&&a?.lon===b?.lon;
const xy=p=>({x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 y:-(p.lat-50.226)*111320});
const distance=g=>g.slice(1).reduce((sum,p,i)=>{
 const a=xy(g[i]),b=xy(p);return sum+Math.hypot(b.x-a.x,b.y-a.y);
},0);
export function planArmadniPromenadePaving5293({regionId,ways}={}){
 const c=ARMADNI_PROMENADE_5293;
 if(!['mlada','vrutice','westlink'].includes(regionId)||!Array.isArray(ways))return null;
 const original=ways.find(w=>String(w.id)===c.sourceOSMId);
 if(!matching(original,c.sourceOSMId,c.nodes,c.hash))return null;
 const sourceMetres=distance(original.geometry);
 if(sourceMetres<109||sourceMetres>111)return null;
 const joins=[];
 for(const link of c.links){
  const way=ways.find(w=>String(w.id)===link.id);
  if(!matching(way,link.id,link.nodes,link.hash)||
   !same(original.geometry[link.mainNode],way.geometry[link.linkedNode]))
   return null;
  joins.push(Object.freeze({
   linkedOSMWayId:link.id,
   promenadeNodeIndex:link.mainNode,linkNodeIndex:link.linkedNode,
   actualSharedSourceNode:true,additionalLinework:0
  }));
 }
 return Object.freeze({
  version:'5.293',regionId,sourceWayId:c.sourceOSMId,
  sourceHash:c.hash,material:c.material,sourceNodes:c.nodes,
  sourceMetres:+sourceMetres.toFixed(3),
  joins:Object.freeze(joins),sourceLinkedWays:joins.length,
  originalOSMPathsAndGPSUnchanged:true,
  oldRoadClearanceAndClippingPreserved:true,
  sameSharedPavingMaterialAs5292:true,actualMaterialSurveyed:false,
  newFootways:0,newRoads:0,newCrossings:0,newZebras:0,
  newKerbs:0,newParking:0,newColliders:0,newMeshObjects:0
 });
}
export const isArmadniPromenadeWay5293=(plan,way)=>
 Boolean(plan?.version==='5.293'&&
  matching(way,ARMADNI_PROMENADE_5293.sourceOSMId,
   ARMADNI_PROMENADE_5293.nodes,ARMADNI_PROMENADE_5293.hash));
