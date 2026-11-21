// Milovice RP 5.249: original RÚIAN footprint + photographic source,
 // no invented street infrastructure or copied photo pixels.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ITALSKA_VOJENSKE_ZATISI_5249 as source,
 planItalskaVojenskeZatisi5249 as plan,
 renderItalskaVojenskeZatisi5249 as render}
 from './osm-italska-vojen-zatisi-5249.js';
const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const elements=JSON.parse(raw).elements;
const building=elements.find(e=>e.id===53865882);
assert(building,'source building missing from original OSM');
assert.equal(building.tags['ref:ruian:building'],'40057411');
assert.equal(building.geometry.length,29);
const input={regionId:'mlada',building};
const good=plan(input);
assert(good,'source-locked photo style must match the original export');
assert.equal(good.sourceOsmId,'53865882');
assert.equal(good.originalVertices,29);
assert(Math.abs(good.originalAreaSquareMetres-913.64)<.03);
assert.equal(good.visibleEdges.length,15);
assert.equal(good.photoViews,2);
assert.equal(good.wallHex,'#eeeae4');
assert.equal(good.roofHex,'#655e54');
assert.equal(good.osmFloorCountUnspecified,true,
 'Never claim source floor count was mapped to OSM');
assert(good.visibleEdges.every(e=>e.modelEstimated&&
 e.len>1.6&&e.photoCameraCount>=1&&
 Number.isFinite(e.nx)&&Number.isFinite(e.nz)));
assert.equal(new Set(good.visibleEdges.map(e=>e.edge)).size,15);
assert.equal(good.originalFootprintPreserved,true);
assert.equal(good.originalRoofGeometryPreserved,true);
assert.equal(good.newWindows,0);
assert.equal(good.newEntrances,0);
assert.equal(good.newStreetFurniture,0);
assert.equal(plan({...input,regionId:'vrutice'}),null);
assert.equal(plan({...input,photoReviewed:true}),null);
assert.equal(plan({...input,approvedArchitecture:true}),null);
assert.equal(plan({...input,building:{...building,id:53865877}}),null);
assert.equal(plan({...input,building:{...building,tags:{
 ...building.tags,'building:levels':'2'}}}),null);
assert.equal(plan({...input,building:{...building,tags:{
 ...building.tags,building:'residential'}}}),null);
const shifted=structuredClone(building);
shifted.geometry[0].lat+=.000001;
assert.equal(plan({...input,building:shifted}),null,
 'Do not adapt a photo style to an edited/incompatible footprint');
const reordered=structuredClone(building);
reordered.geometry.reverse();
assert.equal(plan({...input,building:reordered}),null,
 'Fail closed if source polygon vertex order changes');
class BufferGeometry{
 setAttribute(key,val){this[key]=val}
 computeVertexNormals(){this.normalsComputed=true}
 computeBoundingSphere(){this.boundsComputed=true}
}
class Float32BufferAttribute{
 constructor(array,size){this.array=array;this.size=size}
}
class MeshStandardMaterial{constructor(opts){this.options=opts}}
class Mesh{constructor(geo,mat){
 this.geometry=geo;this.material=mat;this.userData={};this.visible=true;
 this.parent=null;
}}
const THREE={BufferGeometry,Float32BufferAttribute,MeshStandardMaterial,Mesh,
 DoubleSide:'both'};
const layer={children:[],add(mesh){this.children.push(mesh);mesh.parent=this}};
const visual=render(THREE,{layer,plan:good,baseHeight:4,roofHeight:6.1});
assert(visual);
assert.equal(visual.drawMeshes,2);
assert.equal(layer.children.length,2);
assert.equal(visual.trimEdges,15);
assert.equal(visual.wearPatches,13);
assert.equal(visual.decorativeTriangles,82);
assert.equal(visual.visibleAfterLOD(),2);
assert.equal(visual.inScene(),true);
assert.equal(visual.newColliders,0);
assert.equal(visual.wearLocationsMeasured,false);
assert(layer.children.every(e=>e.geometry.boundsComputed&&
 e.geometry.normalsComputed&&e.userData.lodDetail===true));
assert(layer.children.every(e=>
 e.geometry.position.array.every(Number.isFinite)));
for(const mesh of layer.children)mesh.visible=false;
assert.equal(visual.visibleAfterLOD(),0);
assert.equal(render(THREE,{layer,plan:good,baseHeight:4,roofHeight:2}),null);
assert.equal(render(THREE,{layer,plan:null,baseHeight:4,roofHeight:6}),null);
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),raw,
 'original OSM source must not be modified');
assert(source.photos.every(u=>u.startsWith('https://commons.wikimedia.org/wiki/File:')));
assert.equal(source.license,'CC BY-SA 4.0');
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const token of [
 "from './scripts/osm-italska-vojen-zatisi-5249.js?v=524900'",
 'planItalskaVojenskeZatisi5249({',
 'renderItalskaVojenskeZatisi5249(THREE,{',
 'window.__miloviceItalskaVojenskeZatisiRuntime5249=()=>',
 "'italska-vojen-zatisi-5249':{",
 'Verze 5.251'
])assert(html.includes(token),'5.249 integration missing '+token);
const meta=html.match(/<meta name="milovice-build" content="([^"]+)"/)?.[1];
const id=html.match(/const BUILD_ID='([^']+)'/)?.[1];
const hud=html.split('id="build-label">')[1]?.split('</strong>')[0];
assert(meta&&meta===id&&id===hud);
console.log('PASS 5.249: original '+good.sourceOsmId+
 ' / RÚIAN 40057411, 15 photo-facing original facade edges, 2 batches, '+
 visual.wearPatches+' estimated aged-plaster accents, no source/physics edits');
