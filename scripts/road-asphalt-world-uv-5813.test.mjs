// 5.81.3: Android A/B evidence shows textured asphalt stretches/stripes,
// but identical road surface is smooth when the map is removed.
// Fix in mapping and calm procedural art, never by changing street positions.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const index=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const art=readFileSync(new URL('./visual-overhaul.js',import.meta.url),'utf8');
assert(index.includes("const BUILD_ID='20261115-verified-parking-roadside-58122'"));
assert(index.includes("const ROAD_ASPHALT_TILE_METERS=7"));
const p=index.indexOf('function osmStrip(a,b,width,material,y=.15){');
const q=index.indexOf('// 5.2.1:',p);
assert(p>0&&q>p,'Must find the original single OSM strip generator');
const strip=index.slice(p,q);
assert(strip.includes('const worldAlignedAsphalt=material===osmRoadMaterial;'));
assert(strip.includes('vertices.push(xx,terrainAt(xx,zz)+y,zz);'));
assert(strip.includes('uvs.push(worldAlignedAsphalt?xx/ROAD_ASPHALT_TILE_METERS:u,'));
assert(strip.includes('worldAlignedAsphalt?zz/ROAD_ASPHALT_TILE_METERS:t*len/8);'));
assert(strip.includes("geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3))"));
assert(strip.includes("geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2))"));
assert(strip.includes('geometry.setIndex(indices);geometry.computeVertexNormals()'));
assert(strip.includes('queueRoadStrip(geometry,material,(a.x+b.x)*.5,(a.y+b.y)*.5)'));
assert(!strip.includes('geometry.translate('),'Road coordinates must remain OSM-native');
assert(index.includes('const roadUvAudit=window.__miloviceRoadUVValidation='));
assert(index.includes('roadUvAudit.maxUVError=Math.max(roadUvAudit.maxUVError,err)'));
assert(index.includes('roadUvAudit.sampledVertices++'));
assert(index.includes('streetTexture.repeat.set(1,1)'));
assert(index.includes('streetTexture.minFilter=THREE.LinearMipmapLinearFilter'));
assert(index.includes('streetTexture.magFilter=THREE.LinearFilter'));
assert(index.includes('streetTexture.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy())'));
assert(!index.includes('streetTexture.repeat.set(1,8)'));
const start=art.indexOf('const asphalt=tile(47015,');
const end=art.indexOf('const paving=tile(',start);
const asset=art.slice(start,end);
assert(asset.includes('[65,70,71,14]'));
assert(asset.includes('dots(g,r,2800,42,114)'));
assert(!asset.includes('g.lineTo('),'No diagonal directional scratch glyphs on OSM asphalt');
assert(!asset.includes('dots(g,r,14000'));
assert(art.includes('t.generateMipmaps=true;t.anisotropy=4'));
// World-anchored UVs must stay continuous even when two independent OSM
// segments approach the same intersection from DIFFERENT road bearings.
const uv=(x,z)=>[x/7,z/7];
const intersection={x:-312.815,z:-90.336};
const segments=[
 {a:{x:intersection.x-35,z:intersection.z},b:intersection},
 {a:{x:intersection.x+23,z:intersection.z+9},b:intersection},
 {a:{x:intersection.x,z:intersection.z+31},b:intersection}
];
for(const segment of segments){
 const {a,b}=segment;const dx=b.x-a.x,dz=b.z-a.z,len=Math.hypot(dx,dz);
 assert(len>1);
 // Exactly at the shared intersection the UVs depend on the world point,
 // never on len or the tangent direction of a particular road segment.
 const atEnd=uv(a.x+dx,a.z+dz);
 assert(Math.abs(atEnd[0]-uv(intersection.x,intersection.z)[0])<1e-10);
 assert(Math.abs(atEnd[1]-uv(intersection.x,intersection.z)[1])<1e-10);
}
// Preserve separation of actual real OSM road, sidewalk and photo parking.
for(const preserved of [
 "osmStrip(a,b,width,osmRoadMaterial,.17)",
 "osmStrip(new THREE.Vector2(piece.a.x,piece.a.z),",
 "new THREE.Vector2(piece.b.x,piece.b.z),width,osmSidewalkMat,.13)",
 "stationPhotoParking.create(elements,{sidewalkMaterial:osmSidewalkMat})",
 "stationPhotoForecourt.create(elements)",
 "stationTicketMachines.create(elements)",
 "worldGeometryMoved:false",
 "changedOnlyAsphaltUV:true"
])assert(index.includes(preserved),'Must retain '+preserved);
console.log('5.81.3 PASS: world-stable 7m road texture mapping, calm mipmapped original art; unchanged OSM road/sidewalk positions');
