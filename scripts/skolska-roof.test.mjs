import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planCityBuildingRoof} from './city-roof-geometry.js';
import {planSkolskaRoofJoins,planSkolskaDormerRoof,SKOLSKA_WAY_ID} from './skolska-roof.js';
const osm=JSON.parse(readFileSync(new URL('../data/milovice-osm.json',import.meta.url),'utf8'));
const way=osm.elements.find(el=>el.type==='way'&&el.id===SKOLSKA_WAY_ID);
assert(way&&way.geometry&&way.tags.building==='residential');
const coords=way.geometry;
const original=coords.slice(0,-1).map(p=>({
 x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 z:-(p.lat-50.226)*111320
}));
assert.equal(original.length,7);
const published=JSON.parse(readFileSync(new URL('../data/architecture/verified-buildings.json',import.meta.url),'utf8'));
const houseCard=published.buildings[String(SKOLSKA_WAY_ID)];
assert.equal(houseCard.height,'3.75',
 '2024 photograph shows one full exterior wall storey, NOT two stacked rows of windows');
assert.equal(houseCard.floors,'2',
 'The mapped second level is the usable attic under the photographed roof');
assert(houseCard.notes.includes('NOT surveyed'));
function cross(a,b,c){return (b.x-a.x)*(c.z-a.z)-(b.z-a.z)*(c.x-a.x)}
function inTri(p,a,b,c){
 const s=cross(a,b,c)>=0?1:-1;
 return s*cross(a,b,p)>=-1e-8&&s*cross(b,c,p)>=-1e-8&&
  s*cross(c,a,p)>=-1e-8;
}
function earcutRing(poly){
 const signed=poly.reduce((sum,p,i)=>{
  const q=poly[(i+1)%poly.length];return sum+p.x*q.z-q.x*p.z;
 },0);
 const winding=Math.sign(signed),indices=poly.map((_,i)=>i),triangles=[];
 while(indices.length>3){
  let found=false;
  for(let j=0;j<indices.length;j++){
   const ia=indices[(j+indices.length-1)%indices.length],
    ib=indices[j],ic=indices[(j+1)%indices.length];
   const a=poly[ia],b=poly[ib],c=poly[ic];
   if(winding*cross(a,b,c)<1e-8)continue;
   if(indices.some(k=>k!==ia&&k!==ib&&k!==ic&&inTri(poly[k],a,b,c)))continue;
   triangles.push([a,b,c]);indices.splice(j,1);found=true;break;
  }
  assert(found,'OSM polygon must be triangulatable');
 }
 triangles.push(indices.map(i=>poly[i]));
 return triangles;
}
const triangles=earcutRing(original);
assert.equal(triangles.length,5);
const roof=planCityBuildingRoof({
 footprint:original,triangles,baseY:6.112,rise:2.3,kind:'hip'
});
assert(roof&&roof.relativeAreaError<1e-5);
const join=planSkolskaRoofJoins({
 outline:original,roof,origin:roof.origin,wallTopY:6.10,eaveWidth:.30
});
assert(join?.closedWallAndEave);
assert(join.wallSections>0&&join.joinFaces.length>3,
 'A seven-sided roof must actually close its formerly hovering plaster edge');
assert(join.maxWallGap>.10&&join.maxWallGap<3,
 'Actual Školská OSM footprint must have a measurable former roof-wall gap');
assert.equal(join.eave.exteriorEdges,7);
assert.equal(join.eave.closedEndCaps,0);
assert(join.eave.maxActualOverhang>.29&&join.eave.maxActualOverhang<.56);
assert(join.eave.tiles.length>=10&&join.eave.soffit.length>=10);
assert(join.eave.fascia.length>=10&&join.eave.exactPlanePartitions);
for(const faces of [join.joinFaces,join.eave.tiles,join.eave.soffit,join.eave.fascia])
 for(const tri of faces)for(const v of tri)
  assert([v.x,v.y,v.z,v.u,v.v].every(Number.isFinite));
const d=planSkolskaDormerRoof({width:2.12,depth:1.38});
assert(d?.closed&&d.roofFaces.length===4&&d.soffitFaces.length===4);
assert.equal(d.fasciaFaces.length,12);
assert(d.roofFaces.every(tri=>{
 const [a,b,c]=tri;
 return (b.z-a.z)*(c.x-a.x)-(b.x-a.x)*(c.z-a.z)>0;
}),'All dormer roof top facets must face upward, never inside-out');
assert(d.minX>-1.4&&d.maxX<1.4);
assert(d.frontZ<1&&d.rearZ>-.9,
 'Photo dormer roof must stay within a real small gable, not extend metres');
assert(d.eaveY<1.43&&d.ridgeY>2.35);
assert.equal(planSkolskaDormerRoof({width:8}),null);
const index=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const photo=readFileSync(new URL('./street-photo-block.js',import.meta.url),'utf8');
assert(index.includes('const isSkolskaRoof=osmId===SKOLSKA_WAY_ID;'));
assert(index.includes("miloviceRoofOfKind(pts,baseHeight,h,roofMat,2.30,'hip',true)"));
assert(index.includes('const fixed=source&&planSkolskaRoofJoins({'));
assert(index.includes("wallTopY:baseHeight+h,eaveWidth:.30"));
assert(index.includes('Milovice_skolska_220_wall_to_roof'));
assert(index.includes('Milovice_skolska_220_roof_soffit'));
assert(photo.includes('joinedRoofFaces(p,joined.roofFaces,roof)'));
assert(photo.includes('joinedRoofFaces(p,joined.soffitFaces,roof)'));
assert(photo.includes('joinedRoofFaces(p,joined.fasciaFaces,roof)'));
assert(!photo.includes('arch.scale.y=.33'));
console.log('5.29.1 Školská 220/1: real seven-edge OSM, roof facade seal, .30m solid eaves, 2 sealed dormer gables PASS');
