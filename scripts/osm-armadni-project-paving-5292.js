/** Milovice RP 5.292: 2022 municipal C13/C14 DIO specifies grey concrete
 * pavers for PROJECTED sidewalks (not proof of built material, hue or extent).
 * This is a material-only override for five ORIGINAL mapped OSM footways.
 */
export const ARMADNI_PAVING_5292=Object.freeze({
 regionId:'mlada',material:'armadni-c13c14-planned-pavers',
 drawingUrl:'https://ud.mestolysa.cz/vr2022/vm12/MULL0B01AO22_0/MULL0B01AO3X/DIO.pdf',
 documentIsAsBuilt:false,realStoneShadeVerified:false,
 paths:Object.freeze([
  Object.freeze({id:'1468803921',nodes:4,hash:'ad678959'}),
  Object.freeze({id:'1468803937',nodes:2,hash:'503c9b8f'}),
  Object.freeze({id:'1468803938',nodes:3,hash:'2628ec41'}),
  Object.freeze({id:'1468803907',nodes:2,hash:'76b96ecf'}),
  Object.freeze({id:'1468803914',nodes:4,hash:'a0c94c44'})
 ])
});
const hash=g=>{let h=2166136261;
 for(const c of g.map(p=>p.lat.toFixed(7)+','+p.lon.toFixed(7)).join(';')){
  h^=c.charCodeAt(0);h=Math.imul(h,16777619);
 }return(h>>>0).toString(16).padStart(8,'0')};
const point=p=>({x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 z:-(p.lat-50.226)*111320});
const length=g=>g.slice(1).reduce((sum,p,i)=>{
 const a=point(g[i]),b=point(p);return sum+Math.hypot(a.x-b.x,a.z-b.z)},0);
const matches=(w,c)=>String(w?.id)===c.id&&w.type==='way'&&
 w.tags&&Object.keys(w.tags).length===1&&w.tags.highway==='footway'&&
 Array.isArray(w.geometry)&&w.geometry.length===c.nodes&&
 w.geometry.every(p=>Number.isFinite(p?.lat)&&Number.isFinite(p?.lon))&&
 hash(w.geometry)===c.hash;
export function planArmadniProjectPaving5292({regionId,ways}={}){
 const c=ARMADNI_PAVING_5292;
 if(regionId!==c.regionId||!Array.isArray(ways))return null;
 const routes=[];
 for(const item of c.paths){
  const way=ways.find(w=>String(w?.id)===item.id);
  if(!matches(way,item))return null;
  const metres=length(way.geometry);
  if(metres<3||metres>110)return null;
  routes.push(Object.freeze({
   id:item.id,sourceHash:item.hash,sourceNodes:item.nodes,
   sourceMetres:+metres.toFixed(3)}));
 }
 return Object.freeze({
  version:'5.292',source:'2022 municipal C13/C14 project DIO',
  sourceUrl:c.drawingUrl,material:c.material,
  planningNotAsBuilt:true,realSurfaceVerified:false,
  originalWayIds:Object.freeze(routes.map(r=>r.id)),
  routes:Object.freeze(routes),
  sourceMetres:+routes.reduce((n,r)=>n+r.sourceMetres,0).toFixed(3),
  originalGPSUnchanged:true,existingClippingReused:true,
  newFootways:0,newRoads:0,newKerbs:0,newCrossings:0,
  newParking:0,newColliders:0
 });
}
export const isArmadniProjectPavingWay5292=(plan,way)=>
 Boolean(plan?.version==='5.292'&&ARMADNI_PAVING_5292.paths.some(p=>
  plan.originalWayIds.includes(p.id)&&matches(way,p)));
