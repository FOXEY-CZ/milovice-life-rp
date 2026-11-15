// Milovice RP 5.81.4 — source-backed entry paving, not an invented
// parking island or new path crossing Nádražní. Preserve road collision masks.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRoadClearance,isRoadFreeRect} from './road-clearance.js';
import {planBikeTowerEntryPaving,BIKE_TOWER_ENTRY_PAVING_SOURCE}
 from './bike-tower-entry-paving.js';
import {stationGpsToWorld} from './station-forecourt-pass.js';
const elements=JSON.parse(readFileSync(new URL('../data/milovice-osm.json',
 import.meta.url),'utf8')).elements;
const clearance=createRoadClearance();
let indexed=0;
for(const el of elements){
 const kind=el.tags?.highway;
 if(!kind||!el.geometry?.length)continue;
 const width=kind==='primary'?11:kind==='secondary'?9:kind==='tertiary'?8:
  kind==='pedestrian'?4:kind==='footway'?1.8:
  kind==='path'||kind==='steps'?1.65:kind==='cycleway'?2:
  kind==='service'?4.5:7.8;
 indexed+=clearance.addRoad({id:el.id,points:el.geometry.map(stationGpsToWorld),
  kind,width});
}
assert(indexed>10);
const p=planBikeTowerEntryPaving(elements,clearance);
assert(p,'OSM 1011197691 Bike Tower entrance must have road-free paver access');
assert.deepEqual(p.sourceWayIds,[1011197691,1165594426]);
assert.equal(p.width,3.1);
assert.equal(p.depth,2.1);
assert.equal(p.groundOffset,.15);
assert(p.radius>=3.2&&p.radius<=4.1);
assert.equal(p.drawCalls,1);
assert.equal(p.originalRoadsUntouched,true);
assert.equal(p.buildingMoved,false);
assert.equal(p.collisionsChanged,false);
assert.equal(p.noNewRoads,true);
assert.equal(p.photosCopied,false);
assert.equal(p.approximateBoundary,true);
assert.equal(p.approximateWidth,true);
assert.equal(BIKE_TOWER_ENTRY_PAVING_SOURCE.commonsDate,'2024-05-30');
assert.equal(BIKE_TOWER_ENTRY_PAVING_SOURCE.mapyPanoramaDate,'2022-05-17');
assert.equal(BIKE_TOWER_ENTRY_PAVING_SOURCE.surveyedPavingBoundary,false);
assert(isRoadFreeRect(clearance,{x:p.x,z:p.z,length:p.width,depth:p.depth,
 yaw:p.yaw,buffer:.18,step:.25}));
assert(clearance.nearest(p.x,p.z)?.clearance>1.5,
 'Paver rectangle must remain away from street and official footway');
assert.equal(planBikeTowerEntryPaving([],clearance),null);
assert.equal(planBikeTowerEntryPaving(elements,null),null);
assert.equal(planBikeTowerEntryPaving(elements.filter(x=>x.id!==1011197691),
 clearance),null);
assert.equal(planBikeTowerEntryPaving(elements.filter(x=>x.id!==1165594426),
 clearance),null);
// A future OSM update introducing a lane through this place must cause
// automatic rejection, not paint new paving over a live carriageway.
const blocked=createRoadClearance();
blocked.addRoad({id:'test-encroaching-carriageway',width:6,
 points:[{x:p.x-5,z:p.z},{x:p.x+5,z:p.z}],kind:'residential'});
assert.equal(planBikeTowerEntryPaving(elements,blocked),null);
const source=readFileSync(new URL('bike-tower-entry-paving.js',import.meta.url),'utf8');
assert(source.includes('isRoadFreeRect(roadClearance'));
assert(source.includes('terrainAt(x,z)+plan.groundOffset'));
assert(source.includes('sharedMaterial=sidewalkMaterial'));
assert(source.includes('layer.add(root)'));
assert(source.includes('geometry?.dispose()'));
assert(!source.includes('new THREE.MeshLambertMaterial'));
assert(!source.includes('new THREE.CanvasTexture'));
assert(!source.includes('new THREE.TextureLoader'));
assert(!source.includes('fetch('));
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
assert(html.includes("const BUILD_ID='20261115-biketower-entry-photo-paving-5814'"));
assert(html.includes("from './scripts/bike-tower-entry-paving.js?v=5814'"));
assert(html.includes("bikeTowerEntryPaving.create(elements,{sidewalkMaterial:osmSidewalkMat})"));
assert(html.includes('bikeTowerEntryPaving.reset()'));
assert(html.includes('bikeTowerEntryPaving:bikeTowerEntryPaving.status()'));
assert(html.includes("stationPhotoParking.create(elements,{sidewalkMaterial:osmSidewalkMat})"));
assert(html.includes('worldAlignedRoadUv:true'));
console.log('5.81.4 PASS OSM-anchored Bike Tower entry paver',JSON.stringify({
 sourceIds:p.sourceWayIds,width:p.width,depth:p.depth,
 indexedStreetSegments:indexed,
 clearanceMeters:+clearance.nearest(p.x,p.z).clearance.toFixed(2),
 drawCalls:1,geometryMoved:false
}));
