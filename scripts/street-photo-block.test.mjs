import assert from 'node:assert/strict';
import {PHOTO_STREET_BLOCK,photoFacingEdges,pointFromGps,planDormerRoofSlopes,planArchedDormerWindow} from './street-photo-block.js';
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

for(const width of [.91,1.05,1.48]){
 const a=planArchedDormerWindow({width,segments:16});
 assert(a?.outer.length===19&&a.inner.length===19);
 assert(a.archTop>a.shoulder&&a.glassTop>a.shoulder);
 assert(a.glassTop<a.archTop);
 assert(Math.abs(a.outer[0].x+a.outer[1].x)<1e-10);
 assert(Math.abs(a.outer[0].y-a.outer[1].y)<1e-10);
 // The springline ends of both semicircles must actually meet their straight jambs.
 assert(Math.abs(a.outer[2].y-a.shoulder)<1e-10);
 assert(Math.abs(a.outer.at(-1).x+a.width*.5)<1e-8);
 assert(Math.abs(a.outer.at(-1).y-a.shoulder)<1e-8);
 assert(a.inner[0].x>a.outer[0].x&&a.inner[1].x<a.outer[1].x);
}
assert.equal(planArchedDormerWindow({width:0}),null);
assert.equal(planArchedDormerWindow({width:1,segments:2}),null);
assert.equal(planArchedDormerWindow({width:1,border:.7}),null);
const html=await import('node:fs').then(f=>f.readFileSync(new URL('../index.html',import.meta.url),'utf8'));
assert(!html.includes('const roofTrim=new THREE.LineLoop('),'Never add generic horizontal dark borders to all pitched houses');
assert(html.includes('unverifiedRoofOutlinesSuppressed++'));
const hero=await import('node:fs').then(f=>f.readFileSync(new URL('./hero-architecture.js',import.meta.url),'utf8'));
assert(hero.includes('const photoAnchored=Boolean(override?.source)'));
assert(hero.includes('!photoAnchored&&randomShutters'));
assert(hero.includes('suppressedUnverifiedPhotoOrnaments'));
console.log('5.29.0 Školská 220/1 actual arched attic windows, no invented shutters or floating roof outlines PASS');
