// 5.294: exact OSM east-side continuous footways, no invented geometry.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ARMADNI_EAST_WALKS_5294 as c,
 planArmadniEastWalks5294 as plan,isArmadniEastWay5294 as picked}
 from './osm-armadni-east-walks-5294.js';
import {planArmadniPromenadePaving5293} from './osm-armadni-promenade-5293.js';
import {planArmadniSidewalkWidth5291} from './osm-armadni-sidewalk-clearance-5291.js';
import {createRoadClearance} from './road-clearance.js';
import {isCarriageway,safePedestrianPieces} from './reality-walkways.js';
import {planMappedRoadWidth} from './osm-road-width-5108.js';
const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const ways=JSON.parse(raw).elements;
const sources=c.ways.map(s=>ways.find(w=>String(w.id)===s.id));
const original=JSON.stringify(sources);
const result=plan({regionId:'mlada',ways});
assert(result);
assert.equal(result.version,'5.294');
assert.deepEqual(result.sourceWayIds,['1468803918','1468803919','1468803920']);
assert(result.sourceMetres>185&&result.sourceMetres<188);
assert.equal(result.exactMapJunctions,4);
assert.deepEqual(result.connections.map(c=>[c.from,c.fromNode,c.to,c.toNode]),[
 ['1468803918',0,'1373371686',3],
 ['1468803918',1,'1468803919',1],
 ['1468803919',2,'1468803920',1],
 ['1468803920',3,'1373371686',1]
]);
assert(result.connections.every(x=>x.exactOriginalOSMNode));
assert.equal(result.northPromenadeSourceOSMId,'1373371686');
assert.equal(result.realPavingVerified,false);
assert.equal(result.modelTintNotAsBuilt,true);
for(const k of ['newFootways','newRoads','newCrossings','newZebras',
 'newKerbs','newParking','newColliders','newMeshObjects'])
 assert.equal(result[k],0,k);
assert(planArmadniPromenadePaving5293({regionId:'mlada',ways}));
assert(sources.every(w=>picked(result,w)));
assert(!picked(result,{...sources[0],tags:{highway:'footway',surface:'asphalt'}}));
assert.equal(plan({regionId:'vrutice',ways}),null);
for(const s of [...c.ways,c.north]){
 const changed=ways.map(w=>String(w.id)===s.id?{...w,geometry:w.geometry.map(
  (p,i)=>i===0?{...p,lon:p.lon+0.0000001}:p)}:w);
 assert.equal(plan({regionId:'mlada',ways:changed}),null,'changed '+s.id);
}
for(const join of c.joins){
 const src=ways.find(w=>String(w.id)===join.to);
 const changed=ways.map(w=>String(w.id)===join.to?{...w,
  geometry:src.geometry.map((p,i)=>i===join.toNode?{...p,lat:p.lat+0.0000001}:p)}:w);
 assert.equal(plan({regionId:'mlada',ways:changed}),null,'broken shared node '+join.to);
}
// All three original ways stay subject to complete OSM carriageway clearance.
const toWorld=p=>({x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 y:-(p.lat-50.226)*111320});
const road=ways.find(w=>String(w.id)==='1373371687');
const foot=ways.find(w=>String(w.id)==='1468803914');
const correction=planArmadniSidewalkWidth5291({
 regionId:'mlada',road,footway:foot,baseWidth:7.8
});
assert(correction);
const index=createRoadClearance();
for(const w of ways){
 const type=w.tags?.highway;
 if(!isCarriageway(type))continue;
 const base=type==='primary'?11:type==='secondary'?9:
  type==='tertiary'?8:type==='service'?4.5:type==='track'?3.2:7.8;
 const width=planMappedRoadWidth(w.tags,base,'mlada').width;
 index.addRoad({id:w.id,kind:type,points:w.geometry.map(toWorld),
  width:String(w.id)===correction.sourceRoadOSMId?correction.modelWidthMetres:width});
}
let safe=0,pieces=0;
for(const w of sources){
 const points=w.geometry.map(toWorld);
 for(let i=1;i<points.length;i++)
  for(const piece of safePedestrianPieces(points[i-1],points[i],1.8,index)){
   const dx=piece.b.x-piece.a.x,dz=piece.b.z-piece.a.z;
   const len=Math.hypot(dx,dz);
   safe+=len;pieces++;
   for(let k=0,n=Math.ceil(len/.7);k<n;k++){
    const t=(k+.5)/n;
    assert(index.isClear(piece.a.x+dx*t,piece.a.z+dz*t,.9,.08));
   }
  }
}
assert(pieces>0&&safe>25,'original east Armádní footway should be road-safe');
assert.equal(JSON.stringify(sources),original);
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),raw);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const marker of [
 "from './scripts/osm-armadni-east-walks-5294.js?v=529400'",
 'const armadniEastPlan5294=planArmadniEastWalks5294({',
 'isArmadniEastWay5294(armadniEastPlan5294,el)',
 'window.__miloviceArmadniEastRuntime5294=()=>',
 'armadniEastAudit5294.paintedSafePieces+='
])assert(html.includes(marker),'missing 5.294 integration '+marker);
const meta=html.match(/<meta name="milovice-build" content="([^"]+)"/)?.[1];
const js=html.match(/const BUILD_ID='([^']+)'/)?.[1];
const hud=html.split('id="build-label">')[1]?.split('</strong>')[0];
assert(meta&&meta===js&&js===hud);
assert.match(html,/Verze 5\.\d+ · build/);
console.log('PASS 5.294: three unchanged east C15/C16 footways / '+result.sourceMetres+
 'm, four exact source joins, '+safe.toFixed(1)+'m road-clearance-safe surface');
