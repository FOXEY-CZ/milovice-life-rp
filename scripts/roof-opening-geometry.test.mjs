import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {clipRoofFacesForFeatures} from './roof-opening-geometry.js';
import {planCityBuildingRoof} from './city-roof-geometry.js';
import {planPhotoRoofFeatures,PHOTO_ROOF_PROFILES} from './street-photo-block.js';
const p=(x,z,y=0)=>({x,y,z,u:x*.23,v:z*.23});
const area2=(a,b,c)=>Math.abs((b.x-a.x)*(c.z-a.z)-(b.z-a.z)*(c.x-a.x))*.5;
const inTriangle=(pt,tri)=>{
 const [a,b,c]=tri,sgn=(a,b,c)=>(b.x-a.x)*(c.z-a.z)-(b.z-a.z)*(c.x-a.x);
 const v=[sgn(a,b,pt),sgn(b,c,pt),sgn(c,a,pt)];
 return v.every(x=>x>=-1e-5)||v.every(x=>x<=1e-5);
};
const faces=[
 [p(0,0,3),p(12,0,3),p(12,8,4)],
 [p(0,0,3),p(12,8,4),p(0,8,4)]
];
const rect={cx:6,cz:0,nx:0,nz:-1,width:2.5,depth:3.6,front:.4,id:'original'};
const output=clipRoofFacesForFeatures(faces,[rect]);
assert(output?.cutoutVerified);
assert.equal(output.featureCount,1);
assert(output.removedArea>3);
assert(output.retainedArea<output.sourceArea);
assert(!output.faces.some(t=>inTriangle(p(6,2),t)),
 'A visible attic window must not have a roof polygon inside it');
assert(output.faces.some(t=>inTriangle(p(1,2),t)),
 'Clipping a window MUST preserve roof on the left side');
assert(output.faces.some(t=>inTriangle(p(10,2),t)),
 'Clipping a window MUST preserve roof on the right side');
assert(output.faces.every(t=>t.every(v=>[v.x,v.y,v.z,v.u,v.v].every(Number.isFinite))));
const same=clipRoofFacesForFeatures(faces,[]);
assert.equal(same.faces.length,faces.length);
assert.equal(same.removedArea,0);
assert.equal(clipRoofFacesForFeatures(faces,[{...rect,width:200}]),null);
assert.equal(clipRoofFacesForFeatures(faces,[{...rect,nx:0,nz:0}]),null);
const rotated=Math.PI*.34,move={x:120,z:-41},rot=q=>{
 const x=q.x*Math.cos(rotated)-q.z*Math.sin(rotated)+move.x,
  z=q.x*Math.sin(rotated)+q.z*Math.cos(rotated)+move.z;
 return {...q,x,z,u:x*.23,v:z*.23};
};
const rotatedFaces=faces.map(t=>t.map(rot));
const n=rot({x:rect.nx,z:rect.nz});
const rotatedRect={...rect,cx:rot({x:6,z:0}).x,cz:rot({x:6,z:0}).z,
 nx:(rect.nx*Math.cos(rotated)-rect.nz*Math.sin(rotated)),
 nz:(rect.nx*Math.sin(rotated)+rect.nz*Math.cos(rotated))};
const altered=clipRoofFacesForFeatures(rotatedFaces,[rotatedRect]);
assert(altered?.cutoutVerified);
assert(Math.abs(altered.removedArea-output.removedArea)<1e-5,
 'Rotating an entire irregular city block must not change roof opening area');
// Make sure the real Školská photo evidence drives the geometry automatically
// from OSM rather than being duplicated as guessed vertex positions.
const data=JSON.parse(readFileSync(new URL('../data/milovice-osm.json',import.meta.url),'utf8'));
const way=data.elements.find(el=>el.id===118487980);
const ring=way.geometry.slice(0,-1).map(pt=>({
 x:(pt.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 z:-(pt.lat-50.226)*111320
}));
const features=planPhotoRoofFeatures('118487980',ring);
assert.equal(features.length,2);
assert.equal(features[0].source,PHOTO_ROOF_PROFILES['118487980'].evidence);
assert(features.every(f=>f.profile.arched===true));
const index=readFileSync(new URL('../index.html',import.meta.url),'utf8');
assert(index.includes('clipRoofFacesForFeatures(data.faces,openings)'));
assert(index.includes('const wallJoin=cut(fixed.joinFaces'));
assert(index.includes('const soffit=cut(fixed.eave.soffit'));
assert(index.includes('const fascia=cut(fixed.eave.fascia'));
assert(index.includes('photoRoofFeatures.length!==2'));
console.log('Roof System 2.0: grounded cross-gables, 2D roof cutouts, UV, rotated geometry, no window intersections PASS');
