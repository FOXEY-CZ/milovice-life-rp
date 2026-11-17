// Milovice RP 5.96: source-only visible waterways and region clipping.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRoadClearance} from './road-clearance.js';
import {makeSidewalkBuildingGuard} from './osm-tagged-sidewalk.js';
import {classifyVisibleWaterway,clipMappedWaterSegment,planMappedWaterway}
 from './osm-waterways.js';

const noRoad=createRoadClearance(),noBuildings=makeSidewalkBuildingGuard();
const river=[{x:-50,z:0},{x:50,z:0}];
const create=(tags,roads=noRoad,buildings=noBuildings,points=river,bounds=null)=>
 planMappedWaterway({tags,roads,buildings,points,bounds});
for(const [tags,reason] of [
 [{waterway:'stream',tunnel:'culvert'},'culvert'],
 [{waterway:'stream',layer:'-1'},'underground layer'],
 [{waterway:'drain',covered:'yes'},'covered drain'],
 [{waterway:'stream',intermittent:'yes'},'intermittent flow'],
 [{waterway:'stream',location:'underground'},'underground location'],
 [{waterway:'canal'},'unsupported kind'],
 [{waterway:'stream',access:'private'},'private access']
])assert.equal(create(tags).pieces.length,0,'Do not show '+reason);
assert.equal(classifyVisibleWaterway({waterway:'stream'}).widthEstimated,true);
assert.equal(classifyVisibleWaterway({waterway:'stream',width:'2.4 m'}).width,2.4);
assert.equal(classifyVisibleWaterway({waterway:'stream',width:'100'}).width,1.6);
assert(create({waterway:'stream'}).meters>95,'Mapped stream must render');
const bounds={minX:-12,maxX:12,minZ:-10,maxZ:10};
const clipped=clipMappedWaterSegment({x:-600,z:0},{x:600,z:0},bounds);
assert(Math.abs(clipped[0].x+192)<.01&&Math.abs(clipped[1].x-192)<.01,
 '9 km mapped ways must clip to streamed area plus 180m margin');
assert.equal(clipMappedWaterSegment({x:800,z:900},{x:850,z:900},bounds),null);
const partial=create({waterway:'stream'},noRoad,noBuildings,
 [{x:-600,z:0},{x:600,z:0}],bounds);
assert(partial.meters>370&&partial.meters<390);
const roads=createRoadClearance();
roads.addRoad({id:42,kind:'residential',width:8,
 points:[{x:0,y:-30},{x:0,y:30}]});
const throughRoad=create({waterway:'stream'},roads);
assert(throughRoad.pieces.length>=2,'Road crossing interrupts the stream strip');
for(const p of throughRoad.pieces){
 const x=(p.a.x+p.b.x)/2,z=(p.a.z+p.b.z)/2;
 assert(roads.isClear(x,z,p.width*.5,.13),'No water mesh on a road');
}
const buildings=makeSidewalkBuildingGuard();
assert(buildings.add(7,[{x:20,z:-5},{x:29,z:-5},{x:29,z:5},{x:20,z:5}]));
const byHouse=create({waterway:'stream'},noRoad,buildings);
assert(byHouse.meters<create({waterway:'stream'}).meters-8,
 'Mapped home footprint must interrupt the channel');
let visible=0,hidden=0;
const encountered=new Map();
for(const region of ['mlada','vrutice']){
 const map=JSON.parse(readFileSync(new URL('../data/regions/'+region+'.json',
  import.meta.url),'utf8'));
 const box=map.bbox;
 const cos=Math.cos(50.226*Math.PI/180);
 const project=p=>({x:(p.lon-14.889)*111320*cos,
  z:-(p.lat-50.226)*111320});
 const b1=project({lon:box[0],lat:box[1]}),
  b2=project({lon:box[2],lat:box[3]});
 const worldBounds={minX:Math.min(b1.x,b2.x),maxX:Math.max(b1.x,b2.x),
  minZ:Math.min(b1.z,b2.z),maxZ:Math.max(b1.z,b2.z)};
 const routeGuard=createRoadClearance(),houseGuard=makeSidewalkBuildingGuard();
 for(const el of map.elements.filter(e=>e.geometry?.length)){
  if(el.tags?.building&&el.tags.building!=='roof'&&el.geometry.length>=3)
   houseGuard.add(el.id,el.geometry.map(project));
  const kind=el.tags?.highway;
  if(kind){
   const width=kind==='secondary'?9:kind==='tertiary'?8:
    kind==='footway'?1.8:kind==='path'||kind==='steps'?1.65:
    kind==='cycleway'?2:kind==='service'?4.5:kind==='track'?3.2:7.8;
   routeGuard.addRoad({id:el.id,points:el.geometry.map(project),width,kind});
  }
 }
 for(const el of map.elements.filter(e=>e.tags?.waterway)){
  if(encountered.has(String(el.id)))continue;
  const source=classifyVisibleWaterway(el.tags);
  encountered.set(String(el.id),!!source);
  if(!source){hidden++;continue}
  visible++;
  const plan=planMappedWaterway({tags:el.tags,
   points:el.geometry.map(project),roads:routeGuard,buildings:houseGuard,
   bounds:worldBounds});
  assert(plan.meters>=0&&plan.meters<7500,
   'No entire remote 9km region waterways drawn');
  for(const piece of plan.pieces){
   const x=(piece.a.x+piece.b.x)/2,z=(piece.a.z+piece.b.z)/2;
   assert(x>=worldBounds.minX-181&&x<=worldBounds.maxX+181);
   assert(z>=worldBounds.minZ-181&&z<=worldBounds.maxZ+181);
   assert(routeGuard.isClear(x,z,piece.width*.5,.13),
    'Water must not cover a mapped road or path');
   assert(houseGuard.isClear(x,z,piece.width*.5+.2),
    'Water must not cover an OSM building');
  }
 }
}
assert.equal(encountered.size,11);
assert.equal(visible,7);
assert.equal(hidden,4);
assert(encountered.get('82222748')&&encountered.get('1547734545'),
 'Mlynařice and Svodnice must remain mapped sources');
const game=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const snippet of [
 "import {classifyVisibleWaterway,planMappedWaterway} from './scripts/osm-waterways.js?v=59600'",
 'else if(el.tags?.waterway)waterwayWays.push(el);',
 'const water=planMappedWaterway({',
 'for(const el of waterwayWays){',
 'osmStrip(new THREE.Vector2(piece.a.x,piece.a.z),',
 'window.__miloviceMappedWaterways',
 'mappedWaterAudit.renderedMeters=0;',
 "streetAudit=water-mlynarice-596",
 "streetAudit=water-svodnice-596"
])assert(game.includes(snippet),'Missing source waterway game integration: '+snippet);
const build=game.match(/const BUILD_ID='([^']+)'/)?.[1];
const meta=game.match(/<meta name="milovice-build" content="([^"]+)"/)?.[1];
const hud=game.split('id="build-label">')[1]?.split('</strong>')[0];
assert(build&&build===meta&&meta===hud,
 'Web metadata and HUD must have the same current version');
console.log('PASS Milovice 5.96 mapped visible waterways', {visible,hidden});
