// Milovice RP 5.119 — photograph-grounded BILLA roof logo and single entrance canopy.
// Static safety regression; live Chrome/WebGL visibility remains a separate smoke test.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {GAME_TITLE} from './fictional-identity.js';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const mlada=JSON.parse(readFileSync(
 new URL('../data/regions/mlada.json',import.meta.url),'utf8')).elements;
const billa=mlada.find(e=>e.type==='way'&&e.id===53865798);
const clinic=mlada.find(e=>e.type==='way'&&e.id===1057548624);
assert(billa&&clinic,'Both surveyed OSM footprints must still exist');
assert.equal(billa.tags.name,'Billa');
assert.equal(billa.tags.shop,'supermarket');
assert.equal(billa.tags['building:levels'],'1');
assert.equal(clinic.tags.amenity,'clinic');
assert.equal(clinic.tags.name,'Poliklinika Milovice');
const build=html.match(/const BUILD_ID='([^']+)'/)?.[1];
assert(/^20\d{6}-[a-z0-9-]+$/.test(build));
assert(html.includes('<meta name="milovice-build" content="'+build+'"'));
assert(html.includes('<title>'+GAME_TITLE+' – 5.')); 
assert(/ – 5\.\d{3}<\/title>/.test(html));
assert(/Verze 5\.\d{3} · build/.test(html));
assert(/href="\.\/\?v=\d{6}"/.test(html));
assert(/href="\?v=\d{6}&streetAudit=armadni-billa-5118"/.test(html));
assert(/href="\?v=\d{6}&streetAudit=armadni-clinic-5118"/.test(html));
// Photo evidence: individually yellow letters above the grey store entrance,
// NOT a solid yellow/red retail banner or two coincident roof canopies.
const photoBlockStart=html.indexOf("if(normalized==='billa'){\n  g.clearRect");
const photoBlockEnd=html.indexOf("}else{\n  g.fillStyle=bg;",photoBlockStart);
assert(photoBlockStart>=0&&photoBlockEnd>photoBlockStart);
const drawing=html.slice(photoBlockStart,photoBlockEnd);
assert(drawing.includes("g.fillStyle=BRAND_PALETTES.billa.foreground"));
assert(!drawing.includes('fillRect('),'BILLA sign must have no opaque panel');
assert(html.includes("if(normalized!=='billa'){\n  archPart(normalized==='penny'"));
assert(html.includes("if(isPhotoBillaSign)window.__miloviceBillaSignAudit={"));
assert(html.includes('transparent:isPhotoBillaSign'));
assert(html.includes('sign.userData.lodDetail=!isPhotoBillaSign'));
assert(html.includes('photoCanopyCount:1'));
assert(html.includes('extraGenericCanopies:0,extraGenericFascias:0'));
assert(html.includes('newUnmappedAccessPaths:0,newParkingSpots:0'));
// An already-extruded mapped wall, clinic floor count, and emergency LOD code
// must not be replaced to fix a photographic shop sign.
for(const token of [
 "if(osmId===53865798&&tags.shop==='supermarket'&&name==='Billa')",
 "photoEntranceEdge?.index===4",
 "const isArmClinic=armLandmark?.kind==='polyclinic'",
 "window.__miloviceArmLandmarksRuntime=()=>{",
 "const isPhotoBillaSign=normalized==='billa'",
 "roofLetters:upper,sourceRoofLetters:'BILLA',letterColour:BRAND_PALETTES.billa.foreground,sourceLetterColour:'yellow'",
 "const upper=businessSignText(tags).toLocaleUpperCase('cs');"
])assert(html.includes(token),'Missing protected integration: '+token);
assert(/(?:const|let) floors=modelCard\?\.floors\?\?\(armLandmark\?\.floors/.test(html),
 'Original clinic floor-level fallback must still exist');
console.log('PASS 5.119: Vendoa roof sign transparent with fictional palette, one mapped canopy, preserved clinic, OSM and photo cameras');
