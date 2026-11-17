// 5.91 whole-city OSM nature/pitch pass. Source geometries are never edited.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planCityLanduseBatches} from './landscapes.js';
const cosine=Math.cos(50.226*Math.PI/180);
const toWorld=p=>({x:(p.lon-14.889)*111320*cosine,
 y:-(p.lat-50.226)*111320});
const regions=['mlada','vrutice','westlink','centerlink','bozidar'];
const originalKinds=tags=>tags?.landuse==='forest'?'forest':
 tags?.landuse==='grass'?'grass':
 ['park','pitch','playground'].includes(tags?.leisure)?tags.leisure:null;
let originalDraw=0,proposedDraw=0,documented=0;
for(const id of regions){
 const path=new URL('../data/regions/'+id+'.json',import.meta.url);
 const elements=JSON.parse(readFileSync(path,'utf8')).elements;
 const selected=elements.filter(e=>originalKinds(e.tags)&&e.geometry?.length>=4);
 const expectedIds=selected.map(e=>String(e.id)).sort();
 const plan=planCityLanduseBatches(elements,toWorld);
 assert(plan,'A city district must have a valid OSM landuse plan');
 assert.equal(plan.sourcePolygons,selected.length,
  'Do not lose mapped park, playground or field geometry in '+id);
 assert.deepEqual(plan.entries.map(e=>e.id).sort(),expectedIds,
  'No unapproved green space may be created from anything except OSM');
 assert(plan.groups.length<=plan.sourcePolygons);
 assert.equal(plan.generatedDriveways,0);
 assert.equal(plan.generatedPlotFences,0);
 assert.equal(plan.generatedPrivatePlants,0);
 assert(plan.mappedPolygonGeometryUnchanged);
 assert.deepEqual(
  plan.entries.map(e=>[e.id,e.key]).sort((a,b)=>a[0].localeCompare(b[0])),
  planCityLanduseBatches([...elements].reverse(),toWorld)
   .entries.map(e=>[e.id,e.key]).sort((a,b)=>a[0].localeCompare(b[0])),
  'Map ordering cannot change chunk placement or designations');
 for(const e of plan.entries){
  const src=selected.find(v=>String(v.id)===e.id);
  assert(src,'Only real OSM polygons qualify for a graphics batch');
  const original=src.geometry.map(toWorld);
  const expectedClosed=original.length>3&&
   Math.hypot(original[0].x-original.at(-1).x,
    original[0].y-original.at(-1).y)<.05;
  assert.equal(e.pts.length,original.length-(expectedClosed?1:0));
  assert(e.area>=5&&Number.isFinite(e.area));
  assert.equal(typeof e.oversized,'boolean');
 }
 const original=plan.sourcePolygons+plan.pitchOutlines;
 const merged=plan.groups.length+plan.groups.filter(g=>g.kind==='pitch').length;
 originalDraw+=original;proposedDraw+=merged;documented+=plan.sourcePolygons;
 assert(merged<=original,'Batching must not increase per-district draw calls');
 const game=readFileSync(new URL('../index.html',import.meta.url),'utf8');
 assert(game.includes('addCityLanduseBatches(THREE,landscapeWays,'),
  'The planner alone does not build visible city greenery');
 assert(game.includes('window.__miloviceCityGreenBatch'),
  'Expose actual drawn city-wide polygon/mesh counts for WebGL audits');
 console.log(id+': OSM polygons '+plan.sourcePolygons+
  ', separate draw calls '+original+', batched <= '+merged);
}
assert(documented>=250,'Five region exports should retain actual OSM parks/grass/pitches');
assert(originalDraw-proposedDraw>=150,
 'Full-city batch optimization must save meaningful draw calls');
assert.equal(planCityLanduseBatches([],toWorld).sourcePolygons,0);
assert.equal(planCityLanduseBatches([],toWorld,{cellSize:0}),null);
console.log('PASS citywide green-space 5.91: '+documented+
 ' unmodified OSM polygons; avoided >= '+(originalDraw-proposedDraw)+
 ' draw calls across five mapped regions');
