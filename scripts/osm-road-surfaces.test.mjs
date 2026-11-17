// Milovice RP 5.94 — OSM surface-tag terrain material regression.
// All source ways stay where OSM mapped them; nothing adds an inferred lane.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {classifyMappedRoadSurface,mappedRoadWidth} from './osm-road-surfaces.js';
import {isCarriageway,isPedestrianWay} from './reality-walkways.js';

const plan=(highway,surface)=>classifyMappedRoadSurface({highway,surface});
for(const [kind,tag,material] of [
 ['residential','asphalt','asphalt'],
 ['residential','paving_stones','paving'],
 ['residential','sett','paving'],
 ['service','concrete:plates','paving'],
 ['footway','gravel','aggregate'],
 ['path','compacted','aggregate'],
 ['path','dirt','earth'],
 ['path','ground','earth'],
 ['footway','grass','grass'],
 ['track','sand','earth'],
 ['track','asphalt','asphalt'],
 ['track','gravel','aggregate'],
 ['track',undefined,'aggregate'],
 ['footway',undefined,'legacy-footway'],
 ['residential',undefined,'legacy-asphalt'],
 ['residential','paved','legacy-asphalt'],
 ['footway','wood','legacy-footway']
]){
 const result=plan(kind,tag);
 assert(result&&result.material===material,
  'OSM '+kind+'/'+tag+' must render as '+material);
 assert(!result.roadGeometryChanged&&!result.widthChanged&&!result.heightChanged);
 assert(!result.exactAppearanceVerified);
 assert.equal(result.tagged,Boolean(tag));
}
assert.equal(classifyMappedRoadSurface({highway:'building',surface:'paving_stones'}),null);
assert.equal(classifyMappedRoadSurface({highway:'river',surface:'asphalt'}),null);
assert.equal(mappedRoadWidth('track'),3.2,'Only OSM forestry/farm tracks gain a narrow ribbon');
assert.equal(mappedRoadWidth('residential'),null,'Never change normal road width');
assert(isCarriageway('track'),'Mapped forestry tracks must now receive physical surfaces');
assert(isPedestrianWay('path')&&!isPedestrianWay('track'),'Footway and track semantics stay different');

const files=['../data/milovice-osm.json',
 ...['mlada','vrutice','westlink','centerlink','bozidar']
  .map(id=>'../data/regions/'+id+'.json')];
const ids=new Set(),byMaterial={},regionCounts={},bySurface={};
for(const file of files){
 const region=file.split('/').pop().replace('.json','');
 const data=JSON.parse(readFileSync(new URL(file,import.meta.url),'utf8'));
 let candidateWays=0,explicit=0,tracks=0;
 for(const el of data.elements){
  if(!el.geometry?.length||ids.has(String(el.id)))continue;
  ids.add(String(el.id));
  const surface=classifyMappedRoadSurface(el.tags||{});
  if(!surface)continue;
  candidateWays++;
  byMaterial[surface.material]=(byMaterial[surface.material]||0)+1;
  if(surface.tagged){
   explicit++;
   bySurface[surface.surfaceTag]=(bySurface[surface.surfaceTag]||0)+1;
  }
  if(surface.kind==='track')tracks++;
  assert(surface.pathFromOSM&&surface.materialSource,'Every visual is sourced');
 }
 regionCounts[region]={candidateWays,explicit,tracks};
}
assert((byMaterial.asphalt||0)>150,'Mapped asphalt is not rare');
assert((byMaterial.paving||0)>50,'Actual paving-tag data must influence street rendering');
assert((byMaterial.aggregate||0)>90,'Mapped tracks and gravel paths must change material');
assert((byMaterial.earth||0)>15,'Tagged natural earth surfaces must not look like concrete');
assert((byMaterial.grass||0)>=3,'Tagged grass paths must remain grassy');
assert(Object.values(regionCounts).reduce((s,r)=>s+r.tracks,0)>85,
 'Actual, deduplicated OSM forestry tracks are rendered across city areas');
const index=readFileSync(new URL('../index.html',import.meta.url),'utf8');
assert(index.includes('const osmMappedSurfaceMaterials={'));
assert(index.includes('const surfacePlan=classifyMappedRoadSurface(el.tags);'));
assert(index.includes('osmRoadSegment(points[i-1],points[i],width,kind,surfacePlan);'));
assert(index.includes('const worldAlignedAsphalt=material===osmRoadMaterial;'),
 'Existing road UV scheme must remain world-aligned');
assert(index.includes('if(surfaceMat===osmRoadMaterial)osmStrip(a,b,width,osmRoadMaterial,.17);'),
 'Untagged road geometry and material must stay unchanged');
assert(index.includes('new THREE.Vector2(piece.b.x,piece.b.z),width,osmSidewalkMat,.13)'),
 'Untagged mapped footways must keep their normal paving geometry');
assert(index.includes('const osmSurfaceAudit=window.__miloviceOSMSurfaceAudit='),
 'Game must expose actual rendered way surface audit');
assert(index.includes('if(kind===\'track\')osmSurfaceAudit.mappedTrackSegments++;'),
 'Game must track rendered OSM farm/forest routes');
assert(index.includes('newMaterialCount:3'),
 'Only three new reused materials are allowed in mobile render budget');
console.log('PASS 5.94 OSM surfaces: '+JSON.stringify({byMaterial,regions:regionCounts}));
