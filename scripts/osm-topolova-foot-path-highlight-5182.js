/** 5.182 — exact, existing OSM walking segment highlight for Topolová mission.
 * Full source way 1314665579 has 18 nodes and spans several blocks.
 * The fictional delivery only uses original indices 12->13.
 * Never display the whole way as the mission or fabricate connectors.
 */
export const TOPOLOVA_MISSION_WEST_5182=Object.freeze({
 wayId:'1314665579',hash:'476fa89b',nodeCount:18,
 southernNode:12,northernNode:13,region:'mlada'
});
const same=(a,b)=>Number.isFinite(a?.lat)&&Number.isFinite(a?.lon)&&
 Number.isFinite(b?.lat)&&Number.isFinite(b?.lon)&&
 a.lat.toFixed(7)===b.lat.toFixed(7)&&a.lon.toFixed(7)===b.lon.toFixed(7);
const hash=g=>{
 let h=2166136261;
 for(const c of g.map(p=>p.lat.toFixed(7)+','+p.lon.toFixed(7)).join(';')){
  h^=c.charCodeAt(0);h=Math.imul(h,16777619);
 }
 return(h>>>0).toString(16).padStart(8,'0');
};
export function planTopolovaMissionWestSegment5182({regionId,ways,loopPlan,toWorld}={}){
 const cfg=TOPOLOVA_MISSION_WEST_5182;
 if(regionId!==cfg.region||!Array.isArray(ways)||
  loopPlan?.version!=='5.165'||
  loopPlan.sourceWayIds?.[2]!==cfg.wayId||
  loopPlan.sourceGPSImmutable!==true||
  typeof toWorld!=='function')return null;
 const found=ways.filter(w=>String(w?.id)===cfg.wayId);
 if(found.length!==1)return null;
 const w=found[0],g=w.geometry;
 if(w.tags?.highway!=='footway'||w.tags?.footway!=='sidewalk'||
  w.tags?.surface!=='paving_stones'||
  !Array.isArray(g)||g.length!==cfg.nodeCount||
  g.some(p=>!Number.isFinite(p?.lat)||!Number.isFinite(p?.lon))||
  hash(g)!==cfg.hash||
  !same(g[cfg.southernNode],loopPlan.originalGPSNodes?.[3])||
  !same(g[cfg.northernNode],loopPlan.originalGPSNodes?.[4]))return null;
 const a=toWorld(g[cfg.southernNode]),b=toWorld(g[cfg.northernNode]);
 if(![a?.x,a?.y,b?.x,b?.y].every(Number.isFinite))return null;
 const length=Math.hypot(a.x-b.x,a.y-b.y);
 if(length<102||length>103)return null;
 return {version:'5.182',sourceWayId:cfg.wayId,
  sourceHash:cfg.hash,originalWayNodes:cfg.nodeCount,
  sourceSegmentIndices:[cfg.southernNode,cfg.northernNode],
  a:{x:a.x,z:a.y},b:{x:b.x,z:b.y},lengthMeters:length,
  visuallyHighlightOriginalPathOnly:true,
  newWorldMeshes:0,newPhysicalWalkways:0,newConnections:0};
}
