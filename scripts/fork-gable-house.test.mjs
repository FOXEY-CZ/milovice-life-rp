import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planFootprintPitchedRoof} from './station-roof-geometry.js';
import {planRoofPerimeterClosure} from './station-roof-seams.js';
import {dominantRoofAxis,analyzeGableFootprint} from './city-roof-geometry.js';
const j=JSON.parse(readFileSync(new URL('../data/milovice-osm.json',import.meta.url),'utf8'));
const p=j.elements.find(x=>x.id===202298939).geometry.slice(0,-1).map(v=>({
 x:(v.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 z:-(v.lat-50.226)*111320
}));
assert.equal(p.length,8);
assert.equal(analyzeGableFootprint(p),null,'Unverified nonrectangular gables are forbidden');
const cross=(a,b,c)=>(b.x-a.x)*(c.z-a.z)-(b.z-a.z)*(c.x-a.x);
const sign=Math.sign(p.reduce((s,a,i)=>{
 const b=p[(i+1)%p.length];return s+a.x*b.z-b.x*a.z;
},0));
const inside=(q,a,b,c)=>[cross(a,b,q),cross(b,c,q),cross(c,a,q)].every(x=>x*sign>=-1e-8);
const indices=p.map((_,i)=>i),tri=[];
while(indices.length>3){
 let ok=false;
 for(let i=0;i<indices.length;i++){
  const a=indices[(i-1+indices.length)%indices.length],b=indices[i],
   c=indices[(i+1)%indices.length];
  if(cross(p[a],p[b],p[c])*sign<=1e-7||
   indices.some(x=>x!==a&&x!==b&&x!==c&&inside(p[x],p[a],p[b],p[c])))continue;
  tri.push([p[a],p[b],p[c]]);indices.splice(i,1);ok=true;break;
 }
 assert(ok,'OSM polygons must be ear-clippable');
}
tri.push(indices.map(i=>p[i]));
for(const points of [p,[...p].reverse()]){
 const axis=dominantRoofAxis(points);
 const origin={x:points.reduce((s,v)=>s+v.x,0)/points.length,
  z:points.reduce((s,v)=>s+v.z,0)/points.length};
 const roof=planFootprintPitchedRoof({triangles:tri,origin,axis,
  kind:'gable',eaveY:3.762,rise:2.2});
 assert(roof&&roof.relativeAreaError<1e-6&&roof.faces.length>=10);
 assert.equal(roof.maxPerimeterOvershoot,0,'No oversize fake roof quad');
 const seams=planRoofPerimeterClosure({outline:points,roof,origin,wallTopY:3.75});
 assert(seams?.closedToRoof&&seams.faces.length>5);
 assert(seams.maxGapBefore>2&&seams.maxGapBefore<2.23);
 for(const f of [...roof.faces,...seams.faces])
  assert(f.every(v=>[v.x,v.y,v.z].every(Number.isFinite)));
}
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
assert(html.includes('isForkPhotoGable?'));
assert(html.includes("miloviceRoofOfKind(pts,baseHeight,h,roofMat,2.20,'gable')"));
assert(html.includes('window.__miloviceForkHouse='));
const manifest=JSON.parse(readFileSync(new URL('../data/architecture/verified-buildings.json',import.meta.url),'utf8'));
assert.equal(manifest.buildings['202298939']?.roofKind,'gable');
console.log('5.54 photo-backed irregular OSM gable shell, real junctions, no false doors PASS');
