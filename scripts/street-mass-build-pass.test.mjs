import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {MASS_STREET_583,planMassStreetBlock583,MIROVA_PUBLIC_PHOTO_586,planPublicPhotoMirovaBlock586,
 SKOLSKA_PUBLIC_PHOTO_587,planPublicPhotoSkolskaBlock587} from './street-mass-build-pass.js';
import {MIROVA_PHOTO_STREET_586,planMirovaPhotoStreet586} from './mirova-public-photo-street-586.js';
import {createRoadClearance} from './road-clearance.js';

const {elements}=JSON.parse(readFileSync(
 new URL('../data/milovice-osm.json',import.meta.url),'utf8'));
const plan=planMassStreetBlock583(elements);
assert(plan,'The actual church, Pionýrů junction and 5. května OSM line must exist');
assert.equal(plan.roadId,'219273174');
assert.equal(plan.landmarkId,'118487991');
assert.equal(plan.junctionRoadId,'118488006');
assert.equal(plan.prioritizedBuildings,20);
assert.equal(plan.priorityIds.length,20);
assert.equal(new Set(plan.priorityIds).size,20);
assert(plan.buildingsConsidered>=20&&plan.buildingsConsidered<40);
assert(plan.corridorLengthM>=135&&plan.corridorLengthM<=150);
assert.equal(plan.churchwardDirection,1);
assert.equal(plan.photoApprovedBuildings,0);
assert.equal(plan.unknownFacadesStillUnverified,true);
assert.equal(plan.facadesAreProvisional,true);
assert.equal(plan.guessedDriveways,0);
assert.equal(plan.guessedPropertyFences,0);
assert.equal(plan.newBuildingFootprints,0);
assert.equal(plan.roadAndFootwayGeometryModified,false);
assert.deepEqual(plan.reviewQueue.slice(0,20).map(b=>b.id),plan.priorityIds);
assert(plan.reviewQueue.every(b=>b.roadDistanceM<=70&&b.footprintPoints>=3&&
 b.approximateHeightM>=2.7&&b.approximateHeightM<=12.5&&
 b.photoVerified===false&&b.facadeDetailIsGeneric));
assert(!plan.priorityIds.some(id=>['202367194','202367254'].includes(id)),
 'Keep individually photographed landmark models out of generic mass facade processing');
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
assert.equal(mirror.churchwardDirection,-1);
assert.deepEqual(mirror.priorityIds,plan.priorityIds);
assert.equal(mirror.corridorLengthM,plan.corridorLengthM);
// A missing church cannot authorize a direction guess.
assert.equal(planMassStreetBlock583(elements.filter(e=>e.id!==118487991)),null);
// Extra unsupported "buildings" in the OSM dataset cannot be promoted.
const augmented=planMassStreetBlock583([...elements,{
 id:888889,tags:{building:'garage'},geometry:elements.find(e=>e.id===539003462).geometry
}]);
assert.deepEqual(augmented.priorityIds,plan.priorityIds);
// Second 2024 public-photo anchored corridor has its OWN reserved slots,
 // with all already prioritized church street buildings excluded.
 const mirova=planPublicPhotoMirovaBlock586(elements,plan.priorityIds);
 assert(mirova&&mirova.prioritizedBuildings===12,
  'A meaningful 12-house Mírová city block must be rebuilt in one batch');
 assert.equal(mirova.roadId,'1331897651');
 assert.equal(mirova.photoApprovedBuildings,0);
 assert.equal(mirova.unknownFacadesStillUnverified,true);
 assert.equal(mirova.streetGeometryModified,false);
 assert.equal(mirova.guessedParcelBoundaries,0);
 assert.equal(mirova.guessedDriveways,0);
 assert(mirova.publishedStreetSource.includes('commons.wikimedia.org'));
 assert(mirova.publishedBuildingSource.includes('M%C3%ADrov%C3%A1_36'));
 assert.equal(new Set(mirova.priorityIds).size,12);
 assert(mirova.priorityIds.every(id=>!plan.priorityIds.includes(id)));
 assert.equal(mirova.prioritizedBuildings+plan.prioritizedBuildings,32);
 const mirovaReversed=planPublicPhotoMirovaBlock586([...elements].reverse(),plan.priorityIds);
 assert.deepEqual(mirovaReversed.priorityIds,mirova.priorityIds,
  'Reordering OSM export must never shuffle façade reservations');
 const flippedMirova=elements.map(el=>String(el.id)==='1331897651'?
  {...el,geometry:[...el.geometry].reverse()}:el);
 assert.deepEqual(planPublicPhotoMirovaBlock586(flippedMirova,plan.priorityIds).priorityIds,
  mirova.priorityIds,'Digitizing direction must not change the chosen photographed street');
 assert.equal(planPublicPhotoMirovaBlock586([],plan.priorityIds),null);
 assert.equal(MIROVA_PUBLIC_PHOTO_586.maxBuildings,12);
 const skolska=planPublicPhotoSkolskaBlock587(elements,
  [...plan.priorityIds,...mirova.priorityIds]);
 assert(skolska&&skolska.prioritizedBuildings===12,
  'Twelve actual school-neighborhood OSM homes, not generic buildings');
 assert.equal(skolska.photographedSchoolOSMId,'118487979');
 assert.equal(skolska.corridorLengthM,211.8);
 assert.equal(skolska.photoApprovedNeighborBuildings,0);
 assert.equal(skolska.schoolLandmarkPreserved,true);
 assert.equal(skolska.inferredHousesAreNotPhotoVerified,true);
 assert.equal(skolska.newBuildingFootprints,0);
 assert.equal(skolska.newRoads,0);
 assert.equal(skolska.newCrossings,0);
 assert.equal(skolska.newDriveways,0);
 assert.equal(skolska.roadOrFootwayGeometryChanged,false);
 assert.equal(new Set([...plan.priorityIds,...mirova.priorityIds,
  ...skolska.priorityIds]).size,44);
 assert.equal(plan.prioritizedBuildings+mirova.prioritizedBuildings+
  skolska.prioritizedBuildings,44);
 assert.deepEqual(skolska.priorityIds,
  planPublicPhotoSkolskaBlock587([...elements].reverse(),
   [...mirova.priorityIds,...plan.priorityIds]).priorityIds,
  'Input order may not reshuffle photographed street');
 const reversedSchoolWays=elements.map(e=>
  SKOLSKA_PUBLIC_PHOTO_587.roadIds.includes(String(e.id))?
   {...e,geometry:e.geometry.slice().reverse()}:e);
 assert.deepEqual(planPublicPhotoSkolskaBlock587(reversedSchoolWays,
  [...plan.priorityIds,...mirova.priorityIds]).priorityIds,skolska.priorityIds,
  'OSM road vertex direction may not reshuffle photographed street');
 assert.equal(planPublicPhotoSkolskaBlock587([],[]),null);
 assert.deepEqual(SKOLSKA_PUBLIC_PHOTO_587.cameraSchool,[50.2286983,14.8859519,85]);
 const C=Math.cos(50.226*Math.PI/180);
 const project=p=>({x:(p.lon-14.889)*111320*C,z:-(p.lat-50.226)*111320});
 const surfaceWidth={secondary:9,primary:11,tertiary:8,residential:7,
  living_street:5,footway:1.8,path:1.65,cycleway:2,service:4.5};
 const roadClearance=createRoadClearance();
 for(const way of elements.filter(e=>e.tags?.highway&&e.geometry?.length>=2)){
  const kind=way.tags.highway;
  roadClearance.addRoad({id:way.id,kind,
   points:way.geometry.map(project),width:surfaceWidth[kind]??7.8});
 }
 const green=planMirovaPhotoStreet586(elements,{roadClearance});
 assert(green&&green.roadId==='1331897651');
 assert.equal(green.source,MIROVA_PHOTO_STREET_586.source);
 assert.equal(green.roadsOrFootwaysChanged,false);
 assert.equal(green.OSMBuildingsChanged,false);
 assert.equal(green.newCrossings,0);
 assert.equal(green.newPrivateEntrances,0);
 assert.equal(green.newPavements,0);
 assert.equal(green.vegetationPositionsSurveyed,false);
 assert.equal(green.plantedElements,green.hedges.length+green.trees.length);
 assert(green.plantedElements>=2,
  'The street should receive more than one road-safe green element');
 assert(green.hedges.every(v=>v.photoObservedKind==='trimmed-hedge'&&
  v.placementSurveyed===false));
 const greenAgain=planMirovaPhotoStreet586([...elements].reverse(),{roadClearance});
 assert.deepEqual(greenAgain.hedges,green.hedges);
 assert.deepEqual(greenAgain.trees,green.trees);
 assert.equal(planMirovaPhotoStreet586([],{}),null);
 
 const game=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const hero=readFileSync(new URL('./hero-architecture.js',import.meta.url),'utf8');
assert(game.includes('planMassStreetBlock583([...roadWays,...buildingWays])'));
assert(game.includes('heroBuildings.setPriorityIds(massBlock.priorityIds)'));
 assert(game.includes('heroBuildings.setPhotoFocusIds(publicPhotoFocusIds)'),
 'Mírová and Školská must share the original 20-house focus budget');
 assert(game.includes('planPublicPhotoMirovaBlock586('));
 assert(game.includes('planPublicPhotoSkolskaBlock587('));
 assert(game.includes('window.__miloviceSkolskaPublicPhotoBlock587'));
assert(game.includes('massBlockPriority||type'));
assert(hero.includes('selectedNormal>=genericBudget'));
 assert(hero.includes('photoFocus?selectedPhotoFocus>=photoReserved'));
 assert(hero.includes('maxBuildings-reserved-photoReserved'));
assert(hero.includes('!massPriority&&!observed'));
assert(hero.includes('priorityIds.has(String(id))'));
assert(hero.includes('massBlockNoPhotoApproval:true'));
console.log('MASS_STREET_583_OK',JSON.stringify({
 prioritized:plan.prioritizedBuildings,candidates:plan.buildingsConsidered,
 road:'5. května',corridorM:plan.corridorLengthM,ids:plan.priorityIds,
 photoApproved:plan.photoApprovedBuildings,mirova:mirova.prioritizedBuildings,mirovaIds:mirova.priorityIds,skolska:skolska.priorityIds}));
