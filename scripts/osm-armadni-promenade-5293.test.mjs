// 5.293 source topo and full-region road-clipping regression.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ARMADNI_PROMENADE_5293 as c,
 planArmadniPromenadePaving5293 as plan,
 isArmadniPromenadeWay5293 as selected} from './osm-armadni-promenade-5293.js';
import {planArmadniProjectPaving5292} from './osm-armadni-project-paving-5292.js';
import {planArmadniSidewalkWidth5291} from './osm-armadni-sidewalk-clearance-5291.js';
import {createRoadClearance} from './road-clearance.js';
import {isCarriageway,safePedestrianPieces} from './reality-walkways.js';
import {planMappedRoadWidth} from './osm-road-width-5108.js';
const originalData=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const ways=JSON.parse(originalData).elements;
const source=ways.find(w=>String(w.id)===c.sourceOSMId);
const untouched=JSON.stringify(source),p=plan({regionId:'mlada',ways});
assert(p);assert.equal(p.version,'5.293');
assert(p.sourceMetres>109&&p.sourceMetres<111);
assert.equal(p.sourceHash,'7134a638');
assert.deepEqual(p.joins.map(x=>[x.linkedOSMWayId,x.promenadeNodeIndex,x.linkNodeIndex]),[
 ['1468803921',6,3],['1468803914',5,0],['1468803920',1,3]
]);
assert.equal(p.sameSharedPavingMaterialAs5292,true);
assert.equal(p.actualMaterialSurveyed,false);
for(const f of ['newFootways','newRoads','newCrossings','newZebras',
 'newKerbs','newParking','newColliders','newMeshObjects'])assert.equal(p[f],0,f);
assert(selected(p,source));
assert(!selected(p,{...source,tags:{...source.tags,surface:'asphalt'}}));
assert.equal(plan({regionId:'old',ways}),null);
for(const regionId of ['vrutice','westlink']){
 const regionWays=JSON.parse(readFileSync(new URL('../data/regions/'+regionId+'.json',import.meta.url),'utf8')).elements;
 const alt=plan({regionId,ways:regionWays});
 assert(alt,'original source plan missing for '+regionId);
 assert.deepEqual(alt,{...p,regionId});
}
assert.equal(plan({regionId:'mlada',ways:ways.filter(w=>String(w.id)!==c.sourceOSMId)}),null);
for(const id of [c.sourceOSMId,...c.links.map(x=>x.id)]){
 const corrupt=ways.map(w=>String(w.id)===id?{...w,
  geometry:w.geometry.map((x,i)=>i===0?{...x,lon:x.lon+.0000001}:x)}:w);
 assert.equal(plan({regionId:'mlada',ways:corrupt}),null,'source changed '+id);
}
for(const link of c.links){
 const bad=ways.map(w=>String(w.id)===link.id?{...w,
  tags:{highway:'footway',access:'private'}}:w);
 assert.equal(plan({regionId:'mlada',ways:bad}),null,'tag changed '+link.id);
}
// Original 5.292 source group remains exactly 5 and identical.
const previous=planArmadniProjectPaving5292({regionId:'mlada',ways});
assert(previous);assert.equal(previous.routes.length,5);
assert(!previous.originalWayIds.includes(c.sourceOSMId));
assert.equal(previous.material,p.material);
const toWorld=p=>({x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 y:-(p.lat-50.226)*111320});
const road=ways.find(w=>String(w.id)==='1373371687');
const foot=ways.find(w=>String(w.id)==='1468803914');
const fixed=planArmadniSidewalkWidth5291({regionId:'mlada',road,footway:foot,baseWidth:7.8});
assert(fixed);
const idx=createRoadClearance();
for(const w of ways){
 const kind=w.tags?.highway;
 if(!isCarriageway(kind))continue;
 const base=kind==='primary'?11:kind==='secondary'?9:
  kind==='tertiary'?8:kind==='service'?4.5:kind==='track'?3.2:7.8;
 const width=planMappedRoadWidth(w.tags,base,'mlada').width;
 idx.addRoad({id:w.id,kind,width:String(w.id)===fixed.sourceRoadOSMId?
  fixed.modelWidthMetres:width,points:w.geometry.map(toWorld)});
}
let safe=0,pieces=0;
const points=source.geometry.map(toWorld);
for(let i=1;i<points.length;i++)
 for(const piece of safePedestrianPieces(points[i-1],points[i],1.8,idx)){
  const dx=piece.b.x-piece.a.x,dz=piece.b.z-piece.a.z,len=Math.hypot(dx,dz);
  safe+=len;pieces++;
  const n=Math.ceil(len/.7);
  for(let j=0;j<n;j++){const t=(j+.5)/n;
   assert(idx.isClear(piece.a.x+t*dx,piece.a.z+t*dz,.9,.08));
  }
 }
assert(pieces>0&&safe>20,'original promenade has no safe visible sidewalk');
assert.equal(JSON.stringify(source),untouched);
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),originalData);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const x of [
 "from './scripts/osm-armadni-promenade-5293.js?v=529600'",
 "const armadniPromenadePlan5293=planArmadniPromenadePaving5293({",
 "isArmadniPromenadeWay5293(",
 "material:ARMADNI_PROMENADE_5293.material",
 "window.__miloviceArmadniPromenadeRuntime5293=()=>"
])assert(html.includes(x),'missing 5.293 runtime integration '+x);
assert.match(html,/isArmadniPromenadeWay5293\(\s*armadniPromenadePlan5293,el\)/,
 'original OSM promenade matcher must be called with 5.293 plan and actual way');
const meta=html.match(/<meta name="milovice-build" content="([^"]+)"/)?.[1];
const js=html.match(/const BUILD_ID='([^']+)'/)?.[1];
const hud=html.split('id="build-label">')[1]?.split('</strong>')[0];
assert(meta&&meta===js&&js===hud);
console.log('PASS 5.293: original 110m OSM walkway joined to 3 real sidewalk nodes, '+safe.toFixed(1)+'m road-safe visible pieces, shared 5.292 material');
