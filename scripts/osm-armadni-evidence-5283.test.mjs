import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ARMADNI_EVIDENCE_5283 as E,armadniEvidenceView5283 as view,armadniEvidenceNavigation5285 as nav,mountArmadniEvidence5283 as mount} from './osm-armadni-evidence-5283.js';
import {ARMADNI_HOUSES_5282 as H,planArmadniHouses5282 as plan} from './osm-armadni-houses-5282.js';
assert.deepEqual(E.houses.map(x=>x.house),H.buildings.map(x=>x.house));
assert.deepEqual(E.houses.map(x=>x.osmId),H.buildings.map(x=>x.id));
assert.deepEqual(E.houses.map(x=>x.ruian),H.buildings.map(x=>x.ruian));
assert.deepEqual(E.project.houses,['890','891']);
assert.equal(E.project.kind,'project-concept-only');
assert.deepEqual(E.project.assignments,{C15:'890',C16:'891'});
assert(E.city.title.includes('C15 = č.p. 890')&&E.city.title.includes('C16 = č.p. 891'));
assert(E.houses.find(x=>x.house==='890').note.includes('C15'));
assert(E.houses.find(x=>x.house==='890').note.includes('PROVIZORNÍ'));
const terrace=E.houses.find(x=>x.house==='890').groundFloorTerraceEvidence;
assert.equal(terrace.sourceType,'address-specific-listing');
assert.equal(terrace.areaSquareMetres,13);
assert.equal(terrace.advertisedOn,'2022-05-25');
assert.equal(terrace.exactPlacementVerified,false);
assert.equal(terrace.allUnitTerracesVerified,false);
assert.equal(terrace.geometryAdded,false);
assert(E.houses.find(x=>x.house==='891').note.includes('C16'));
assert.equal(E.houses.find(x=>x.house==='891').url,'https://jirisimon.cz/milovice/','real photos now available, no mapped balcony edge');
assert(E.houses.find(x=>x.house==='891').note.includes('bez GPS/azimutu'));
assert(E.houses.find(x=>x.house==='891').note.includes('jižní OSM hraně 6'));
assert.equal(E.houses.filter(x=>x.url).length,3);
for(const h of E.houses)if(h.url)assert(h.url.startsWith('https://'));
const source=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const elements=JSON.parse(source).elements;
for(const h of E.houses){
 const w=elements.find(w=>String(w.id)===h.osmId);
 const p=plan({id:w.id,regionId:'mlada',tags:w.tags,geometry:w.geometry,modelFloors:4,modelHeight:12.2});
 assert(p,'source plan '+h.house);
 assert.equal(p.newBalconies,0);assert.equal(p.newColliders,0);
}
assert.equal(view('?streetAudit=armadni-houses-east-5282'),'armadni-houses-east-5282');
assert.equal(view('?streetAudit=armadni-houses-west-5282'),'armadni-houses-west-5282');
assert.equal(view('?streetAudit=armadni-houses-east-5283'),null);
assert.equal(view('?streetAudit=armadni-891-south-balconies-5285'),'armadni-891-south-balconies-5285');
assert.equal(view('?streetAudit=other'),null);
assert.equal(mount(null,'?streetAudit=armadni-houses-east-5282'),null);
assert.deepEqual(nav('?streetAudit=invalid'),[]);
const links=nav('?v=528500&streetAudit=armadni-houses-east-5282&debug=1');
assert.equal(links.length,3);
assert.deepEqual(links.filter(x=>x.current).map(x=>x.id),['armadni-houses-east-5282']);
assert.deepEqual(links.map(x=>new URLSearchParams(x.href.slice(1)).get('streetAudit')),
 ['armadni-houses-east-5282','armadni-houses-west-5282','armadni-891-south-balconies-5285']);
for(const link of links){
 const params=new URLSearchParams(link.href.slice(1));
 assert.equal(params.get('v'),'528500');
 assert.equal(params.get('debug'),'1');
}
assert.equal(nav('?streetAudit=armadni-houses-west-5282').filter(x=>x.current)[0].id,'armadni-houses-west-5282');
assert.equal(nav('?streetAudit=armadni-891-south-balconies-5285').filter(x=>x.current)[0].id,'armadni-891-south-balconies-5285');
// Audit panel must show only the houses visible in the selected block.
function mockDoc(){
 const elements=[];
 const doc={body:{append(el){elements.push(el)}},createElement(tag){
  return {tag,style:{},append(el){(this.children??=[]).push(el)},set textContent(t){this._text=t},get textContent(){return this._text??''}};
 },getElementById(){return null}};
 return {doc,elements};
}
const eastDoc=mockDoc();
assert(mount(eastDoc.doc,'?streetAudit=armadni-houses-east-5282'));
const eastText=JSON.stringify(eastDoc.elements);
assert(eastText.includes('terasa 13 m²')||eastText.includes('13m²'));
assert(eastText.includes('č.p. 891'));
assert(eastText.includes('5.288: Armádní 890'));
assert(eastText.includes('PROVIZORNÍ'));
const westDoc=mockDoc();
assert(mount(westDoc.doc,'?streetAudit=armadni-houses-west-5282'));
const westText=JSON.stringify(westDoc.elements);
assert(westText.includes('886/887'));
assert(westText.includes('C14'));
assert(westText.includes('C13'));
assert(westText.includes('5.289'));
assert(westText.includes('PROVIZORNÍ'));
assert(westText.includes('5.290'));
assert(westText.includes('1468803911'));
assert(westText.includes('1468803951'));
assert(eastText.includes('5.290'));
assert(eastText.includes('landuse=grass'));
assert(westText.includes('bydleni-milovice.cz/filosofie'));
assert(westText.includes('finmag.cz'));
assert(!westText.includes('5.285: u č.p. 891'));
assert(!westText.includes('13m²'));
assert.equal(E.westProject.assignments.C14,'886');
assert.equal(E.westProject.assignments.C13,'887');
assert.equal(E.westProject.exactBalconyLocationVerified,false);
assert.equal(E.westProject.facadePhotoVerified,false);
const eastPanel=eastDoc.elements[0],westPanel=westDoc.elements[0];
const eastNav=eastPanel.children.find(x=>x.tag==='nav');
const westNav=westPanel.children.find(x=>x.tag==='nav');
assert.equal(eastNav?.children?.length,3);
assert.equal(westNav?.children?.length,3);
assert.equal(eastNav.children.filter(x=>x.tag==='a').length,2);
assert.equal(westNav.children.filter(x=>x.tag==='a').length,2);
assert(eastNav.children.some(x=>x.href==='?streetAudit=armadni-houses-west-5282'));
assert(westNav.children.some(x=>x.href==='?streetAudit=armadni-891-south-balconies-5285'));


const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const token of ["from './scripts/osm-armadni-evidence-5283.js?v=528301'","mountArmadniEvidence5283(document,location.search)","const BUILD_ID='"])assert(html.includes(token),token);
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),source);
console.log('PASS 5.283 real-source Armadni audit without invented facade placement');
