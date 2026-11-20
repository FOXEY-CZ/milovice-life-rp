/** Milovice RP 5.204 — four original OSM footways around the Višňová
 * multi-storey parking house. Source tags expressly say paving_stones.
 * Colour/pattern are a game estimate, not a photographed material survey.
 * No additional segments, widths, road surfaces or geometry.
 */
export const VISNOVA_TAGGED_PAVERS_5204=Object.freeze({
 region:'mlada',material:'visnova-tagged-paving-stones',
 ways:Object.freeze([
  Object.freeze({id:'1044078124',nodes:9,hash:'63d3e54d',sidewalk:true,lit:true}),
  Object.freeze({id:'1314665579',nodes:18,hash:'476fa89b',sidewalk:true,lit:true}),
  Object.freeze({id:'1044078121',nodes:4,hash:'4dc63734',sidewalk:false,lit:false}),
  Object.freeze({id:'1044078122',nodes:2,hash:'a013d0da',sidewalk:false,lit:true})
 ]),
 photoVerifiedColours:false
});
const sourceHash=geo=>{
 let h=2166136261;
 for(const c of geo.map(p=>p.lat.toFixed(7)+','+p.lon.toFixed(7)).join(';')){
  h^=c.charCodeAt(0);h=Math.imul(h,16777619);
 }
 return(h>>>0).toString(16).padStart(8,'0');
};
export function planVisnovaTaggedPavers5204(regionId,way){
 if(regionId!==VISNOVA_TAGGED_PAVERS_5204.region)return null;
 const source=VISNOVA_TAGGED_PAVERS_5204.ways.find(s=>s.id===String(way?.id));
 if(!source)return null;
 const t=way.tags||{},g=way.geometry;
 if(t.highway!=='footway'||t.surface!=='paving_stones'||
  (t.footway==='sidewalk')!==source.sidewalk||
  (t.lit==='yes')!==source.lit||
  Object.keys(t).some(k=>!['highway','surface','footway','lit'].includes(k))||
  !Array.isArray(g)||g.length!==source.nodes||
  g.some(p=>!Number.isFinite(p?.lat)||!Number.isFinite(p?.lon))||
  sourceHash(g)!==source.hash)return null;
 return {version:'5.204',sourceOSMId:source.id,sourceHash:source.hash,
  sourceSegments:source.nodes-1,sourceTag:'paving_stones',
  material:VISNOVA_TAGGED_PAVERS_5204.material,
  originalWayUnchanged:true,exactPaverTonePhotoVerified:false,
  addedRoads:0,addedFootways:0,addedColliders:0,addedGeometry:0};
}
