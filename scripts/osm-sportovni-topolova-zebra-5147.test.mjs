import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRoadClearance} from './road-clearance.js';
import {markedCrossing,planZebraPieces} from './reality-walkways.js';
const elements=JSON.parse(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8')).elements;
const get=id=>elements.find(e=>String(e.id)===String(id));
const zebra=get(1316882853),road=get(8618275);
assert(zebra&&road);
assert.deepEqual(zebra.tags,{crossing:'zebra','crossing:island':'no',
 footway:'crossing',highway:'footway',surface:'asphalt'});
assert.deepEqual(zebra.geometry,[
 {lat:50.2304072,lon:14.8663619},{lat:50.2304105,lon:14.8662962},
 {lat:50.2304133,lon:14.8662413}]);
assert.equal(road.tags.name,'Topolová');
assert.deepEqual(road.geometry[3],{lat:50.2305856,lon:14.8663101});
const before=JSON.stringify([zebra,road]);
const legacy=elements.filter(e=>e.tags?.footway==='crossing'&&e.tags.crossing==='zebra');
assert.equal(legacy.length,5);
assert(legacy.every(e=>markedCrossing(e.tags)));
assert(!markedCrossing({footway:'crossing',crossing:'unmarked','crossing:markings':'no'}));
assert(!markedCrossing({footway:'crossing',crossing:'zebra','crossing:markings':'no'}));
const k=111320*Math.cos(50.226*Math.PI/180),toWorld=p=>({
 x:(p.lon-14.889)*k,y:-(p.lat-50.226)*111320
});
const roads=createRoadClearance();
roads.addRoad({id:String(road.id),kind:'residential',width:7.8,
 points:road.geometry.map(toWorld)});
const stripes=planZebraPieces(zebra.geometry.map(toWorld),roads);
assert(stripes.length>=6,'Existing mapped crossing should produce striped geometry');
for(const q of stripes){
 const x=(q.a.x+q.b.x)/2,y=(q.a.z+q.b.z)/2;
 assert(roads.nearest(x,y).clearance<0,'Stripe cannot extend off the carriageway');
}
assert.equal(JSON.stringify([zebra,road]),before);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const key of [
 'streetAudit=sportovni-topolova-zebra-5147',
 "'sportovni-topolova-zebra-5147':{",
 'mappedMarkedCrossingOSMIds.push(String(el.id))',
 "const BUILD_ID='20261118-sportovni-topolova-osm-zebras-514700'"
])assert(html.includes(key),'Missing 5.147 integration: '+key);
console.log('PASS 5.147 OSM: 5 historical zebras, mapped Topolova crossing, no invented roadway');
