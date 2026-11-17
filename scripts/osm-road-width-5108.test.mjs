// 5.108: OSM width-tagged streets in Mladá / Benátecká Vrutice.
// These widths inform model geometry; they are not surveyed kerb positions.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planMappedRoadWidth} from './osm-road-width-5108.js';
import {mappedRoadWidth} from './osm-road-surfaces.js';
const defaultWidth=kind=>kind==='primary'?11:kind==='secondary'?9:
 kind==='tertiary'?8:kind==='pedestrian'?4:kind==='footway'?1.8:
 kind==='path'||kind==='steps'?1.65:kind==='cycleway'?2:
 kind==='service'?4.5:(mappedRoadWidth(kind)??7.8);
const load=area=>JSON.parse(readFileSync(new URL(
 '../data/regions/'+area+'.json',import.meta.url),'utf8')).elements;
const build=(area)=>load(area).filter(e=>e.tags?.highway&&
 e.tags.width!==undefined).map(e=>({
  id:e.id,tags:e.tags,
  result:planMappedRoadWidth(e.tags,defaultWidth(e.tags.highway),area)
 }));
const vrutice=build('vrutice'),mlada=build('mlada');
assert.equal(vrutice.length,18);
assert.equal(mlada.length,6);
assert(vrutice.every(x=>x.result.applied));
assert(mlada.every(x=>x.result.applied));
assert(vrutice.every(x=>x.result.source==='OSM width=*'));
assert.equal(new Set(vrutice.map(x=>String(x.id))).size,18);
assert.equal(new Set(mlada.map(x=>String(x.id))).size,6);
const byId=new Map(vrutice.map(x=>[String(x.id),x]));
assert.equal(byId.get('202375817').result.width,6); // Slepá
assert.equal(byId.get('612386894').result.width,5); // Vrutická
assert.equal(byId.get('309580561').result.width,6.5);
const byMlada=new Map(mlada.map(x=>[String(x.id),x]));
assert.equal(byMlada.get('8618262').result.width,6); // ČSA
assert.equal(byMlada.get('128087258').result.width,6); // Pod Lesem
// An OSM way repeated in both area exports must keep exactly the same width.
for(const [id,row] of byMlada)
 if(byId.has(id))assert.equal(row.result.width,byId.get(id).result.width);
for(const [tags,defaultVal,region,expectedWidth,reason] of [
 [{highway:'residential',width:'6.5'},7.8,'vrutice',6.5,'explicit-osm-width-metres'],
 [{highway:'secondary',width:'5'},9,'old',9,'protected-region'],
 [{highway:'residential',width:'5'},7.8,'centerlink',7.8,'protected-region'],
 [{highway:'footway',width:'1.5'},1.8,'vrutice',1.8,'not-carriageway'],
 [{highway:'residential'},7.8,'vrutice',7.8,'no-mapped-width'],
 [{highway:'residential',width:'5;6'},7.8,'vrutice',7.8,'unsupported-width-format'],
 [{highway:'residential',width:'5 m'},7.8,'vrutice',7.8,'unsupported-width-format'],
 [{highway:'residential',width:'6,5'},7.8,'vrutice',7.8,'unsupported-width-format'],
 [{highway:'residential',width:'27'},7.8,'vrutice',7.8,'outside-validated-road-range'],
 [{highway:'service',width:'2.8'},4.5,'vrutice',2.8,'explicit-osm-width-metres'],
 [{highway:'secondary',width:'1.5'},9,'vrutice',9,'outside-validated-road-range'],
 [{highway:'track',width:'3.2'},3.2,'vrutice',3.2,'explicit-osm-width-metres']
]){
 const out=planMappedRoadWidth(tags,defaultVal,region);
 assert.equal(out.width,expectedWidth,JSON.stringify({tags,region}));
 assert.equal(out.reason,reason,JSON.stringify({tags,region}));
}
assert.equal(planMappedRoadWidth({highway:'residential',width:'5'},NaN,'vrutice').width,null);
// These are literal midpoints and headings derived from existing OSM
// centreline segments, not camera positions copied from a real photograph.
const streetCameras=[
 {id:'road-slepa-5108',way:'202375817',lat:50.2272391,
  lon:14.8589544,heading:269.3},
 {id:'road-vruticka-5108',way:'523991122',lat:50.2251763,
  lon:14.8601586,heading:303.4}
];
for(const {id,way,lat,lon,heading} of streetCameras){
 const e=load('vrutice').find(x=>String(x.id)===way);
 assert(e,'The camera must target a real OSM roadway');
 const segments=e.geometry.slice(1).map((b,i)=>{
  const a=e.geometry[i],x=(a.lon+b.lon)*.5,
   y=(a.lat+b.lat)*.5;
  const dist=Math.hypot((x-lon)*111320*Math.cos(50.226*Math.PI/180),
   (y-lat)*111320);
  const dx=(b.lon-a.lon)*Math.cos(50.226*Math.PI/180),
   dy=b.lat-a.lat;
  const az=(Math.atan2(dx,dy)*180/Math.PI+360)%360;
  const headingDelta=Math.abs((az-heading+540)%360-180);
  return {dist,headingDelta};
 });
 assert(segments.some(e=>e.dist<.15&&e.headingDelta<.6),
  'Street-level camera must sit directly on source segment: '+id);
}
// Renderer must share this exact resolved width across ALL relevant systems,
// never re-evaluate a different value for the draw pass.
const game=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const token of [
 "'road-slepa-5108':{",
 "'road-vruticka-5108':{",
 "from './scripts/osm-road-width-5108.js?v=511000'", 
 'const roadWidths=new Map();',
 'const resolved=planMappedRoadWidth(el.tags,defaultWidth,regionId);',
 'roadWidths.set(String(el.id),width);',
 'osmRoadClearance.addRoad({id:el.id,points,width,kind});',
 'osmCarriagewayClearance.addRoad({id:el.id,points,width,kind});',
 'const width=roadWidths.get(String(el.id));',
 'const mappedRoad={points,width,kind,name:el.tags.name',
 'osmRoadSegment(points[i-1],points[i],width,kind,surfacePlan);',
 'tags:el.tags,points,roadWidth:width,',
 'window.__miloviceRoadWidthAudit'
])assert(game.includes(token),'Missing width integration: '+token);
const version=game.match(/const BUILD_ID='([^']+)'/)?.[1];
assert(/^\d{8}-[a-z0-9-]+-\d{6}$/.test(version));
assert.equal(game.match(/<meta name="milovice-build" content="([^"]+)"/)?.[1],version);
assert.equal(game.split('id="build-label">')[1]?.split('</strong>')[0],version);
console.log('PASS Milovice 5.108 source tagged street widths',
 {vrutice:vrutice.length,mlada:mlada.length,
  streets:['Slepá','Vrutická','ČSA','Pod Lesem'],
  unverifiedKerbsInvented:0});
