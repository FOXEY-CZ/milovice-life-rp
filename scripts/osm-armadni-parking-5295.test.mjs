import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ARMADNI_PARKING_5295 as c,planArmadniParkingGuard5295 as plan,
 inspectArmadniParking5295 as inspect} from './osm-armadni-parking-5295.js';
import {planMiloviceParking} from './parking-layout.js';
import {markedCrossing} from './reality-walkways.js';
const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const ways=JSON.parse(raw).elements,p=plan({regionId:'mlada',ways});
assert(p);assert.equal(p.sourceCrossingIds.length,7);
assert.equal(p.sourceApproachIds.length,13);
assert.equal(p.exactSourceJunctions,21);assert.equal(p.protectedWayIds.length,21);
assert.equal(p.actualParkingSurveyed,false);
for(const k of ['newParking','newCrossings','newZebras','newKerbs','newColliders'])
 assert.equal(p[k],0);
for(const id of p.sourceCrossingIds){
 assert.equal(markedCrossing(ways.find(w=>String(w.id)===id).tags),false);
 const s=p.segments.find(s=>s.id===id);
 assert.equal(inspect(p,{x:(s.a.x+s.b.x)/2,z:(s.a.z+s.b.z)/2,
  type:'roadside',sourceId:'other'}).clear,false);
}
assert.equal(inspect(p,{x:0,z:0,type:'roadside',sourceId:p.narrowRoadId}).reason,'narrow-model-road');
assert(inspect(p,{x:0,z:0,type:'mapped-surface-parking',sourceId:'elsewhere'}).clear);
assert(inspect(p,{x:0,z:0,type:'roadside',sourceId:'elsewhere'}).clear);
assert.equal(plan({regionId:'old',ways}),null);
for(const id of [...p.protectedWayIds,...p.sourceRoadIds,c.narrowRoadId]){
 const changed=ways.map(w=>String(w.id)===id?{...w,geometry:w.geometry.map(
  (q,i)=>i===0?{...q,lat:q.lat+.0000001}:q)}:w);
 assert.equal(plan({regionId:'mlada',ways:changed}),null,'changed source '+id);
}
const coord=q=>({x:(q.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 y:-(q.lat-50.226)*111320});
const roads=ways.filter(w=>[...p.sourceRoadIds,c.narrowRoadId].includes(String(w.id)));
const segments=roads.flatMap(w=>{
 const pts=w.geometry.map(coord);
 return pts.slice(1).map((b,i)=>({a:pts[i],b,len:Math.hypot(b.x-pts[i].x,b.y-pts[i].y),
  kind:'residential',width:String(w.id)===c.narrowRoadId?5:7.8,osmId:w.id}));
});
const center={x:p.segments[0].a.x,z:p.segments[0].a.z};
let unsafe=0,safe=0;
for(let seed=1;seed<=30;seed++){
 const options={center,limit:40,seed};
 const original=planMiloviceParking(segments,[],options);
 unsafe+=original.filter(spot=>!inspect(p,spot).clear).length;
 const corrected=planMiloviceParking(segments,[],{...options,acceptSpot:spot=>inspect(p,spot).clear});
 assert(corrected.every(spot=>inspect(p,spot).clear));safe+=corrected.length;
}
assert(unsafe>0,'baseline must generate conflicting model slots');
assert(safe>0,'guard must not eliminate every safe local slot');
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),raw);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const marker of ['planArmadniParkingGuard5295({regionId,ways:elements,toWorld:osmPoint})',
 'inspectArmadniParking5295(armadniParkingPlan5295,spot)',
 'window.__miloviceArmadniParkingRuntime5295=()=>'])
 assert(html.includes(marker),'missing '+marker);
console.log('PASS 5.295: 7 unmarked crossings, 13 approach footways, 21 exact joins; baseline '+unsafe+' conflicting candidates; '+safe+' guarded candidates across 30 seeds');
