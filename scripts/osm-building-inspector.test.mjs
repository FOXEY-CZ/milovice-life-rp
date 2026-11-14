// Milovice RP 5.62: exact raycast identity from 3D world position, no guessing.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {
 identifyOsmBuildingFromRay,osmInspectorWorldToGPS,
 formatOsmInspectorResult
} from './osm-building-inspector.js';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const square=(x0,z0,x1,z1)=>[
 {x:x0,z:z0},{x:x1,z:z0},{x:x1,z:z1},{x:x0,z:z1}
];
const buildings=[
 {id:1,points:square(10,-2,15,2),base:190,height:3,tags:{building:'garage'}},
 {id:2,points:square(20,-2,25,2),base:190,height:3,tags:{building:'house'}},
 {id:3,points:square(30,10,36,18),base:190,height:4,tags:{building:'industrial'}}
];
function cast(origin,direction,list=buildings){
 return identifyOsmBuildingFromRay({origin,direction,buildings:list});
}
const a=cast({x:0,y:192,z:0},{x:1,y:0,z:0});
assert.equal(a.id,1,'Tap must return closest ACTUAL building, not an arbitrary guess');
assert(Math.abs(a.distance-10)<1e-6);
assert.equal(a.face,'facade');
assert.equal(a.photographicApproval,false,'OSM tag is not photo evidence');
assert.equal(cast({x:17,y:192,z:0},{x:1,y:0,z:0}).id,2,
 'Tap past the first building must pick the second building');
assert.equal(cast({x:0,y:192,z:8},{x:1,y:0,z:0}),null,
 'A ray through empty space must not select a nearby building by guess');
assert.equal(cast({x:0,y:192,z:0},{x:1,y:1,z:0}),null,
 'Upward ray above the buildings must not hit a wall');
assert.equal(cast({x:12,y:202,z:0},{x:0,y:-1,z:0}).id,1,
 'Roof ray should still identify underlying mapped footprint');
assert.equal(cast({x:0,y:192,z:0},{x:1,y:0,z:0},[
 {...buildings[0],points:buildings[0].points.slice().reverse()}]).id,1,
 'Reversing OSM polygon winding cannot alter identity');
assert.equal(cast({x:0,y:192,z:0},{x:1,y:0,z:0},[]),null);
assert.equal(cast({x:0,y:192,z:0},{x:1,y:0,z:0},[{
 id:8,points:square(10,10,15,15),height:3,base:190}]),null,
 'A building 10 metres to the side cannot be identified by this tap');

const real=JSON.parse(read('data/milovice-osm.json')).elements;
const realWay=real.find(w=>w.id===194679587);
assert(realWay?.geometry?.length>=4);
const world=p=>({x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 z:-(p.lat-50.226)*111320});
const footprint=realWay.geometry.map(world);
const distinct=footprint.slice(0,-1);
const edgeA=distinct[0],edgeB=distinct[1],center={
 x:distinct.reduce((n,p)=>n+p.x,0)/distinct.length,
 z:distinct.reduce((n,p)=>n+p.z,0)/distinct.length
};
const midpoint={x:(edgeA.x+edgeB.x)*.5,z:(edgeA.z+edgeB.z)*.5};
const normal={x:midpoint.x-center.x,z:midpoint.z-center.z};
const length=Math.hypot(normal.x,normal.z);
assert(length>.3);
const ray={x:-normal.x/length,z:-normal.z/length};
const camera={x:midpoint.x+normal.x/length*8,y:192,z:midpoint.z+normal.z/length*8};
const actual=cast(camera,{x:ray.x,y:0,z:ray.z},[
 {id:realWay.id,points:footprint,base:190,height:2.75,tags:realWay.tags}
]);
assert.equal(actual?.id,194679587,'OSM real-world polygon must resolve its exact stored ID');
const info=formatOsmInspectorResult(actual);
assert(info.osmUrl.endsWith('/way/194679587'));
assert.equal(info.type,'garage','OSM tag is displayed as map metadata ONLY');
assert(info.note.includes('NENÍ fotograficky ověřený'));
assert(!actual.photographicApproval);
const lnglat=osmInspectorWorldToGPS(actual.hit);
assert(Math.abs(lnglat.lat-50.2303344)<.0002);
assert(Math.abs(lnglat.lon-14.88328908)<.0002);

const index=read('index.html');
for(const snippet of [
 "from './scripts/osm-building-inspector.js?v=5620'",
 'id="osm-inspect-toggle"',
 'id="osm-inspect-result"',
 'const osmInspectionBuildings=[];',
 'osmInspectionBuildings.push({id:osmId,',
 'identifyOsmBuildingFromRay({',
 'formatOsmInspectorResult(hit)',
 'maxDistance:180',
 'osmInspectCopied=',
 'navigator.clipboard.writeText(osmInspectCopied)',
 'const BUILD_ID='
])assert(index.includes(snippet),'Missing exact-object inspector implementation '+snippet);
assert(index.indexOf('osmInspectionBuildings.push({id:osmId,')>
 index.indexOf('baseHeight+=.10;'),
 'Only create inspector entries once the building was actually laid out');
assert(index.includes('photoRenderingDecision(osmId)'),
 'Never bypass photo audit while adding read-only building inspector');
assert(/^20\d{6}-[a-z0-9-]+$/.test(index.match(/const BUILD_ID='([^']+)'/)?.[1]||''),
 'Inspector test must accept future game builds, not pin its birth version');
console.log('5.62 mapped 3D OSM inspector PASS',JSON.stringify({
 exactWorldHit:true,missesStayNull:true,realOsmId:realWay.id,
 mapLink:info.osmUrl,photographicGuess:false
}));
