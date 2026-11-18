// Milovice RP 5.152: real V7a zebra bars transverse to pedestrian travel.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRoadClearance} from './road-clearance.js';
import {markedCrossing,planZebraPieces} from './reality-walkways.js';

const data=JSON.parse(readFileSync(
 new URL('../data/regions/mlada.json',import.meta.url),'utf8')).elements;
const way=id=>data.find(e=>String(e.id)===String(id));
const crossing=way(1316882853),roadWay=way(8618275);
assert(crossing&&roadWay);
assert.equal(crossing.tags.highway,'footway');
assert.equal(crossing.tags.footway,'crossing');
assert.equal(crossing.tags.crossing,'zebra');
assert.equal(roadWay.tags.name,'Topolová');
const legacy=data.filter(w=>w.tags?.footway==='crossing'&&
 w.tags.crossing==='zebra');
assert.equal(legacy.length,5);
assert(legacy.every(w=>markedCrossing(w.tags)));
assert.equal(markedCrossing({footway:'crossing',
 crossing:'zebra','crossing:markings':'no'}),false);
const original=JSON.stringify([crossing,roadWay]);
const toWorld=p=>({
 x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 z:-(p.lat-50.226)*111320
});
const roads=createRoadClearance();
roads.addRoad({id:roadWay.id,kind:'residential',width:7.8,
 points:roadWay.geometry.map(toWorld)});
const world=crossing.geometry.map(toWorld);
const a=world[0],b=world.at(-1);
const pedestrian={x:b.x-a.x,z:b.z-a.z};
const pedestrianLength=Math.hypot(pedestrian.x,pedestrian.z);
assert(pedestrianLength>8&&pedestrianLength<9);
const bars=planZebraPieces(world,roads);
assert(bars.length>=6&&bars.length<=12,
 'Legacy mapped zebra should show 6–12 transverse V7a bars');
const dot=(x,y)=>x.x*y.x+x.z*y.z;
for(const bar of bars){
 assert.equal(bar.width,.50,'V7a white stripe model has 0.5m thickness');
 const line={x:bar.b.x-bar.a.x,z:bar.b.z-bar.a.z};
 const span=Math.hypot(line.x,line.z);
 assert(span>.7&&span<=3.401,'Crossing-width axis, not 8m long rails');
 const cosine=Math.abs(dot(line,pedestrian)/(span*pedestrianLength));
 assert(cosine<.00001,
  'Paint stripe must lie perpendicular to pedestrian traversal, parallel road');
 for(const fraction of [0,.2,.4,.6,.8,1]){
  const px=bar.a.x+line.x*fraction,pz=bar.a.z+line.z*fraction;
  const near=roads.nearest(px,pz);
  assert(near&&near.clearance<-.01,'Every bar must stay on mapped asphalt');
 }
}
assert.equal(JSON.stringify([crossing,roadWay]),original,
 'Original 3 GPS footway nodes and road geometry cannot move');
// Synthetic test in both orientations: vehicle along X, pedestrian along Z.
const straight=createRoadClearance();
straight.addRoad({id:'road',kind:'residential',width:8,
 points:[{x:-30,z:0},{x:30,z:0}]});
const synthetic=planZebraPieces([{x:0,z:-9},{x:0,z:9}],straight);
assert(synthetic.length>=6&&synthetic.length<=10);
for(const line of synthetic){
 assert(Math.abs(line.a.z-line.b.z)<.00001,
  'Driving direction X, so each bar must run horizontally along X');
 assert(Math.abs(line.b.x-line.a.x)>.8);
}
assert.equal(planZebraPieces([{x:0,z:-9},{x:0,z:9}],
 createRoadClearance()).length,0,'No invented zebra without actual road');
assert.deepEqual(planZebraPieces([{x:0,z:-9},{x:0,z:9}],
 straight,{width:8}),[],'Unsafe fabricated crosswalk width rejected');
// Model safety on a divided road: only original two driving surfaces,
// never across their unpaved central island.
const divided=createRoadClearance();
for(const z of [-3,3])divided.addRoad({
 id:'lane'+z,kind:'residential',width:3.3,
 points:[{x:-20,z},{x:20,z}]
});
const split=planZebraPieces([{x:0,z:-9},{x:0,z:9}],divided);
assert(split.length>=4);
for(const bar of split){
 const z=(bar.a.z+bar.b.z)/2;
 assert(Math.abs(z)>.95,'No white paint on middle traffic island');
}
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const marker of [
 "from './scripts/reality-walkways.js?v=515200'",
 'streetAudit=sportovni-crossing-v7a-5152',
 "'sportovni-crossing-v7a-5152':{",
 '__miloviceZebraV7Runtime',
 'newCrossingWays:0',
 'stripesPerpendicularToFootway:true',
 'mappedMarkedCrossingOSMIds.push(String(el.id))'
])assert(html.includes(marker),'5.152 live crossing integration missing '+marker);
console.log('PASS 5.152: 5 actual OSM zebra tags preserved; Topolova V7a bars perpendicular, clipped to road and not painted on islands');
