import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRoadClearance,isRoadFreeRect} from './road-clearance.js';
// Two connected roads and a nearby walkway must all be considered.
const roads=createRoadClearance({cellSize:50});
assert.equal(roads.addRoad({id:'main',width:9,kind:'secondary',
 points:[{x:-100,y:0},{x:100,y:0}]}),1);
assert.equal(roads.addRoad({id:'cross',width:7.8,kind:'residential',
 points:[{x:0,y:-100},{x:0,y:100}]}),1);
assert.equal(roads.addRoad({id:'parallel',width:6,kind:'residential',
 points:[{x:-100,y:13},{x:100,y:13}]}),1);
assert.equal(roads.addRoad({id:'walk',width:1.8,kind:'footway',
 points:[{x:-100,y:23},{x:100,y:23}]}),1);
assert.equal(roads.addRoad({id:'main',width:9,points:[{x:-10,y:0},{x:10,y:0}]}),0,
 'Overlapping exported OSM road IDs must not duplicate the spatial index');
assert.equal(roads.isClear(30,0,.4,1),false,'Tree on carriageway');
assert.equal(roads.isClear(0,9,.4,1),false,'Tree inside crossroad even when clear of the main street');
assert.equal(roads.isClear(45,11,.4,1),false,'A parallel road must be checked');
assert.equal(roads.isClear(45,23,.4,.7),false,'Mapped footway must not be obstructed');
assert.equal(roads.isClear(45,30,.9,1),true,'Roadside planting can be approved well beyond both streets');
assert.equal(roads.isClear(500,500,2,1),true,'Unmapped distant field is not automatically a road');
assert.equal(roads.isClear(NaN,0),false,'Nonfinite coordinates must never be planted');
assert.equal(roads.stats().indexedRoutes,4);
assert.equal(roads.stats().segments,4);
// Real 5. května image location is at an OSM roadway/footpath junction.
// The previous photo-environment +normal placement hit the mapped footway.
const raw=JSON.parse(readFileSync(new URL('../data/milovice-osm.json',import.meta.url),'utf8'));
const cos=Math.cos(50.226*Math.PI/180);
const convert=p=>({x:(p.lon-14.889)*111320*cos,y:-(p.lat-50.226)*111320});
const oldTown=createRoadClearance();
for(const el of raw.elements)if(el.tags?.highway&&el.geometry?.length>1){
 const kind=el.tags.highway;
 const width={primary:11,secondary:9,tertiary:8,pedestrian:4,footway:1.8,path:1.65,service:4.5}[kind]||7.8;
 oldTown.addRoad({id:el.id,width,kind,points:el.geometry.map(convert)});
}
assert(oldTown.stats().indexedRoutes>100);
const target=raw.elements.find(el=>el.id===219273174);
assert(target?.tags?.name==='5. května');
const x=(14.884813-14.889)*111320*cos,z=-(50.227797-50.226)*111320;
assert.equal(oldTown.isClear(x,z,.3,1),false,'The photo GPS anchor is ON the road; never plant at its centre');
// 5.26.2 regression: a roadside gate or wall can have a clear centre yet its
// ends intrude into the carriageway. Test the complete footprint, including
// rotated rectangular frontages and narrow mapped pedestrian paths.
const rectangular=createRoadClearance();
rectangular.addRoad({id:'asphalt',width:8,points:[{x:-30,y:0},{x:30,y:0}]});
assert(rectangular.isClear(0,7,.2,.1),'Centre of the wall is clear');
assert(!isRoadFreeRect(rectangular,{x:0,z:7,length:12,depth:1,yaw:Math.PI/2}),
 'Long gate rotated perpendicular to the road must not cross the asphalt');
assert(isRoadFreeRect(rectangular,{x:0,z:7,length:12,depth:1,yaw:0}),
 'Same gate parallel to the carriageway is not rejected by its length alone');
rectangular.addRoad({id:'walk',kind:'footway',width:1.8,points:[{x:-20,y:10},{x:20,y:10}]});
assert(!isRoadFreeRect(rectangular,{x:0,z:9,length:3,depth:1,yaw:0}),
 'Fence and flowerbed may not overlap OSM footway despite clear centre');
assert(!isRoadFreeRect(rectangular,{x:NaN,z:7,length:2,depth:1}));
assert(!isRoadFreeRect(rectangular,{x:0,z:7,length:0,depth:1}));
console.log('Road clearance tests OK:',JSON.stringify(oldTown.stats()));
