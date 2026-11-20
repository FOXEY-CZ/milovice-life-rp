/** 5.199 — two original pedestrian ways between mapped Višňová blocks.
 * OSM proves the centreline only. Colour and texture are a visual estimate.
 * Reuse the game's existing clipped 1.8 m pedestrian-strip geometry.
 */
export const VISNOVA_MAPPED_WALKS_5199=Object.freeze({
 region:'mlada',
 ways:Object.freeze([
  Object.freeze({id:'1460019808',nodes:3,hash:'0f0eb13c'}),
  Object.freeze({id:'1460019811',nodes:3,hash:'cd55662f'})
 ]),
 material:'visnova-footway-model',photoVerifiedSurface:false
});
const hash=geo=>{
 let h=2166136261;
 for(const c of geo.map(p=>p.lat.toFixed(7)+','+p.lon.toFixed(7)).join(';')){
  h^=c.charCodeAt(0);h=Math.imul(h,16777619);
 }
 return(h>>>0).toString(16).padStart(8,'0');
};
export function planVisnovaMappedWalk5199(regionId,way){
 if(regionId!==VISNOVA_MAPPED_WALKS_5199.region)return null;
 const c=VISNOVA_MAPPED_WALKS_5199.ways.find(v=>v.id===String(way?.id));
 if(!c||way?.tags?.highway!=='footway'||
  Object.keys(way.tags).length!==1||
  !Array.isArray(way.geometry)||way.geometry.length!==c.nodes||
  way.geometry.some(p=>!Number.isFinite(p?.lat)||!Number.isFinite(p?.lon))||
  hash(way.geometry)!==c.hash)return null;
 return {version:'5.199',sourceWayId:c.id,sourceHash:c.hash,
  sourceSegments:c.nodes-1,
  material:VISNOVA_MAPPED_WALKS_5199.material,
  geometryUnchanged:true,sourceOSMSurfaceTag:null,
  photoVerifiedSurface:false,modelTintEstimated:true,
  newFootways:0,newGeometry:0,newColliders:0,newParking:0};
}
