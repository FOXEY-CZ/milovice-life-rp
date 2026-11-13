import assert from 'node:assert/strict';
import {projectFacade,imagePointToFacade,normalizePhotoRectangle,proposeDarkWindowRects,validatePhotoOpenings} from './photo-survey.js';
const quad=[[.10,.10],[.90,.13],[.84,.91],[.20,.92]];
for(const [u,v] of [[0,0],[1,0],[1,1],[0,1],[.27,.49],[.81,.65]]){
 const p=projectFacade(quad,u,v),r=imagePointToFacade(quad,...p);
 assert(p&&r&&Math.abs(r[0]-u)<1e-7&&Math.abs(r[1]-v)<1e-7,'homography inverse');
}
const window=normalizePhotoRectangle([[0,0],[1,0],[1,1],[0,1]],{x:.10,y:.21,w:.18,h:.25});
assert(window&&window.type==='window');
assert.equal(window.x,.10);
assert.equal(window.y,.21);
assert.equal(window.w,.18);
assert.equal(window.h,.25);
assert(!normalizePhotoRectangle([[0,0],[1,0],[1,1],[0,1]],{x:.94,y:.1,w:.15,h:.2}));
assert(!validatePhotoOpenings([{type:'window',x:.9,y:.5,w:.2,h:.2}]));
assert(!validatePhotoOpenings([{type:'door',x:.1,y:.6,w:.1,h:.3},{type:'door',x:.5,y:.6,w:.1,h:.3}]));
assert.equal(validatePhotoOpenings([window]).length,1);
const W=200,H=140,image=new Uint8ClampedArray(W*H*4);
for(let i=0;i<W*H;i++){image[4*i]=205;image[4*i+1]=203;image[4*i+2]=198;image[4*i+3]=255}
for(const [x0,y0,w,h] of [[40,35,24,29],[125,35,24,29],[42,94,22,28]])
 for(let y=y0;y<y0+h;y++)for(let x=x0;x<x0+w;x++){
  const index=(y*W+x)*4;image[index]=46;image[index+1]=55;image[index+2]=60;
 }
const proposed=proposeDarkWindowRects({width:W,height:H,data:image},[[0,0],[1,0],[1,1],[0,1]],{width:200,height:140});
assert(proposed.length===3,'dark regions are image-based window candidates: '+JSON.stringify(proposed));
assert(proposed.every(x=>x.candidate===true));
console.log('OK: 4-corner photo rectification, window rectangle mapping, strict geometry validation, local candidate detection');
