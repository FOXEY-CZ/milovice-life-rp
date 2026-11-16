import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {MASS_STREET_583,planMassStreetBlock583} from './street-mass-build-pass.js';

const {elements}=JSON.parse(readFileSync(
 new URL('../data/milovice-osm.json',import.meta.url),'utf8'));
const plan=planMassStreetBlock583(elements);
assert(plan,'The actual church, Pionýrů junction and 5. května OSM line must exist');
assert.equal(plan.roadId,'219273174');
assert.equal(plan.landmarkId,'118487991');
assert.equal(plan.junctionRoadId,'118488006');
assert.equal(plan.prioritizedBuildings,24);
assert.equal(plan.priorityIds.length,24);
assert.equal(new Set(plan.priorityIds).size,24);
assert(plan.buildingsConsidered>=24&&plan.buildingsConsidered<45);
assert(plan.corridorLengthM>=220&&plan.corridorLengthM<=240);
assert.equal(plan.churchwardDirection,-1);
assert.equal(plan.photoApprovedBuildings,0);
assert.equal(plan.unknownFacadesStillUnverified,true);
assert.equal(plan.facadesAreProvisional,true);
assert.equal(plan.guessedDriveways,0);
assert.equal(plan.guessedPropertyFences,0);
assert.equal(plan.newBuildingFootprints,0);
assert.equal(plan.roadAndFootwayGeometryModified,false);
assert.deepEqual(plan.reviewQueue.slice(0,24).map(b=>b.id),plan.priorityIds);
assert(plan.reviewQueue.every(b=>b.roadDistanceM<=48&&b.footprintPoints>=3&&
 b.approximateHeightM>=2.7&&b.approximateHeightM<=12.5&&
 b.photoVerified===false&&b.facadeDetailIsGeneric));
const eligibleTypes=new Set(['house','residential','yes','detached',
 'semidetached_house','terrace']);
for(const id of plan.priorityIds){
 const building=elements.find(e=>String(e.id)===id);
 assert(building&&eligibleTypes.has(building.tags.building));
}
assert.equal(planMassStreetBlock583([]),null);
assert.equal(planMassStreetBlock583(elements.slice(0,20)),null);
// Reordered OSM input must not change the priority order or scope.
const shuffled=planMassStreetBlock583([...elements].reverse());
assert.deepEqual(shuffled.priorityIds,plan.priorityIds);
// The mapped street can be digitized in the opposite direction.
const flipped=elements.map(e=>e.id===219273174?
 {...e,geometry:[...e.geometry].reverse()}:e);
const mirror=planMassStreetBlock583(flipped);
assert.equal(mirror.churchwardDirection,1);
assert.deepEqual(mirror.priorityIds,plan.priorityIds);
assert.equal(mirror.corridorLengthM,plan.corridorLengthM);
// A missing church cannot authorize a direction guess.
assert.equal(planMassStreetBlock583(elements.filter(e=>e.id!==118487991)),null);
// Extra unsupported "buildings" in the OSM dataset cannot be promoted.
const augmented=planMassStreetBlock583([...elements,{
 id:888889,tags:{building:'garage'},geometry:elements.find(e=>e.id===539003462).geometry
}]);
assert.deepEqual(augmented.priorityIds,plan.priorityIds);
const game=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const hero=readFileSync(new URL('./hero-architecture.js',import.meta.url),'utf8');
assert(game.includes('planMassStreetBlock583([...roadWays,...buildingWays])'));
assert(game.includes('heroBuildings.setPriorityIds(massBlock.priorityIds)'));
assert(game.includes('massBlockPriority||type'));
assert(hero.includes('selectedNormal>=maxBuildings-reserved'));
assert(hero.includes('!massPriority&&!observed'));
assert(hero.includes('priorityIds.has(String(id))'));
assert(hero.includes('massBlockNoPhotoApproval:true'));
console.log('MASS_STREET_583_OK',JSON.stringify({
 prioritized:plan.prioritizedBuildings,candidates:plan.buildingsConsidered,
 road:'5. května',corridorM:plan.corridorLengthM,ids:plan.priorityIds,
 photoApproved:plan.photoApprovedBuildings}));
