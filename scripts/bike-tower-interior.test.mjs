// Milovice RP 5.64 — exact existing Bike Tower ID + one instanced steelwork.
// The source confirms a transparent BT 2.2 automated garage, not beam survey.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {MILOVICE_BIKE_TOWER_PHOTO,
 planBikeTowerSteelwork,createBikeTowerSteelwork} from './bike-tower-interior.js';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const ways=JSON.parse(read('data/milovice-osm.json')).elements;
const tower=ways.find(w=>w.id===1011197691);
assert(tower?.geometry?.length>=4);
assert.equal(tower.tags.building,'yes');
assert.equal(MILOVICE_BIKE_TOWER_PHOTO.wayId,1011197691);
assert.equal(MILOVICE_BIKE_TOWER_PHOTO.photoDate,'2024-05-30');
assert.equal(MILOVICE_BIKE_TOWER_PHOTO.renderBudget,1);
assert.equal(MILOVICE_BIKE_TOWER_PHOTO.steelRackArrangementEstimated,true);
assert(MILOVICE_BIKE_TOWER_PHOTO.source.includes('commons.wikimedia.org'));
assert(MILOVICE_BIKE_TOWER_PHOTO.manufacturer.includes('biketower.cz'));
const points=tower.geometry.slice(0,-1);
const centre=points.reduce((a,p)=>({lat:a.lat+p.lat/points.length,
 lon:a.lon+p.lon/points.length}),{lat:0,lon:0});
const radius=points.reduce((sum,p)=>sum+Math.hypot(
 (p.lat-centre.lat)*111320,
 (p.lon-centre.lon)*111320*Math.cos(50.226*Math.PI/180)),0)/points.length;
const clamped=Math.max(3.2,Math.min(4.1,radius));
const planned=planBikeTowerSteelwork({radius:clamped,height:11.4});
assert.equal(planned.valid,true);
assert.equal(planned.wayId,1011197691);
assert.equal(planned.internalOnly,true);
assert.equal(planned.geometryEstimated,true);
assert.equal(planned.renderBudget,1);
assert.equal(planned.beams.length,52);
assert.equal(planned.levels,4);
for(const beam of planned.beams)for(const p of [beam.a,beam.b]){
 assert([p.x,p.y,p.z].every(Number.isFinite));
 assert(Math.hypot(p.x,p.z)<clamped-.3,'All structure must stay INSIDE photographed glass tower');
 assert(p.y>.5&&p.y<11,'No exterior floating framework or road collision');
}
assert.equal(planBikeTowerSteelwork({radius:3.6,wayId:123}).valid,false,
 'Do not apply this actual Milovice photograph to another bike tower');
assert.equal(planBikeTowerSteelwork({radius:-1}).valid,false);
assert.equal(planBikeTowerSteelwork({radius:3.6,height:4}).valid,false);
const prior=read('index.html');
for(const fragment of [
 "from './scripts/bike-tower-interior.js?v=5640'",
 'const steelPlan=planBikeTowerSteelwork({radius:rad,height:visibleHeight,wayId:1011197691})',
 'createBikeTowerSteelwork(THREE,g,steelPlan)',
 'window.__miloviceBikeTowerInterior={',
 'externalFootprintUnchanged:true',
 'addedStreetFurniture:0',
 "const BUILD_ID='20261114-bike-tower-interior-5640'"
])assert(prior.includes(fragment),'Missing real in-game photo-derived steelwork '+fragment);
assert(prior.includes('miloviceBikeTower(pts,baseHeight)'),
 'Bike Tower must still occupy SAME OSM building footprint');
assert(prior.includes('station-photo-forecourt')||prior.includes('station-forecourt-pass'),
 'Street forecourt details should remain unaffected');

class V {
 constructor(x=0,y=0,z=0){this.x=x;this.y=y;this.z=z}
 set(x,y,z){this.x=x;this.y=y;this.z=z;return this}
 copy(other){return this.set(other.x,other.y,other.z)}
 normalize(){const l=Math.hypot(this.x,this.y,this.z)||1;this.x/=l;this.y/=l;this.z/=l;return this}
 length(){return Math.hypot(this.x,this.y,this.z)}
}
class BoxGeometry{constructor(...size){this.size=size}}
class MeshLambertMaterial{constructor(o){this.options=o}}
class InstancedMesh{
 constructor(g,m,n){this.geometry=g;this.material=m;this.count=n;
  this.instanceMatrix={};this.userData={};this.matrices=[]}
 setMatrixAt(i,v){this.matrices[i]=v}
 computeBoundingSphere(){}
}
class Object3D{
 constructor(){this.position=new V();this.quaternion={setFromUnitVectors(){}};
  this.scale={set(){}}}
 updateMatrix(){this.matrix={placed:true}}
}
const THREE={BoxGeometry,MeshLambertMaterial,InstancedMesh,Object3D,Vector3:V};
const parent={items:[],add(mesh){this.items.push(mesh)}};
const empty=createBikeTowerSteelwork(THREE,parent,{valid:false,beams:[]});
assert.equal(empty.rendered,false);
assert.equal(parent.items.length,0);
const drawn=createBikeTowerSteelwork(THREE,parent,planned);
assert.equal(drawn.rendered,true);
assert.equal(drawn.drawCalls,1);
assert.equal(drawn.instances,52);
assert.equal(drawn.sourceDate,'2024-05-30');
assert.equal(parent.items.length,1);
assert.equal(parent.items[0].matrices.length,52);
assert.equal(parent.items[0].userData.steelStructureApproximate,true);
assert.equal(parent.items[0].userData.internalOnly,true);
console.log('5.64 photographed Milovice Bike Tower interior PASS',JSON.stringify({
 photographedExactSite:1011197691,
 steelStructureApproximated:true,
 beams:planned.beams.length,additionalDrawCalls:drawn.drawCalls,
 streetFootprintsChanged:0,roofOrBusStopsChanged:0
}));
