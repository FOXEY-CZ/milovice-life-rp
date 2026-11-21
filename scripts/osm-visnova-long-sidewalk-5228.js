/** Milovice RP 5.228: source-locked original long Visnova sidewalk.
 * Recolors only the 10 original OSM strips of surface-untagged 1044078118.
 * Two exact GPS nodes intersect existing source-tagged paved footways.
 * The actual surface, colour and paving pattern are NOT photo verified.
 * Zero new connections, crossings, collision shapes or sidewalks.
 */
export const VISNOVA_LONG_SIDEWALK_5228=Object.freeze({
 region:'mlada',material:'visnova-footway-model',
 main:Object.freeze({id:'1044078118',nodes:11,hash:'26506719',
  meters:199.405,segments:10,tags:Object.freeze({
   highway:'footway',footway:'sidewalk',lit:'yes'})}),
 westPaved:Object.freeze({id:'1005977571',nodes:7,hash:'263e12b3',
  meters:301.172,segments:6,tags:Object.freeze({
   highway:'footway',footway:'sidewalk',lit:'yes',surface:'paving_stones'})}),
 eastPaved:Object.freeze({id:'1044078121',nodes:4,hash:'4dc63734',
  meters:32.073,segments:3,tags:Object.freeze({
   highway:'footway',surface:'paving_stones'})}),
 joinAtMainNode:4,originalNetworkSegments:19,
 modelOriginalNetworkMeters:532.650,photoVerifiedSurface:false
});
const coord=p=>p.lat.toFixed(7)+','+p.lon.toFixed(7);
const sourceHash=g=>{
 let h=2166136261;
 for(const c of g.map(coord).join(';')){
  h^=c.charCodeAt(0);h=Math.imul(h,16777619);
 }
 return(h>>>0).toString(16).padStart(8,'0');
};
const sourceLength=g=>{
 let s=0;
 for(let i=1;i<g.length;i++){
  const a=g[i-1],b=g[i];
  const d=Math.hypot(
   (b.lon-a.lon)*111320*Math.cos(50.226*Math.PI/180),
   (b.lat-a.lat)*111320
  );
  if(!(d>.3&&d<250))return NaN;
  s+=d;
 }
 return s;
};
const exactTags=(tags,reference)=>Boolean(tags)&&
 Object.keys(tags).length===Object.keys(reference).length&&
 Object.entries(reference).every(([k,v])=>tags[k]===v);
export function planVisnovaLongSidewalk5228(regionId,ways){
 const c=VISNOVA_LONG_SIDEWALK_5228;
 if(regionId!==c.region||!Array.isArray(ways))return null;
 const specs=[c.main,c.westPaved,c.eastPaved],geo=[];
 for(const spec of specs){
  const found=ways.filter(w=>String(w?.id)===spec.id);
  if(found.length!==1)return null;
  const w=found[0],g=w.geometry;
  if(!Array.isArray(g)||g.length!==spec.nodes||
   g.some(p=>!Number.isFinite(p?.lat)||!Number.isFinite(p?.lon))||
   sourceHash(g)!==spec.hash||
   Math.abs(sourceLength(g)-spec.meters)>.12||
   !exactTags(w.tags,spec.tags))return null;
  geo.push(g);
 }
 const [main,west,east]=geo;
 if(coord(main[0])!==coord(west.at(-1))||
  coord(main[c.joinAtMainNode])!==coord(east.at(-1)))return null;
 return {
  version:'5.228',sourceWayIds:specs.map(s=>s.id),
  sourceHashes:specs.map(s=>s.hash),neutralWayId:c.main.id,
  neutralOriginalSegments:c.main.segments,
  neutralOriginalMeters:c.main.meters,
  neutralMaterial:c.material,
  originalNetworkSegments:c.originalNetworkSegments,
  originalNetworkMeters:c.modelOriginalNetworkMeters,
  pavedSourceWayIds:[c.westPaved.id,c.eastPaved.id],
  pavedSourceSurface:'paving_stones',
  westernExistingJunctionGPS:coord(main[0]),
  easternExistingJunctionGPS:coord(main[c.joinAtMainNode]),
  easternMainNodeIndex:c.joinAtMainNode,
  originalCentrelinePreserved:true,
  actualNeutralSurfaceUnknown:true,
  pavingVisualEstimateOnly:true,
  newFootways:0,newCrossings:0,newRoads:0,
  newZebras:0,newBuildings:0,newColliders:0,
  newKerbs:0,newEntrances:0,newStreetFurniture:0
 };
}
