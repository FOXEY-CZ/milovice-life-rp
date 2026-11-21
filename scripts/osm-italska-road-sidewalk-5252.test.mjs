// Milovice RP 5.252: recover source-mapped Italská sidewalk beside a
// too-wide unmapped-width residential road. Test physical road clipping.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ITALSKA_ROAD_SIDEWALK_5252 as source,
 planItalskaRoadSidewalk5252 as plan}
 from './osm-italska-road-sidewalk-5252.js';
import {createRoadClearance} from './road-clearance.js';
import {isCarriageway,safePedestrianPieces}
 from './reality-walkways.js';
import {planMappedRoadWidth} from './osm-road-width-5108.js';
const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const E=JSON.parse(raw).elements;
const road=E.find(e=>String(e.id)===source.roadId);
const walk=E.find(e=>String(e.id)===source.sidewalkId);
assert(road&&walk);
const saved=JSON.stringify({road,walk});
const p=plan({regionId:'mlada',road,sidewalk:walk,defaultWidth:7.8});
assert(p);
assert.equal(p.version,'5.252');
assert.equal(p.roadGeometryHash,'233aae3b');
assert.equal(p.sidewalkGeometryHash,'7d8bc0e5');
assert.equal(p.modelWidthMetres,5.0);
assert.equal(p.priorModelRoadWidthMetres,7.8);
assert.equal(p.originalRoadGPSVertices,9);
assert.equal(p.originalFootwayGPSVertices,7);
assert.equal(p.sourceFirstSidewalkMetres,51.968);
assert.equal(p.photoMeasuredRoadWidth,false);
assert.equal(p.modelWidthInferredFromMappedFootway,true);
assert.deepEqual(p.unmarkedCrossingWayIds,['1484073944','1484073946']);
for(const k of ['newFootways','newCrossings','newZebras','newBuildings',
 'newEntrances','newParking','newColliders'])assert.equal(p[k],0);
const tampered=structuredClone(walk);
tampered.geometry[0].lon+=.0000001;
assert.equal(plan({regionId:'mlada',road,sidewalk:tampered,defaultWidth:7.8}),null);
const wrongRoad={...road,tags:{...road.tags,width:'5'}};
assert.equal(plan({regionId:'mlada',road:wrongRoad,sidewalk:walk,defaultWidth:7.8}),null);
assert.equal(plan({regionId:'mlada',road,sidewalk:walk,defaultWidth:7.1}),null);
assert.equal(plan({regionId:'vrutice',road,sidewalk:walk,defaultWidth:7.8}),null);
const world=g=>({x:(g.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 y:-(g.lat-50.226)*111320});
const caravan=override=>{
 const c=createRoadClearance();
 for(const e of E){
  if(!isCarriageway(e.tags?.highway))continue;
  const kind=e.tags.highway;
  const fallback=kind==='primary'?11:kind==='secondary'?9:
   kind==='tertiary'?8:kind==='service'?4.5:
   kind==='track'?3.2:7.8;
  const width=planMappedRoadWidth(e.tags,fallback,'mlada').width;
  c.addRoad({id:e.id,kind,points:e.geometry.map(world),
   width:String(e.id)===source.roadId?override:width});
 }
 return c;
};
const a=world(walk.geometry[0]),b=world(walk.geometry[1]);
const old=safePedestrianPieces(a,b,1.8,caravan(7.8));
assert.equal(old.length,0,'over-wide model must hide this source pavement');
const index=caravan(p.modelWidthMetres);
const restored=safePedestrianPieces(a,b,1.8,index);
const visible=restored.reduce((n,piece)=>
 n+Math.hypot(piece.b.x-piece.a.x,piece.b.z-piece.a.z),0);
assert.equal(restored.length,1);
assert(visible>29&&visible<31,'model clear span '+visible);
assert(visible<p.sourceFirstSidewalkMetres-20,
 'keep unsafe original footway interval clipped');
for(const section of restored){
 const dx=section.b.x-section.a.x,dz=section.b.z-section.a.z;
 const n=Math.ceil(Math.hypot(dx,dz)/.7);
 for(let i=0;i<n;i++){
  const t=(i+.5)/n;
  assert(index.isClear(section.a.x+dx*t,section.a.z+dz*t,.9,.08),
   'restored sidewalk must stay outside the actual rendered model carriageway');
 }
}
assert.equal(JSON.stringify({road,walk}),saved,'never mutate original GIS source');
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),raw);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const term of [
 "from './scripts/osm-italska-road-sidewalk-5252.js?v=525200'",
 'planItalskaRoadSidewalk5252({',
 'window.__miloviceItalskaRoadFootwayRuntime5252=()=>',
 "'italska-road-footway-5252':{",
 'Verze 5.253'
])assert(html.includes(term),'missing 5.252 integration '+term);
const meta=html.match(/<meta name="milovice-build" content="([^"]+)"/)?.[1];
const js=html.match(/const BUILD_ID='([^']+)'/)?.[1];
const hud=html.split('id="build-label">')[1]?.split('</strong>')[0];
assert(meta&&meta===js&&js===hud);
console.log('PASS 5.252: 51.968m original sidewalk; 7.8m road rendered 0m, modelled 5.0m road reveals '+visible.toFixed(2)+'m with full road-clearance, original crossings unchanged');
