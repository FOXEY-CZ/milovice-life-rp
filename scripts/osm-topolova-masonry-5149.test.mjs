import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {TOPOLOVA_RESIDENTIAL_5148 as S,planTopolovaResidential5148}
 from './osm-topolova-residential-5148.js';
import {TOPOLOVA_CSU_5149 as source,planTopolovaMasonry5149}
 from './osm-topolova-masonry-5149.js';

const region=JSON.parse(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'));
const way=region.elements.find(w=>String(w.id)===S.id);
assert(way&&way.tags['ref:ruian:building']===source.ruian);
const old=JSON.stringify(way);
const block=planTopolovaResidential5148({
 id:way.id,regionId:'mlada',tags:way.tags,geometry:way.geometry,height:18.3});
const plan=planTopolovaMasonry5149({panelPlan:block});
assert(plan,'The original 23-node, 6-storey RÚIAN building must be preserved');
assert.equal(source.address,'Topolová 647, Mladá, Milovice');
assert.equal(source.ruian,'42429056');
assert.equal(source.allStoreys,6);
assert.equal(source.flats,60);
assert.equal(source.loadBearingWalls,'bricks-and-masonry-blocks');
assert(source.liftPresent);
assert.equal(source.footprintAreaSquareMetres,858);
assert.equal(source.enclosedVolumeCubicMetres,16888);
assert.equal(plan.version,'5.149');
assert.equal(plan.address,source.address);
assert(plan.removeFalsePanelSeams&&plan.useExistingGenericWallMaterial);
assert.equal(plan.exteriorColorPhotoVerified,false);
assert(plan.originalFacadeWindowsRemainModel);
assert(plan.originalRoofAndHeightRemainEstimates);
for(const key of ['newDoors','newWindows','newBuildings','newColliders'])
 assert.equal(plan[key],0,'Do not invent facade geometry or colliders');
assert(!plan.footprintChanged&&!plan.roofShapeChanged&&!plan.roadGeometryChanged);
for(const bad of [
 null,{}, {...block,id:'999'}, {...block,regionId:'vrutice'},
 {...block,sourceRUIANId:'0'}, {...block,sourceOSMHash:'invalid'},
 {...block,sourceGeometryExactlyMatched:false}, {...block,floors:7},
 {...block,flats:59},{...block,photographedFacade:true},
 {...block,roofShapeChanged:true},{...block,footprintChanged:true}
])assert.equal(planTopolovaMasonry5149({panelPlan:bad}),null);
assert.equal(JSON.stringify(way),old,'Source OSM coordinates cannot mutate');

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const token of [
 "from './scripts/osm-topolova-masonry-5149.js?v=514900'",
 'const topolovaMasonry=planTopolovaMasonry5149({panelPlan:topolovaPanel});',
 'isPanelBlock&&!topolovaMasonry?panelFacadeMaterials',
 'const estateEdge=estatePlan&&!topolovaMasonry?planMladaPanelEdge(',
 'if(topolovaMasonry){',
 'wallMaterialFromCSU:true',
 'suppressedUnverifiedPanelEdges',
 'streetAudit=topolova-masonry-5149'
])assert(html.includes(token),'Real 5.149 renderer integration missing: '+token);
console.log('PASS 5.149: Topolová 647 officially masonry, no fake panel joints, real OSM/RÚIAN stays unchanged');
