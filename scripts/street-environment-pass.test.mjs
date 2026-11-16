import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {PHOTO_STREET_ENVIRONMENT,STREET_PASS_03_FEATURE_POLICY,KVETNA_STREETLAMP_2022,planKvetnaStreetlamp2022,gpsToStreetWorld,nearestPhotoRoadSegment} from './street-environment-reality.js';
const ref=PHOTO_STREET_ENVIRONMENT[0];
assert.equal(PHOTO_STREET_ENVIRONMENT.length,1);
assert.equal(ref.photoLicense,'CC BY-SA 4.0');
assert.equal(STREET_PASS_03_FEATURE_POLICY.photoObservedTrees,1);
assert.equal(STREET_PASS_03_FEATURE_POLICY.photoObservedUtilityPoles,1);
assert.equal(STREET_PASS_03_FEATURE_POLICY.extraTreesDisabled,true);
assert.equal(STREET_PASS_03_FEATURE_POLICY.unmappedSecondUtilityPoleDisabled,true);
assert.equal(STREET_PASS_03_FEATURE_POLICY.unverifiedPowerLineSpanDisabled,true);
assert.equal(STREET_PASS_03_FEATURE_POLICY.exactPlacementsSurveyed,false);
assert.equal(ref.osmRoadId,'219273174');
assert.equal(ref.latitude,50.227797);
assert(ref.source.includes('commons.wikimedia.org'));
assert(ref.observed.some(x=>x.includes('hedges')));
assert(ref.accuracy.includes('approximate')||ref.accuracy.includes('estimates'));
const origin=gpsToStreetWorld(50.226,14.889);
assert(Math.abs(origin.x)<1e-6&&Math.abs(origin.z)<1e-6);
const data=JSON.parse(readFileSync(new URL('../data/milovice-osm.json',import.meta.url),'utf8'));
const way=data.elements.find(e=>String(e.id)===ref.osmRoadId);
assert(way&&way.tags?.name==='5. května'&&way.tags?.highway==='secondary');
const cos=Math.cos(50.226*Math.PI/180),road={
 osmId:way.id,width:9,points:way.geometry.map(p=>({
 x:(p.lon-14.889)*111320*cos,y:-(p.lat-50.226)*111320
 }))
};
const anchor=nearestPhotoRoadSegment(road,ref.latitude,ref.longitude);
assert(anchor&&anchor.distance<1,'The photographed road must coincide with genuine OSM geometry');
assert.equal(anchor.osmRoadId,ref.osmRoadId);
assert(Math.hypot(anchor.ux,anchor.uz)>.99);
assert(Math.hypot(anchor.nx,anchor.nz)>.99);
assert.equal(nearestPhotoRoadSegment(null,50.22,14.88),null);
// Part 17: one real May 2022 grey bent-arm lamp, LEFT when looking
// toward St Catherine's church. Its base is an OSM-safe visual estimate.
const roadClearanceModule=await import('./road-clearance.js');
const index=roadClearanceModule.createRoadClearance();
const widths={primary:11,secondary:9,tertiary:8,pedestrian:4,
 footway:1.8,path:1.65,cycleway:2,service:4.5};
const allRoads=data.elements.filter(e=>e.tags?.highway&&e.geometry?.length>=2)
 .map(e=>({osmId:e.id,kind:e.tags.highway,
  width:widths[e.tags.highway]??7.8,
  points:e.geometry.map(p=>({x:(p.lon-14.889)*111320*cos,
   y:-(p.lat-50.226)*111320}))}));
for(const r of allRoads)index.addRoad({id:r.osmId,points:r.points,
 width:r.width,kind:r.kind});
const footprints=data.elements.filter(e=>e.tags?.building&&e.geometry?.length>=4)
 .map(e=>e.geometry.map(p=>({x:(p.lon-14.889)*111320*cos,
  y:-(p.lat-50.226)*111320})));
const churchWay=data.elements.find(e=>e.id===118487991);
assert(churchWay?.tags?.building==='church');
const churchFootprint=churchWay.geometry.map(p=>({
 x:(p.lon-14.889)*111320*cos,y:-(p.lat-50.226)*111320
}));
const lamp=planKvetnaStreetlamp2022(allRoads,{roadClearance:index,
 buildingFootprints:footprints,churchFootprint});
assert(lamp,'The photo-backed lamppost base must safely fit on mapped roadside ground');
assert.equal(KVETNA_STREETLAMP_2022.sourceDate,'2022-05-09');
assert.equal(KVETNA_STREETLAMP_2022.observedCount,1);
assert.equal(KVETNA_STREETLAMP_2022.referenceLandmarkId,'118487991');
assert.equal(lamp.observedCount,1);
assert.equal(lamp.positionSurveyed,false);
assert.equal(lamp.roadAndFootwaySafe,true);
assert.equal(lamp.buildingFootprintSafe,true);
assert.equal(lamp.changedRoadGeometry,false);
assert.equal(lamp.changedBuildingGeometry,false);
assert.equal(lamp.createsNewFootway,false);
assert(lamp.along===132&&lamp.offset===-6.3);
assert.equal(lamp.osmDirectionTowardChurch,1,
 'On actual OSM, the church lies on the positive-index branch from Pionýrů');
assert(lamp.churchDistanceFromLampM+50<lamp.churchDistanceFromJunctionM,
 'Lamp MUST be along street TOWARD the real OSM church, not on the opposite branch');
const reversed=allRoads.map(r=>String(r.osmId)==='219273174'?
 {...r,points:[...r.points].reverse()}:r);
const reversedLamp=planKvetnaStreetlamp2022(reversed,{
 roadClearance:index,buildingFootprints:footprints,churchFootprint});
assert(reversedLamp);
assert.equal(reversedLamp.osmDirectionTowardChurch,-1,
 'The direction should reverse with OSM node order without moving the real-world lamp');
assert(Math.hypot(lamp.x-reversedLamp.x,lamp.z-reversedLamp.z)<.01);
assert.equal(planKvetnaStreetlamp2022(allRoads,{
 roadClearance:index,buildingFootprints:footprints,churchFootprint:[]}),null,
 'No church polygon means no invented lamp placement');
assert(lamp.nearestMappedSurfaceClearance>=1,'Lamp must stand outside modelled road and mapped footways');
assert.equal(planKvetnaStreetlamp2022([],{roadClearance:index,
 buildingFootprints:footprints,churchFootprint}),null);
assert.equal(planKvetnaStreetlamp2022(allRoads,{roadClearance:null,
 buildingFootprints:footprints,churchFootprint}),null);
// Force a footprint collision and verify fail-closed rather than guessing
// a neighbouring parcel location or silently erasing a building.
const blocked=[{x:lamp.x-1,y:lamp.z-1},{x:lamp.x+1,y:lamp.z-1},
 {x:lamp.x+1,y:lamp.z+1},{x:lamp.x-1,y:lamp.z+1}];
assert.equal(planKvetnaStreetlamp2022(allRoads,{roadClearance:index,
 buildingFootprints:[...footprints,blocked],churchFootprint}),null);

const runtime=readFileSync(new URL('./street-environment-reality.js',import.meta.url),'utf8');
assert(!runtime.includes('   paving(root,anchor,side);'),
 'Old photo paving slab generator must not run in strict reality mode');
assert(runtime.includes('checkedGreeneryAgainstRoads:true'),
 'Every actual photo-scene tree and hedge must pass road/footway clearance');
assert(runtime.includes('fullFootprintChecked:true'));
assert(runtime.includes('isRoadFreeRect(roadClearance'));
assert(runtime.includes('photoRectClearance(anchor,a,offset,2.0,1.05)'),
 'The hedge bed must be tested with its whole ground footprint');
assert(runtime.includes('photoRectClearance(anchor,gateAlong,gateOffset,3.5,.35)'),
 'A 3.5m wooden gate may not be cleared solely at its centre');
assert(!runtime.includes('function paving('),
 'Keep old speculative 5. května paving removed, not merely disabled');
assert(runtime.includes('for(const [along,size] of [[-17,1]])'));
assert(!runtime.includes('[-4,.79]'));
assert(runtime.includes('for(let i=0;i<2;i++)'));
assert(runtime.includes('for(let i=0;i<8;i++)'));
assert(!runtime.includes('const poles=[a,b]'));
assert(!runtime.includes('for(const lateral of [-.14,.14])'));
assert(runtime.includes("['Městská policie','Sběrný dvůr','Mirakulum']"));
assert(runtime.includes('photoGroundClearance(anchor,along,side,.8*size)'),
 'Stem positions cannot be inferred without physical OSM road-clearance test');

console.log('Photo-street environment OK:',JSON.stringify({reference:ref.id,roadOSM:ref.osmRoadId,photoToRoadMeters:anchor.distance}));

// v5.27.4: inferred road edge paint, retail pavement rectangles and bicycle
// stands must never appear merely because OSM says highway=residential or
// shop=supermarket. Keep surface geometry on actual OSM streets/footways.
const gameHTML=readFileSync(new URL('../index.html',import.meta.url),'utf8');
assert(gameHTML.includes('residentialInventedEdgeLinesDisabled:true'));
assert(gameHTML.includes('inventedEdgeLinesDisabled:true'));
assert(gameHTML.includes('inventedCentreDashesDisabled:true'));
assert(!gameHTML.includes("kind==='tertiary'||kind==='residential'"));
assert(gameHTML.includes('inventedRetailPadsRemoved:true'));
assert(gameHTML.includes('inventedRetailBikeStandsRemoved:true'));
assert(!gameHTML.includes("archPart('stationPaving',mx+nx*2.7"));
assert(!gameHTML.includes("archPart('stationIron',tx+nx*k*.55"));
assert(gameHTML.includes("stationPaving',cx+ax*passageS+acrossX*shift"));

// 5.28.0: Even secondary street classification is not proof of white
// edge-lines or center dashes. 2014 street photograph at the geotagged
// 5. května scene shows unstriped asphalt at the pictured location.
const streetHTML=readFileSync(new URL('../index.html',import.meta.url),'utf8');
assert(streetHTML.includes('inventedEdgeLinesDisabled:true'));
assert(streetHTML.includes('inventedCentreDashesDisabled:true'));
assert(!streetHTML.includes('for(let d=5;d<len-2;d+=13)'));
assert(!streetHTML.includes('const nx=-dz/len,nz=dx/len,edge=width*.5-.28'));
assert(streetHTML.includes('if(!markedCrossing(el.tags))continue;'),
 'Only evidenced marked crossing paths may generate zebra paint');
assert(streetHTML.includes('osmStrip(a,b,width,osmRoadMaterial,.17)'),
 'Removing speculative paint must not remove street asphalt');

// v5.28.1: a district teleport must instantly move the third-person camera
// to the current player, never interpolate over hundreds of metres through
// an unrelated terrain tile. Test the browser behaviour in WebGL smoke.
const cameraHTML=readFileSync(new URL('../index.html',import.meta.url),'utf8');
assert(cameraHTML.includes('let cameraSnapPending=false'));
assert(cameraHTML.includes('cameraSnapPending=true'));
assert(cameraHTML.includes("get('streetAudit')"));
assert(cameraHTML.includes("if(rpStreetAuditCameraWorld&&rpStreetAuditView)"));
assert(cameraHTML.includes("cameraMode:rpStreetAuditView.streetLevel?'technical-osm-street-axis'"),
 'Street-level OSM cameras must not masquerade as photographs');
assert(cameraHTML.includes("rpStreetAuditId.startsWith('pionyru')"));
assert(cameraHTML.includes('camera.position.set(x,terrainAt(x,z)+1.68,z)'));
assert(cameraHTML.includes("streetAudit=pionyru-forward"));
assert(cameraHTML.includes("streetAudit=pionyru-reverse"));
assert(cameraHTML.includes("const churchSource=buildingWays.find(w=>String(w.id)==='118487991')"));
assert(cameraHTML.includes('if(churchStreetSourceComplete){'));
assert(cameraHTML.includes("roadWays.some(w=>String(w.id)==='219273174')"));
assert(cameraHTML.includes("roadWays.some(w=>String(w.id)==='118488006')"));
assert(cameraHTML.includes('photoChurchStreet2022.create(osmDriveRoads,footprints,churchFootprint)'),
 'The 5-second regional stream must NOT recreate photo scene with missing church');
assert(cameraHTML.includes('if(trainStation&&railPlatform&&mappedStationPassage){'),
 'Unrelated regional data must not reset photographed station models');
assert(cameraHTML.includes('streetlamp2022.modelCount'));
assert(cameraHTML.includes("document.getElementById('street-audit-source').href=rpStreetAuditView.source"));
assert(cameraHTML.includes('camera.up.set(pionyru?.ux??mapped?.ux??0,0,pionyru?.uz??mapped?.uz??-1)'),
 'Technical street view uses mapped direction, never fabricated 2014 heading');

assert(cameraHTML.includes('camera.position.copy(desired)'));
assert(cameraHTML.includes('window.__miloviceCameraSpawnAudit='));
