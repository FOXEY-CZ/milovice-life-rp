// 5.231 verified three existing grass polygons, no invented turf polygons.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {LESNI_COURTYARD_LAWNS_5231 as C,
 planLesniCourtyardLawns5231 as plan} from './osm-lesni-courtyard-lawns-5231.js';
const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const ways=JSON.parse(raw).elements;
const selected=C.polygons.map(c=>ways.filter(w=>String(w.id)===c.id));
assert(selected.every(g=>g.length===1),'three unique OSM grass polygons');
const snapshot=JSON.stringify(selected),toWorld=p=>({
 x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 z:-(p.lat-50.226)*111320
});
const pass={isClear:()=>true};
const opts={regionId:'mlada',toWorld,roads:pass,pedestrians:pass,
 buildings:pass,water:pass};
const p=plan(ways,opts);
assert(p,'all original GPS contours and areas required');
assert.equal(p.version,'5.231');
assert.deepEqual(p.sourceLawnIds,['1460019789','1460019790','1460019792']);
assert.deepEqual(p.sourceHashes,['b977361a','70d93254','e17fd422']);
assert.deepEqual(p.sourceNodes,[7,5,7]);
assert.equal(p.sourceAreaM2,206.33);
assert.deepEqual(p.sourcePolygonAreasM2,[69.50,53.22,83.61]);
assert(p.tufts.length>0&&p.tufts.length<=168,'small original grass patches only');
assert(p.tufts.every(t=>p.sourceLawnIds.includes(t.sourceOSMId) &&
 t.positionEstimated===true));
assert.equal(Object.values(p.byPolygon).reduce((a,b)=>a+b,0),p.tufts.length);
for(const v of ['originalOSMPolygonsUnchanged','actualBladeLocationsUnknown',
 'estimatedBladesOnly','roadsAndFootwaysCleared'])assert.equal(p[v],true);
for(const v of ['newGrassPolygons','newTrees','newShrubs','newFootways',
 'newRoads','newCrossings','newColliders','newBuildings','newGardenFences',
 'newParkingPlaces','newStreetFurniture'])assert.equal(p[v],0);
const drop=plan(ways,{...opts,excludedLawnIds:p.sourceLawnIds});
assert(drop&&drop.tufts.length===0);
assert.deepEqual(drop.skippedPreviouslyDetailed,p.sourceLawnIds);
for(const key of ['roads','pedestrians','buildings','water']){
 const guarded=plan(ways,{...opts,[key]:{isClear:()=>false}});
 assert(guarded&&guarded.tufts.length===0);
 assert(guarded.rejected[key]>0,'blocked source turf on '+key);
}
assert.equal(plan(ways,{...opts,regionId:'old'}),null);
assert.equal(plan(ways,{...opts,pedestrians:null}),null);
assert.equal(plan(ways.filter(w=>String(w.id)!==C.polygons[0].id),opts),null);
assert.equal(plan([...ways,selected[0][0]],opts),null);
for(const c of C.polygons){
 const mutant=fn=>ways.map(w=>String(w.id)===c.id?fn(w):w);
 assert.equal(plan(mutant(w=>({...w,geometry:w.geometry.map((pt,i)=>
 i===1?{...pt,lon:pt.lon+.0000001}:pt)})),opts),null,'GPS fail closed');
 assert.equal(plan(mutant(w=>({...w,tags:{...w.tags,leisure:'garden'}})),opts),
 null,'no invented landuse tags');
 assert.equal(plan(mutant(w=>({...w,geometry:[...w.geometry].reverse()})),opts),
 null,'locked original source node order');
}
assert.equal(JSON.stringify(selected),snapshot);
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),raw);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const t of [
 "from './scripts/osm-lesni-courtyard-lawns-5231.js?v=523100'",
 'const courtyardPlan5231=planLesniCourtyardLawns5231(osmPlaygroundLawnWays,',
 'pedestrians:osmPedestrianClearance',
 'window.__miloviceLesniCourtyardLawnsRuntime5231=()=>',
 'window.__miloviceLesniCourtyardLawnsRuntime5231=null;',
 "'lesni-courtyard-lawns-5231':{",
 'href="?v=523100&streetAudit=lesni-courtyard-lawns-5231"'
])assert(html.includes(t),'missing new real-game integration '+t);
const meta=html.match(/<meta name="milovice-build" content="([^"]+)"/)?.[1];
const js=html.match(/const BUILD_ID='([^']+)'/)?.[1];
const hud=html.split('id="build-label">')[1]?.split('</strong>')[0];
assert(meta&&meta===js&&js===hud,'version labels');
console.log('PASS 5.231 three source-locked grass polygons / 206.33m2; road, footway, building, water guards and no fake green areas');
