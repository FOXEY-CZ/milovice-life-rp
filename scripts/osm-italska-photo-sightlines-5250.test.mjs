// Milovice RP 5.250 — previous OSM photo-facing wall selection versus
// geometrically unobstructed wall midpoint from both source photo GPS points.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planItalskaVojenskeZatisi5249 as plan,
 renderItalskaVojenskeZatisi5249 as render}
 from './osm-italska-vojen-zatisi-5249.js';
import {filterItalskaPhotoSightlines5250 as filter}
 from './osm-italska-photo-sightlines-5250.js';
const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const building=JSON.parse(raw).elements.find(e=>e.id===53865882);
assert(building);
const candidate=plan({regionId:'mlada',building});
assert.equal(candidate?.visibleEdges.length,15);
const good=filter({plan:candidate,geometry:building.geometry});
assert.equal(good?.version,'5.250');
assert.equal(good.photoFacingCandidates5250,15);
assert.equal(good.occludedOriginalWallEdges5250,3);
assert.deepEqual(good.visibleEdges.map(e=>e.edge),
 [6,9,11,12,13,14,16,18,19,21,22,24]);
assert(good.visibleEdges.every(e=>e.sightlineUnobstructed5250&&
 e.photoCameraCount>0&&e.modelEstimated));
assert.equal(good.modelVisibilityApproximate,true);
assert.equal(good.newEntrances,0);
assert.equal(good.newColliders,0);
const corrupt=structuredClone(building.geometry);
corrupt[0].lon+=.000001;
assert.equal(filter({plan:candidate,geometry:corrupt}),null);
assert.equal(filter({plan:{...candidate,sourceHash:'00000000'},
 geometry:building.geometry}),null);
assert.equal(filter({plan:{...candidate,visibleEdges:[
 ...candidate.visibleEdges,candidate.visibleEdges[0]]},
 geometry:building.geometry}),null);
class BufferGeometry{
 setAttribute(k,v){this[k]=v}
 computeVertexNormals(){}
 computeBoundingSphere(){}
}
class Float32BufferAttribute{constructor(array,size){this.array=array;this.size=size}}
class MeshStandardMaterial{constructor(o){this.options=o}}
class Mesh{constructor(geometry,material){
 this.geometry=geometry;this.material=material;
 this.userData={};this.visible=true;this.parent=null;
}}
const layer={children:[],add(mesh){mesh.parent=this;this.children.push(mesh)}};
const THREE={BufferGeometry,Float32BufferAttribute,MeshStandardMaterial,Mesh,
 DoubleSide:'both'};
const visual=render(THREE,{plan:good,layer,baseHeight:4,roofHeight:6.1});
assert.equal(visual?.drawMeshes,2);
assert.equal(visual.trimEdges,12);
assert.equal(visual.wearPatches,11);
assert.equal(visual.decorativeTriangles,68);
assert.equal(visual.newColliders,0);
assert.equal(visual.visibleAfterLOD(),2);
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),raw);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const token of [
 "from './scripts/osm-italska-photo-sightlines-5250.js?v=525000'",
 'filterItalskaPhotoSightlines5250({',
 'window.__miloviceItalskaSightlineRuntime5250=()=>',
 'Verze 5.252'
])assert(html.includes(token),'missing 5.250 integration: '+token);
const meta=html.match(/<meta name="milovice-build" content="([^"]+)"/)?.[1];
const id=html.match(/const BUILD_ID='([^']+)'/)?.[1];
const hud=html.split('id="build-label">')[1]?.split('</strong>')[0];
assert(meta&&meta===id&&id===hud);
console.log('PASS 5.250: 12 visible OSM wall edges, 3 self-occluded removed, 11 wear patches, 2 mesh batches');
