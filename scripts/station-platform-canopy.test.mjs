// Milovice RP 5.57 — real rail-side platform canopy, mobile geometry regression.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {PLATFORM_CANOPY_OSM,PLATFORM_CANOPY_SOURCE,
 planStationPlatformCanopy,createStationPlatformCanopy} from './station-platform-canopy.js';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const els=JSON.parse(read('data/milovice-osm.json')).elements;
const byId=id=>els.find(e=>e.id===id);
const XY=p=>({x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 z:-(p.lat-50.226)*111320});
const station=byId(PLATFORM_CANOPY_OSM.station);
const platform=byId(PLATFORM_CANOPY_OSM.platform);
assert.equal(station.tags.building,'train_station');
assert.equal(platform.tags.railway,'platform');
assert.equal(platform.tags.shelter,'yes','Only an OSM-declared sheltered train platform can spawn an awning');
const shell=station.geometry.map(XY),polygon=platform.geometry.map(XY);
const tracks=els.filter(e=>e.tags?.railway==='rail').map(e=>e.geometry.map(XY));
const options={station:shell,platform:polygon,tracks};
const plan=planStationPlatformCanopy(options);
assert(plan.railFacing&&plan.streetFacingRoofCount===0,'Never reintroduce the fake station street-side canopy');
assert.equal(plan.estimated,true,'Photographic proportions must not claim surveyed precision');
assert(plan.segments.length>=1&&plan.segments.length<=3,'Only a restrained section of the mapped platform can be roofed');
assert(plan.metres>10&&plan.metres<24.6,'Old fake 29m awning must never return');
assert(plan.segments.every(s=>s.length>4.4&&s.width<=3));
assert(plan.segments.every(s=>s.placement==='platform-polygon-facing-wall'));
assert(plan.segments.every(s=>s.railClearance>3.9),'Canopy must be outside live track envelope');
assert(plan.segments.every((s,i)=>i===0||s.edge===plan.segments[i-1].edge+1),
 'A canopy must not jump across an unmatched station-wall notch and float');
assert.equal(PLATFORM_CANOPY_SOURCE.license,'CC BY-SA 3.0');
assert.equal(PLATFORM_CANOPY_SOURCE.taken,'2013-05-25');
assert(PLATFORM_CANOPY_SOURCE.photo.startsWith('https://commons.wikimedia.org/wiki/File:'));
const reverse=planStationPlatformCanopy({...options,station:shell.slice().reverse(),platform:polygon.slice().reverse()});
assert.equal(reverse.segments.length,plan.segments.length,
 'Winding orientation of OSM polygon must not swap roof onto road side');
assert(Math.abs(reverse.metres-plan.metres)<.002,
 'Reversed polygon must yield same sheltered facade length');
const wrongId=planStationPlatformCanopy({...options,platformId:123456});
assert.equal(wrongId.segments.length,0,'Wrong mapped platform cannot spawn canopy');
assert.equal(wrongId.reason,'unknown-OSM-site');
const missing=planStationPlatformCanopy({...options,platform:[]});
assert.equal(missing.segments.length,0,'Missing platform fails closed');
const streetOnly=planStationPlatformCanopy({...options,
 platform:polygon.map(p=>({x:p.x+1000,z:p.z}))});
assert.equal(streetOnly.segments.length,0,'Rail shelter cannot be placed when map polygon is far away');
const fakedWidth=planStationPlatformCanopy({...options,spanWidth:15});
assert.equal(fakedWidth.segments.length,0,'Cannot fabricate giant road-spanning canopy');
const nearbyRail=planStationPlatformCanopy({...options,
 tracks:[shell.slice(0,2)] /* at the building, block the roof */]});
assert(nearbyRail.segments.length<=plan.segments.length,
 'Track clearance remains safe for short 2-point rail ways');
const script=read('index.html');
for(const marker of [
 "from './scripts/station-platform-canopy.js?v=5570'",
 'planStationPlatformCanopy({',
 'createStationPlatformCanopy(THREE,{layer:osmLayer,stationBaseY,plan})',
 'window.__miloviceLandmarkDebug.stationGroundBase=baseHeight',
 "e.tags?.railway==='platform'&&e.tags?.shelter==='yes'",
 'window.__miloviceStationPlatformCanopy={',
 'stationSideAwningRemoved=true'
])assert(script.includes(marker),'Missing visible 3D scene integration '+marker);
// Rendering factory regression with minimal THREE-shaped WebGL model stubs:
// 3 meshes max, one instanced group of high-mounted bracket members, and
// absolutely no vertical ground columns.
class V3 {
 constructor(x=0,y=0,z=0){this.x=x;this.y=y;this.z=z}
 set(x,y,z){this.x=x;this.y=y;this.z=z;return this}
 length(){return Math.hypot(this.x,this.y,this.z)}
 normalize(){const l=this.length()||1;this.x/=l;this.y/=l;this.z/=l;return this}
 copy(v){return this.set(v.x,v.y,v.z)}
}
class Mesh {
 constructor(geometry,material){this.geometry=geometry;this.material=material;this.userData={};this.position=new V3()}
}
class InstancedMesh extends Mesh {
 constructor(g,m,n){super(g,m);this.instanceMatrix={};this.count=n;this.stored=[]}
 setMatrixAt(i,matrix){this.stored[i]=matrix}
 computeBoundingSphere(){}
}
class Object3D {
 constructor(){this.position=new V3();this.quaternion={setFromUnitVectors(){}};this.scale={set(){}}}
 updateMatrix(){this.matrix={}}
}
class BufferGeometry {setAttribute(k,v){this[k]=v}computeVertexNormals(){}}
class Float32BufferAttribute{constructor(values,size){this.values=values;this.itemSize=size}}
class BoxGeometry{constructor(...size){this.size=size}}
class MeshLambertMaterial{constructor(opts){this.options=opts}}
const mock={BufferGeometry,Float32BufferAttribute,BoxGeometry,Mesh,
 InstancedMesh,Object3D,Vector3:V3,MeshLambertMaterial,DoubleSide:2};
const layer={children:[],add(mesh){this.children.push(mesh)}};
const invalid=createStationPlatformCanopy(mock,{layer,plan});
assert.equal(invalid.drawMeshes,0,'Cannot place floating roof without exact station base elevation');
assert.equal(layer.children.length,0);
const drawn=createStationPlatformCanopy(mock,{layer,plan,stationBaseY:192.3});
assert.equal(drawn.drawMeshes,3,'One canopy mesh + soffit mesh + instanced beam mesh');
assert.equal(drawn.segments,plan.segments.length);
assert.equal(drawn.noGroundColumns,true);
assert.equal(drawn.streetSideCanopy,false);
assert.equal(drawn.stationBaseY,192.3);
assert.equal(layer.children.length,3);
assert(layer.children[0].geometry.position.values.every(Number.isFinite));
const ys=layer.children[0].geometry.position.values.filter((v,i)=>i%3===1);
assert(ys.every(y=>y>195.2&&y<195.8),'Roof height tied to station base, not varying terrain');
assert(layer.children[2].count>=3,'Cantilever should have visible structural brackets');
assert.equal(layer.children[2].stored.length,layer.children[2].count);
console.log('5.57 rail-side station canopy regression PASS',JSON.stringify({
 mapIds:PLATFORM_CANOPY_OSM,roofSections:plan.segments.length,
 roofMetres:+plan.metres.toFixed(2),drawMeshes:drawn.drawMeshes,
 bracketCount:drawn.bracketCount,photoDate:PLATFORM_CANOPY_SOURCE.taken,
 noRoadsideRoof:true,noGroundColumns:true
}));
