// 5.291: actual checked-in OSM source and whole-region clearance regression.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ARMADNI_SIDEWALK_5291 as c,planArmadniSidewalkWidth5291 as plan}
 from './osm-armadni-sidewalk-clearance-5291.js';
import {createRoadClearance} from './road-clearance.js';
import {isCarriageway,safePedestrianPieces} from './reality-walkways.js';
import {planMappedRoadWidth} from './osm-road-width-5108.js';
const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const all=JSON.parse(raw).elements;
const road=all.find(w=>String(w.id)===c.roadId);
const footway=all.find(w=>String(w.id)===c.footwayId);
const saved=JSON.stringify({road,footway});
const p=plan({regionId:'mlada',road,footway,baseWidth:7.8});
assert(p);assert.equal(p.version,'5.291');assert.equal(p.modelWidthMetres,5);
assert(p.originalRoadLengthMetres>40&&p.originalFootwayLengthMetres>94);
assert.equal(p.surveyedWidth,false);
for(const key of ['newFootways','newRoads','newCrossings','newZebras','newParking','newKerbs','newColliders'])assert.equal(p[key],0);
assert.equal(plan({regionId:'old',road,footway,baseWidth:7.8}),null);
for(const regionId of ['vrutice','westlink']){
 const regionWays=JSON.parse(readFileSync(new URL('../data/regions/'+regionId+'.json',import.meta.url),'utf8')).elements;
 const r=regionWays.find(w=>String(w.id)===c.roadId);
 const f=regionWays.find(w=>String(w.id)===c.footwayId);
 assert.deepEqual(r,road);assert.deepEqual(f,footway);
 assert.deepEqual(plan({regionId,road:r,footway:f,baseWidth:7.8}),p);
}
assert.equal(plan({regionId:'mlada',road,footway,baseWidth:5}),null);
assert.equal(plan({regionId:'mlada',road:{...road,id:17},footway,baseWidth:7.8}),null);
assert.equal(plan({regionId:'mlada',road:{...road,tags:{...road.tags,width:'5'}},footway,baseWidth:7.8}),null);
const changed=structuredClone(footway);changed.geometry[2].lon+=.0000001;
assert.equal(plan({regionId:'mlada',road,footway:changed,baseWidth:7.8}),null);
const world=p=>({x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 y:-(p.lat-50.226)*111320});
const carriagewayIndex=override=>{
 const idx=createRoadClearance();
 for(const e of all){
  const kind=e.tags?.highway;if(!isCarriageway(kind))continue;
  const fallback=kind==='primary'?11:kind==='secondary'?9:
   kind==='tertiary'?8:kind==='service'?4.5:kind==='track'?3.2:7.8;
  const mapped=planMappedRoadWidth(e.tags,fallback,'mlada').width;
  idx.addRoad({id:e.id,kind,points:e.geometry.map(world),
   width:String(e.id)===c.roadId?override:mapped});
 }
 return idx;
};
const visible=index=>{
 let metres=0;
 for(let i=1;i<footway.geometry.length;i++){
  const a=world(footway.geometry[i-1]),b=world(footway.geometry[i]);
  for(const part of safePedestrianPieces(a,b,1.8,index)){
   const dx=part.b.x-part.a.x,dz=part.b.z-part.a.z,len=Math.hypot(dx,dz);
   metres+=len;const n=Math.ceil(len/.7);
   for(let j=0;j<n;j++){const t=(j+.5)/n;
    assert(index.isClear(part.a.x+dx*t,part.a.z+dz*t,.9,.08));
   }
  }
 }
 return metres;
};
const before=visible(carriagewayIndex(7.8)),after=visible(carriagewayIndex(5));
assert(before>58&&before<66,'unexpected old safe metres '+before);
assert(after>90&&after<95,'unexpected new safe metres '+after);
assert(after-before>29,'restored only '+(after-before)+' metres');
assert.equal(JSON.stringify({road,footway}),saved);
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),raw);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const s of ["from './scripts/osm-armadni-sidewalk-clearance-5291.js?v=529600'",
 'planArmadniSidewalkWidth5291({',
 'window.__miloviceArmadniSidewalkRuntime5291=()=>'])assert(html.includes(s));
const meta=html.match(/<meta name="milovice-build" content="([^"]+)"/)?.[1];
const js=html.match(/const BUILD_ID='([^']+)'/)?.[1];
const hud=html.split('id="build-label">')[1]?.split('</strong>')[0];
assert(meta&&meta===js&&js===hud);
console.log('PASS 5.291: original OSM sidewalk recovered '+(after-before).toFixed(2)+'m; no invented roads/footways/parking');
