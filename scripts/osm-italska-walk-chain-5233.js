/** Milovice RP 5.233 — the ORIGINAL connected Italská pedestrian chain.
 * Source-locked five OSM footway ways and two source road anchors.
 * Reuse existing 3D strips and shared materials; crossings are mapped
 * UNMARKED and must NEVER be converted into invented painted zebras.
 * Material appearance and exact widths are not photo surveyed.
 */
export const ITALSKA_WALK_CHAIN_5233=Object.freeze({
 region:'mlada',expectedMetres:534.368,originalSegments:14,
 paths:Object.freeze([
  Object.freeze({id:'1484073943',nodes:7,hash:'7d8bc0e5',metres:183.879,
   tags:Object.freeze({footway:'sidewalk',highway:'footway'}),
   material:'visnova-footway-model'}),
  Object.freeze({id:'1484073944',nodes:3,hash:'9c3463dd',metres:9.574,
   tags:Object.freeze({crossing:'unmarked','crossing:markings':'no',
    footway:'crossing',highway:'footway'}),material:null}),
  Object.freeze({id:'1484073945',nodes:2,hash:'bf9fe98e',metres:135.468,
   tags:Object.freeze({footway:'sidewalk',highway:'footway'}),
   material:'visnova-footway-model'}),
  Object.freeze({id:'1484073946',nodes:3,hash:'10cfdc0b',metres:9.203,
   tags:Object.freeze({crossing:'unmarked','crossing:markings':'no',
    footway:'crossing',highway:'footway',lit:'yes',surface:'asphalt'}),
   material:null}),
  Object.freeze({id:'1484073947',nodes:4,hash:'ef34d41f',metres:196.244,
   tags:Object.freeze({footway:'sidewalk',highway:'footway',
    surface:'paving_stones'}),material:'visnova-tagged-paving-stones'})
 ]),
 roads:Object.freeze([
  Object.freeze({id:'295391355',nodes:3,hash:'cef34210',metres:72.307,
   tags:Object.freeze({highway:'residential',name:'Italská'})}),
  Object.freeze({id:'8585601',nodes:14,hash:'b9ac0529',metres:602.354,
   tags:Object.freeze({highway:'residential',lit:'yes',name:'Italská',
    noexit:'yes',surface:'asphalt'})})
 ])
});
const gpsKey=p=>p.lat.toFixed(7)+','+p.lon.toFixed(7);
const same=(a,b)=>a&&b&&gpsKey(a)===gpsKey(b);
const hash=g=>{
 let h=2166136261;
 for(const c of g.map(gpsKey).join(';')){
  h^=c.charCodeAt(0);h=Math.imul(h,16777619);
 }
 return (h>>>0).toString(16).padStart(8,'0');
};
const world=p=>({
 x:p.lon*111320*Math.cos(50.226*Math.PI/180),z:-p.lat*111320
});
const length=g=>g.slice(1).reduce((s,p,i)=>{
 const a=world(g[i]),b=world(p);
 return s+Math.hypot(b.x-a.x,b.z-a.z);
},0);
const validTags=(t,expected)=>t&&
 Object.keys(t).length===Object.keys(expected).length&&
 Object.entries(expected).every(([k,v])=>t[k]===v);
export function planItalskaWalkChain5233(regionId,ways){
 const c=ITALSKA_WALK_CHAIN_5233;
 if(regionId!==c.region||!Array.isArray(ways))return null;
 const source=new Map(),lengths=[];
 for(const spec of [...c.paths,...c.roads]){
  const matches=ways.filter(w=>String(w?.id)===spec.id);
  if(matches.length!==1)return null;
  const w=matches[0],g=w.geometry;
  if(!validTags(w.tags,spec.tags)||!Array.isArray(g)||
   g.length!==spec.nodes||g.some(p=>!Number.isFinite(p?.lat)||
    !Number.isFinite(p?.lon))||hash(g)!==spec.hash)return null;
  const metres=length(g);
  if(!Number.isFinite(metres)||Math.abs(metres-spec.metres)>.12)
   return null;
  source.set(spec.id,w);
  if(c.paths.includes(spec))lengths.push(metres);
 }
 for(let i=1;i<c.paths.length;i++){
  const a=source.get(c.paths[i-1].id).geometry;
  const b=source.get(c.paths[i].id).geometry;
  if(!same(a.at(-1),b[0]))return null;
 }
 const shortRoad=source.get(c.roads[0].id).geometry,
  mainRoad=source.get(c.roads[1].id).geometry,
  crossing=source.get(c.paths[3].id).geometry;
 // This midpoint is an ORIGINAL shared GPS node with Italská 295391355.
 // The same original road endpoint then joins mapped asphalt 8585601.
 if(!same(crossing[1],shortRoad[1])||
  !same(shortRoad.at(-1),mainRoad[7]))return null;
 const total=lengths.reduce((a,b)=>a+b,0);
 if(Math.abs(total-c.expectedMetres)>.16||
  c.paths.reduce((s,p)=>s+p.nodes-1,0)!==c.originalSegments)return null;
 return {
  version:'5.233',sourceWayIds:c.paths.map(p=>p.id),
  sourceRoadIds:c.roads.map(p=>p.id),
  sourceHashes:c.paths.map(p=>p.hash),
  sourceRoadHashes:c.roads.map(p=>p.hash),
  originalNodes:c.paths.map(p=>p.nodes),
  sourceSegments:c.originalSegments,
  originalLengthsMetres:lengths.map(x=>+x.toFixed(3)),
  totalOriginalMetres:+total.toFixed(3),
  originalGPSJoins:4,originalRoadGPSJoins:2,
  neutralFootwayIds:c.paths.filter(x=>x.material==='visnova-footway-model')
   .map(x=>x.id),
  taggedPavedFootwayId:c.paths[4].id,
  unmarkedCrossingIds:[c.paths[1].id,c.paths[3].id],
  asphaltTaggedCrossingId:c.paths[3].id,
  materialByWay:Object.fromEntries(c.paths.filter(x=>x.material)
   .map(x=>[x.id,x.material])),
  sourceSurfaces:Object.fromEntries(c.paths.map(x=>
   [x.id,x.tags.surface??null])),
  originalGPSUnchanged:true,originalRoadTrafficUnchanged:true,
  paverShadeNotPhotographed:true,neutralSurfaceNotPhotographed:true,
  noInventedCrossingPaint:true,
  newFootways:0,newRoads:0,newZebras:0,newCrossings:0,
  newColliders:0,newBuildings:0,newKerbs:0,newParking:0
 };
}
