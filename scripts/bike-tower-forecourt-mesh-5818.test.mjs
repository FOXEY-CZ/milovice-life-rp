// Milovice RP 5.81.14: test the generated REAL mesh topology, not only
// the OSM point planner. Prevent disconnected triangles, reversed faces,
// duplicated overlapping apron+ribbon patches and accidental extra drawcalls.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRoadClearance} from './road-clearance.js';
import {stationGpsToWorld} from './station-forecourt-pass.js';
import {makeBikeTowerEntryPavingScene,planBikeTowerEntryPaving}
 from './bike-tower-entry-paving.js';

const elements=JSON.parse(readFileSync(new URL('../data/milovice-osm.json',
 import.meta.url),'utf8')).elements;
const clearance=createRoadClearance();
for(const el of elements){
 const kind=el.tags?.highway;
 if(!kind||!el.geometry?.length)continue;
 const width=kind==='primary'?11:kind==='secondary'?9:kind==='tertiary'?8:
  kind==='pedestrian'?4:kind==='footway'?1.8:
  kind==='path'||kind==='steps'?1.65:kind==='cycleway'?2:
  kind==='service'?4.5:7.8;
 clearance.addRoad({id:el.id,points:el.geometry.map(stationGpsToWorld),
  kind,width});
}
const p=planBikeTowerEntryPaving(elements,clearance);
assert(p?.singleContinuousSurface);
const material={name:'shared-existing-sidewalk-material'};
const layers=[];
const layer={
 add(mesh){assert(!layers.length);layers.push(mesh);mesh.parent=this},
 remove(mesh){const i=layers.indexOf(mesh);assert(i>=0);layers.splice(i,1);mesh.parent=null}
};
class Attribute{
 constructor(data,itemSize){
  this.array=Float32Array.from(data);this.itemSize=itemSize;
  this.count=this.array.length/itemSize;
 }
}
class Geometry{
 constructor(){this.attributes={};this.disposed=false;this.index=null}
 setAttribute(name,value){this.attributes[name]=value}
 setIndex(values){this.index={array:Uint32Array.from(values),count:values.length}}
 computeVertexNormals(){this.normalsComputed=true}
 dispose(){this.disposed=true}
}
class Mesh{
 constructor(geometry,shared){this.geometry=geometry;this.material=shared;
  this.userData={};this.parent=null}
}
globalThis.window={};
const THREE={BufferGeometry:Geometry,Float32BufferAttribute:Attribute,Mesh};
const scene=makeBikeTowerEntryPavingScene(THREE,{layer,terrainAt:()=>0,
 roadClearance:clearance});
const first=scene.create(elements,{sidewalkMaterial:material});
assert.equal(first.active,true);
assert.equal(first.drawCalls,1);
assert.equal(first.oneContinuousSurface,true);
assert.equal(first.preservedGreenery,true);
assert.equal(first.materialReused,true);
assert.equal(first.uvAlignedWithMappedFootway,true);
assert.equal(first.endAlignedWithMappedFootway,true);
assert.equal(first.estimatedPavedAreaM2>25,true);
assert.equal(first.roadClearanceVerified,true);
assert.equal(layers.length,1);
const mesh=layers[0],geo=mesh.geometry;
assert.equal(mesh.material,material);
assert.equal(geo.attributes.position.count,(6+24+1)*13);
assert.equal(geo.attributes.uv.count,geo.attributes.position.count);
assert.equal(first.triangles,30*12*2);
assert.equal(geo.index.count,first.triangles*3);
assert(geo.normalsComputed);
assert.equal(mesh.userData.singleContinuousSurface,true);
const pos=geo.attributes.position.array,ix=geo.index.array;
const uv=geo.attributes.uv.array,basis=p.connector.textureBasis;
const forward=basis.longitudinal,lateral=basis.lateral,origin=basis.origin;
assert(Math.abs(forward.x*lateral.x+forward.z*lateral.z)<1e-12,
 'Mapped-footway UV axes must be orthogonal');
for(const k of [0,6,12,145,201,390,396,402]){
 const dx=pos[3*k]-origin.x,dz=pos[3*k+2]-origin.z;
 const expectedU=.5+(dx*lateral.x+dz*lateral.z)/1.8;
 const expectedV=(dx*forward.x+dz*forward.z)/8;
 assert(Math.abs(uv[2*k]-expectedU)<1e-5,
  'Paving across-UV must have SAME 1.8m scale as actual OSM sidewalk');
 assert(Math.abs(uv[2*k+1]-expectedV)<1e-5,
  'Paving along-UV must have SAME 8m scale/origin as actual OSM sidewalk');
}
const endDelta={x:p.connector.end.x-origin.x,z:p.connector.end.z-origin.z};
assert(Math.abs(.5+(endDelta.x*lateral.x+endDelta.z*lateral.z)/1.8-.5)<1e-8,
 'Connection endpoint must remain on mapped sidewalk UV centerline');
const n=geo.attributes.position.count,parent=Array.from({length:n},(_,i)=>i);
const root=x=>{while(parent[x]!==x)x=parent[x]=parent[parent[x]];return x};
const link=(a,b)=>{parent[root(a)]=root(b)};
let projectedArea=0;
for(let k=0;k<ix.length;k+=3){
 const [a,b,c]=[ix[k],ix[k+1],ix[k+2]];
 assert(a<n&&b<n&&c<n);
 link(a,b);link(b,c);
 const ax=pos[a*3],az=pos[a*3+2],
  bx=pos[b*3],bz=pos[b*3+2],
  cx=pos[c*3],cz=pos[c*3+2];
 const twice=(bz-az)*(cx-ax)-(bx-ax)*(cz-az);
 assert(twice>.00001,'All triangles face UP, no degenerate fold/overlap');
 projectedArea+=twice/2;
}
assert.equal(new Set(parent.map((_,i)=>root(i))).size,1,
 'All 403 vertices must form ONE connected 3D mesh');
assert(projectedArea>25&&projectedArea<60);
assert(Math.abs(projectedArea-p.connector.estimatedAreaM2)<5,
 'True mesh area and road-validated planned area must agree');
const rows=p.connector.forecourtRows;
assert.equal(rows.length,31);
const padFront=rows[6],firstLink=rows[7];
assert(Math.hypot(padFront.x-firstLink.x,padFront.z-firstLink.z)>.01);
const final=rows.at(-1);
assert(Math.hypot(final.x-p.connector.end.x,final.z-p.connector.end.z)<.00001);
const footwayUnit=p.connector.textureBasis.longitudinal;
assert(Math.abs(final.side.x*footwayUnit.x+final.side.z*footwayUnit.z)<1e-9,
 'Ending cross-section must be perpendicular to the actual mapped sidewalk');
const again=scene.create(elements,{sidewalkMaterial:material});
assert.deepEqual(again,first);
assert.equal(layers.length,1,'Calling create twice must not add another surface');
scene.reset();
assert.equal(layers.length,0);
assert.equal(geo.disposed,true,'Geometry disposed on city reset');
assert.equal(scene.status().active,false);
assert.equal(scene.status().drawCalls,0);
scene.create(elements,{sidewalkMaterial:material});
assert.equal(layers.length,1,'After reset exactly one mesh recreated');
scene.reset();
delete globalThis.window;
console.log('5.81.14 MESH PASS',JSON.stringify({
 vertices:n,triangles:first.triangles,meshComponents:1,
 areaM2:+projectedArea.toFixed(2),maxWidth:+p.connector.widestWidth.toFixed(2),
 nearestRoadMargin:+p.connector.otherRoadMargin.toFixed(3),
 oneDrawCall:true,sharedSidewalkMaterial:true,resetVerified:true
}));
