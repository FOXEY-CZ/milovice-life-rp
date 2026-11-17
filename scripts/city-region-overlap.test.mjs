// Milovice RP 5.93 — real overlap-safe city streaming.
// A region is an OSM export tile, not a promise of unique physical buildings.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planRegionalBuildingStyle,TARGET_REGIONS}
 from './regional-residential-style.js';
import {makeStreetFrontageIndex} from './street-frontage-index.js';

const source=JSON.parse(readFileSync(
 new URL('../data/milovice-osm.json',import.meta.url),'utf8')).elements;
const seenIds=new Set(source.filter(e=>e.geometry?.length).map(e=>String(e.id)));
const initialSourceCount=seenIds.size;
const possibleRegional=new Set();
let totalOccurrences=0,firstSeen=0,overlapFeatures=0,overlapBuildings=0;
const cosine=Math.cos(50.226*Math.PI/180);
for(const regionId of TARGET_REGIONS){
 const area=JSON.parse(readFileSync(
  new URL('../data/regions/'+regionId+'.json',import.meta.url),'utf8'));
 for(const feature of area.elements){
  if(!feature.geometry?.length)continue;
  const id=String(feature.id),seenBefore=seenIds.has(id);
  if(seenBefore){
   overlapFeatures++;
   if(feature.tags?.building)overlapBuildings++;
  }else seenIds.add(id);
  if(!feature.tags?.building||feature.geometry.length<4)continue;
  const xs=feature.geometry.map(p=>(p.lon-14.889)*111320*cosine);
  const zs=feature.geometry.map(p=>-(p.lat-50.226)*111320);
  const w=Math.max(...xs)-Math.min(...xs),d=Math.max(...zs)-Math.min(...zs);
  if(w<2||d<2||w>140||d>140)continue;
  const levels=Number(feature.tags['building:levels']);
  const floors=Number.isFinite(levels)&&levels>0?Math.min(16,levels):2;
  const style=planRegionalBuildingStyle({
   regionId,id,tags:feature.tags,width:w,depth:d,floors});
  if(!style)continue;
  totalOccurrences++;
  possibleRegional.add(id);
  if(!seenBefore)firstSeen++;
 }
}
assert(initialSourceCount>100,'Original core OSM set must be present');
assert(totalOccurrences>2250,'Five regional exports must have many mapped building features');
assert(possibleRegional.size<totalOccurrences,
 'Overlapping region totals must never be reported as unique buildings');
assert(overlapFeatures>1000&&overlapBuildings>700,
 'The data must retain overlapping regions and explicit dedup protection');
assert(firstSeen>900&&firstSeen<1250,
 'Loaded built-home count must reflect the existing core plus region overlap');
const game=readFileSync(new URL('../index.html',import.meta.url),'utf8');
assert(game.includes('if(seenCityOSMWays.has(el.id)){'),
 'Never enqueue a way twice when two regional tiles overlap');
assert(game.includes('dedup.duplicateBuildingsSkipped++'),
 'Expose accurate actual in-game duplicate OSM building count');
assert(game.includes('window.__miloviceRegionDedup=null'),
 'Full city reinitialize must reset dedup metrics');
assert(game.includes('streetFrontage.reset();'),
 'Reset the spatial street index before rebuilding roads');
const roadIndex=makeStreetFrontageIndex();
roadIndex.addRoad({osmId:10,kind:'residential',width:7.8,
 points:[{x:0,y:0},{x:60,y:0}]});
assert(roadIndex.summary().mappedSegments>0);
roadIndex.reset();
assert.equal(roadIndex.summary().mappedSegments,0);
assert.equal(roadIndex.summary().spatialCells,0);
console.log('PASS region OSM overlap: '+totalOccurrences+
 ' candidates across tiles, '+possibleRegional.size+' distinct eligible OSM IDs, '+
 firstSeen+' first-seen after old core; '+overlapBuildings+
 ' duplicate building occurrences skipped in fixed loading order');
