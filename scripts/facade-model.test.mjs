import assert from 'node:assert/strict';
import {normalizeVerifiedFacades,selectFacadeEdges,planFaceOpenings} from './facade-model.js';
const base={status:'seen',source:'https://commons.wikimedia.org/wiki/Test',notes:'photo inspection',
 layout:{rows:'2,3',windowWidth:'1.2',windowHeight:'1.25',doorAt:'left',doorWidth:'1.04',wallColor:'#C1A075'}};
const result=normalizeVerifiedFacades({N:base,S:{...base,status:'unreviewed'},
 W:{...base,source:'javascript:alert(1)'},E:{...base,layout:{rows:'4,2',doorAt:'none'}}});
assert.deepEqual(Object.keys(result),['N','E']);
assert.deepEqual(result.N.rows,[2,3]);
assert.equal(result.N.wallColor,'#c1a075');
assert.equal(result.N.doorAt,'left');
assert.equal(result.N.shutters,null);
const shutters=normalizeVerifiedFacades({N:{...base,layout:{...base.layout,shutters:'yes'}}});
assert.equal(shutters.N.shutters,true);
assert.deepEqual(result.E.rows,[4,2]);
assert(!normalizeVerifiedFacades({N:{...base,layout:{rows:'3,7,not-a-number'}}}).N);
assert(!normalizeVerifiedFacades({N:{...base,layout:{rows:'99'}}}).N);
assert(!normalizeVerifiedFacades({N:{...base,notes:'  '}}).N);
const points=[{x:0,y:0},{x:12,y:0},{x:12,y:10},{x:0,y:10}];
const dirs=selectFacadeEdges(points);
assert.deepEqual([...dirs.values()].sort(),['E','N','S','W']);
assert.equal(dirs.get(0),'N');assert.equal(dirs.get(1),'E');
assert.equal(dirs.get(2),'S');assert.equal(dirs.get(3),'W');
const a=planFaceOpenings({length:12,height:7.2,levels:2,side:result.N});
assert.equal(a.door.x,12*.22);
assert.equal(a.door.w,1.04);
assert.equal(a.windows.length,4,'a ground-floor window conflicting with the left door is correctly removed');
const b=planFaceOpenings({length:12,height:7.2,levels:2,side:result.E});
assert.equal(b.door,null);
assert.equal(b.windows.length,6);
const c=planFaceOpenings({length:12,height:7.2,levels:2,legacyWindows:3,autoEntrance:true});
assert(c.door);assert(c.windows.length>0);
assert.equal(planFaceOpenings({length:12,height:7.2,levels:2,side:{rows:[0,0],doorAt:'none'}}).windows.length,0);
const photoEvidence={kind:'local-owned-photo',sha256:'a'.repeat(64),rightsConfirmed:true};
const annotated=normalizeVerifiedFacades({S:{
 status:'seen',source:'',notes:'My authorized photo, full facade four-corner calibrated',
 photoEvidence,
 layout:{photoConfirmed:true,openings:[
  {type:'window',x:.12,y:.25,w:.12,h:.20},
  {type:'window',x:.65,y:.21,w:.13,h:.22},
  {type:'door',x:.42,y:.69,w:.11,h:.31}
 ]}}
}});
assert.equal(annotated.S.openings.length,3);
assert.equal(annotated.S.source,'');
assert.equal(annotated.S.photoEvidence.sha256,'a'.repeat(64));
const coords=planFaceOpenings({length:12,height:7.2,levels:2,side:annotated.S});
assert.equal(coords.windows.length,2);
assert.equal(coords.door.x,12*.475);
assert(Math.abs(coords.windows[0].x-12*.18)<.01);
assert(Math.abs(coords.windows[0].y-7.2*.55)<.01);
assert.equal(coords.photoMapped,true);
assert.equal(normalizeVerifiedFacades({N:{status:'seen',notes:'test',photoEvidence,
 layout:{openings:[{type:'window',x:.1,y:.1,w:.1,h:.1}]}}}).N,undefined,
 'unconfirmed photo detections must NEVER enter final geometry');
assert.equal(normalizeVerifiedFacades({N:{status:'seen',notes:'test',
 photoEvidence:{...photoEvidence,rightsConfirmed:false},
 layout:{photoConfirmed:true,openings:[{type:'window',x:.1,y:.1,w:.1,h:.1}]}}}).N,undefined,
 'photo annotations without license attestation must not become game assets');
console.log('Verified per-facade 3D contract OK: evidence, cardinal wall matching, per-floor windows, door placement and geometry');
