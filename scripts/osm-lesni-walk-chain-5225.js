/** Milovice RP 5.225 — ORIGINAL, continuously mapped Lesní/Armádní
 * pedestrian chain. Two source sidewalk geometries without surface tags
 * use a neutral ESTIMATED game material. A mapped crossing is explicitly
 * unmarked: we DO NOT draw a zebra, alter the crossing or make a route.
 * The fourth OSM way retains its explicit paving_stones material (5.220).
 */
export const LESNI_WALK_CHAIN_5225=Object.freeze({
 region:'mlada',
 neutralMaterial:'visnova-footway-model',
 existingPavedMaterial:'visnova-tagged-paving-stones',
 walks:Object.freeze([
  Object.freeze({id:'1460019797',nodes:4,hash:'820c13b1',meters:78.524,segments:3}),
  Object.freeze({id:'1460019795',nodes:2,hash:'3432210d',meters:7.437,segments:1})
 ]),
 crossing:Object.freeze({
  id:'1460019796',nodes:3,hash:'b29a84ad',meters:9.063,
  segments:2,tag:'unmarked',markings:'no'
 }),
 paved:Object.freeze({
  id:'1057549994',nodes:6,hash:'02767378',meters:70.465,
  segments:5,surface:'paving_stones',lit:'yes'
 }),
 junctions:Object.freeze([
  '50.2292780,14.8701521',
  '50.2293448,14.8701535',
  '50.2294249,14.8701763'
 ]),
 photoVerifiedUnmarkedWalkwaySurface:false
});
const canonical=p=>p.lat.toFixed(7)+','+p.lon.toFixed(7);
const hash=g=>{
 let h=2166136261;
 for(const c of g.map(canonical).join(';')){
  h^=c.charCodeAt(0);h=Math.imul(h,16777619);
 }
 return(h>>>0).toString(16).padStart(8,'0');
};
const xy=p=>({x:p.lon*111320*Math.cos(50.226*Math.PI/180),
 z:-p.lat*111320});
const length=g=>{
 const pts=g.map(xy);let n=0;
 for(let i=1;i<pts.length;i++){
  const d=Math.hypot(pts[i].x-pts[i-1].x,
   pts[i].z-pts[i-1].z);
  if(!(d>.25&&d<200))return NaN;
  n+=d;
 }
 return n;
};
const ownKeys=(tags,keys)=>Object.keys(tags||{}).length===keys.length&&
 keys.every(k=>Object.hasOwn(tags,k));
export function planLesniWalkChain5225({regionId,ways}={}){
 const c=LESNI_WALK_CHAIN_5225;
 if(regionId!==c.region||!Array.isArray(ways))return null;
 const specs=[...c.walks,c.crossing,c.paved],selected=[];
 for(const spec of specs){
  const matched=ways.filter(w=>String(w?.id)===spec.id);
  if(matched.length!==1)return null;
  const w=matched[0],t=w.tags||{},g=w.geometry;
  if(!Array.isArray(g)||g.length!==spec.nodes||
   g.some(p=>!Number.isFinite(p?.lat)||!Number.isFinite(p?.lon))||
   hash(g)!==spec.hash||
   Math.abs(length(g)-spec.meters)>.12)return null;
  if(c.walks.includes(spec)){
   if(!ownKeys(t,['highway','footway'])||
    t.highway!=='footway'||t.footway!=='sidewalk')return null;
  }else if(spec===c.crossing){
   if(!ownKeys(t,['crossing','crossing:markings','footway','highway'])||
    t.crossing!==c.crossing.tag||
    t['crossing:markings']!==c.crossing.markings||
    t.footway!=='crossing'||t.highway!=='footway')return null;
  }else{
   if(!ownKeys(t,['footway','highway','lit','surface'])||
    t.highway!=='footway'||t.footway!=='sidewalk'||
    t.lit!==c.paved.lit||t.surface!==c.paved.surface)return null;
  }
  selected.push(w);
 }
 const [long,short,cross,paved]=selected.map(w=>w.geometry);
 const q=c.junctions;
 // Geometry validation for all 3 SOURCE-GRAPH junctions, not
 // guesses about proximity. Longway connected to a crossing via its
 // START, crossing connects to short sidewalk, then tagged pavers.
 if(canonical(long[0])!==q[2]||
  canonical(cross[0])!==q[2]||
  canonical(cross.at(-1))!==q[1]||
  canonical(short[0])!==q[1]||
  canonical(short.at(-1))!==q[0]||
  canonical(paved.at(-1))!==q[0])return null;
 const originalMeters=specs.reduce((n,s)=>n+s.meters,0);
 const originalSegments=specs.reduce((n,s)=>n+s.segments,0);
 if(originalSegments!==11||Math.abs(originalMeters-165.489)>.01)
  return null;
 return {
  version:'5.225',
  sourceWayIds:specs.map(s=>s.id),
  sourceHashes:specs.map(s=>s.hash),
  sourceSegments:originalSegments,originalMeters:+originalMeters.toFixed(3),
  neutralFootwayIds:c.walks.map(s=>s.id),
  neutralOriginalSegments:4,neutralOriginalMeters:85.961,
  neutralSurfaceIsUntagged:true,neutralSurfaceIsModelOnly:true,
  neutralMaterial:c.neutralMaterial,
  pavedSourceWayId:c.paved.id,
  pavedOriginalSegments:c.paved.segments,
  pavedSourceTag:c.paved.surface,pavedMaterial:c.existingPavedMaterial,
  crossingWayId:c.crossing.id,crossingOriginalSegments:2,
  crossingSourceTag:c.crossing.tag,crossingMarkingsTag:c.crossing.markings,
  junctionGPS:[...q],originalOSMConnectionsExist:true,
  sourcePedestrianGeometryUnchanged:true,
  originalCrossingUnchanged:true,originalRoadWidthsUnchanged:true,
  inventedZebraStripes:0,newFootways:0,newCrossings:0,newRoads:0,
  newKerbs:0,newColliders:0,newStreetLights:0,newTrees:0,newBuildings:0
 };
}
