import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {synthesizeFacadePixels} from './facade-surface-kit.js';
for(const kind of ['stucco','plinth','glass']){
 const px=synthesizeFacadePixels(kind,128);
 assert(px instanceof Uint8Array);
 assert.equal(px.length,128*128*4);
 assert.deepEqual(px,synthesizeFacadePixels(kind,128),
  'The facade pattern must be stable across reloads and devices');
 let low=255,high=0,avg=0;
 for(let i=0;i<px.length;i+=4){
  assert.equal(px[i+3],255);
  for(let c=0;c<3;c++){
   low=Math.min(low,px[i+c]);
   high=Math.max(high,px[i+c]);
   avg+=px[i+c];
  }
 }
 avg/=px.length*.75;
 assert(high-low>12,kind+' lost its visible fine surface finish');
 assert(low>=160&&avg>200&&avg<255,
  kind+' darkens individually approved building colours too far');
}
assert.equal(synthesizeFacadePixels('fake',128),null);
assert.equal(synthesizeFacadePixels('stucco',0),null);
assert.equal(synthesizeFacadePixels('stucco',1024),null);
const hero=readFileSync(new URL('./hero-architecture.js',import.meta.url),'utf8');
for(const signature of [
 'const sharedSurfaces=makeSharedFacadeSurfaceMaps(THREE);',
 'mats.wall.map=sharedSurfaces.stucco;',
 'mats.base.map=sharedSurfaces.plinth;',
 'mats.glass.map=sharedSurfaces.glass;',
 'sharedSurfaceTextures:3,surfaceResolution:128,extraMaterialDrawCalls:0'
])assert(hero.includes(signature),'Missing shared no-new-draw-call material contract: '+signature);
assert(!hero.includes('new THREE.CanvasTexture('),
 'Hero facades must not allocate a texture per house');
console.log('Facade surface 5.34 PASS: three shared 128px materials, stable pixels, no per-house textures');
