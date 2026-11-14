import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {STREET_PHOTO_EVIDENCE} from './street-photo-evidence.js';
import {STATION_STOP_PHOTOS} from './station-forecourt-pass.js';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const inv=JSON.parse(read('data/rebuild2-street-inventory.json'));
const osm=JSON.parse(read('data/milovice-osm.json'));
const group=inv.streets.find(s=>s.id==='old:Nádražní');
assert(group,'Nádražní is the first full-street rebuild group');
assert.equal(group.total,38);
assert.deepEqual(group.counts,{buildings:22,roads:6,walkways:5,railway:5,
 landscape:0,publicObjects:0,utilities:0,other:0});
const index=new Map(osm.elements.map(e=>[e.type+':'+e.id,e]));
const mapped=inv.classes.flatMap(kind=>group.mapped[kind]);
assert.equal(new Set(mapped).size,38);
assert(mapped.every(id=>index.has(id)),'Every survey ID must resolve to real OSM geometry');
assert(mapped.every(id=>index.get(id).geometry?.length>=2),'All mapped features must be drawable');
for(const id of ['way:53865956','way:1011197691','way:549346217','way:1550920096','way:549346219']){
 assert(mapped.includes(id),'Existing station, bike tower, mapped walk-through and platform must survive: '+id);
}
for(const id of ['way:1459294017','way:22880486','way:675778841','way:675778842']){
 assert.equal(index.get(id)?.tags?.oneway,'yes','Nádražní bus circulation retains OSM one-way direction');
 assert(mapped.includes(id),'One-way station approach must remain inventoried');
}
// Junction objects are shown as CONTEXT, not silently assigned to Nádražní.
for(const id of ['way:22880478','way:22880480','way:1282187908','way:1282187911']){
 assert(index.has(id),'Adjacent street/footway geometry exists: '+id);
 assert(!mapped.includes(id),'Adjacent street context must not count as Nádražní completion: '+id);
}
assert.equal(STATION_STOP_PHOTOS.length,2);
assert.deepEqual(STATION_STOP_PHOTOS.map(s=>s.letter),['A','B']);
assert.equal(STATION_STOP_PHOTOS[0].street,'Nádražní');
assert.equal(STATION_STOP_PHOTOS[1].street,'5. května');
const photos=STREET_PHOTO_EVIDENCE.filter(p=>p.street==='Nádražní'||
 p.id==='nadrazi-bus-B-2024');
for(const id of ['nadrazi-bus-2024','nadrazi-bus-alt-2024','nadrazi-stops-wide-2024','nadrazi-bike-tower-2024','nadrazi-bus-A-2024','nadrazi-bus-A-side-2024','nadrazi-bus-B-2024']){
 assert(photos.some(p=>p.id===id),'Missing credited interchange photo '+id);
}
assert(photos.every(p=>p.taken==='2024-05-30'&&p.author==='ŠJů'&&
 p.license==='CC BY 4.0'&&p.camera?.length===2));
assert(photos.every(p=>p.buildingIds.length===0),'A forecourt photo is not a verified building facade');
assert.equal(new Set(photos.map(p=>p.url)).size,photos.length,
 'Each street photo must appear only once');
const html=read('survey.html');
for(const marker of ['rebuild2-street-inventory.json','STREET_PHOTO_EVIDENCE',
 'data/rebuild2-street-inventory.json','getJson(source.path)',
 "street.id==='old:Nádražní'",'context-list','mandatoryAudit',
 "localStorage.setItem(storageKey",'notes','camera','source','OpenStreetMap',
 "map.fitBounds",'Chybí ověření / podklady','Lokálně prohlédnuto (není schváleno)']){
  assert(html.includes(marker),'Whole-street survey missing '+marker);
}
assert(!html.includes("STATION_STOP_PHOTOS.map("),'Duplicate bus photos would mask source integrity');
for(const marker of ['objectChecks','objectProgress()','onlyUnfinished','objects:objectChecks','saved.objects','objectStatus(o.id)'])
 assert(html.includes(marker),'Per-OSM-object QA must persist and support remaining-work filter: '+marker);
const dashboard=read('rebuild.html'),game=read('index.html');
assert(dashboard.includes("survey.html?id="),'All-street dashboard must deep-link inspection');
assert(game.includes('survey.html?id=old%3AN%C3%A1dra%C5%BEn%C3%AD'),
 'In-game real map must offer Nádražní inspection');
assert(!group.approved&&group.audited.length===0,'New survey cannot silently approve a street');
console.log('Milovice RP Nádražní REBUILD 2.0 survey PASS',JSON.stringify({
 mapped:group.total,photos:photos.length,
 roadSegments:group.counts.roads,walkways:group.counts.walkways,
 unapproved:true,legacyWork:group.legacyWork.map(x=>x.osmId)
}));
