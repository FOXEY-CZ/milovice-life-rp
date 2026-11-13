import assert from 'node:assert/strict';
import {PHOTO_STREET_BLOCK,photoFacingEdges,pointFromGps,planDormerRoofSlopes} from './street-photo-block.js';
assert.equal(PHOTO_STREET_BLOCK.length,3);
assert.deepEqual(PHOTO_STREET_BLOCK.map(x=>x.id),['202367194','202367254','118487980']);
assert(PHOTO_STREET_BLOCK.every(x=>x.photoDate==='2024-05-30'&&x.license==='CC BY 4.0'&&
 x.source.includes('commons.wikimedia.org/wiki/File:')&&x.author==='ŠJů'));
const pts=[{x:0,y:0},{x:15,y:0},{x:15,y:9},{x:0,y:9}];
const front=photoFacingEdges(pts,{x:7.5,z:-12},{limit:2});
assert.equal(front[0].index,0,'photo on north side should choose corresponding visible wall');
assert(front.every(e=>e.len>=4&&e.visibility>-.12));
assert.equal(photoFacingEdges(pts,{x:999,z:999},{minLength:16}).length,0);
const p=pointFromGps(50.226,14.889);
assert(Math.abs(p.x)<1e-3&&Math.abs(p.z)<1e-3);
console.log('Photo street block OK: 3 independently georeferenced Commons landmarks, exterior wall selection and no fake dimensions');

for(const width of [2.12,2.35,2.65]){
 const [left,right]=planDormerRoofSlopes(width,.94);
 assert.equal(left.side,-1);assert.equal(right.side,1);
 assert(left.rotationZ>0&&right.rotationZ<0);
 assert(Math.abs(left.rotationZ+right.rotationZ)<1e-9);
 assert(Math.abs(left.panelLength-right.panelLength)<1e-9);
}
